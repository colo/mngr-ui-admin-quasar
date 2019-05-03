
<script>
// import the module here instead of in `src/store/index.js`

import * as Debug from 'debug'
const debug = Debug('mngr-ui:components:mixins:dashboard')
// const debug_internals = Debug('mngr-ui:components:mixins:dashboard:Internals')
// const debug_events = Debug('mngr-ui:components:mixins:dashboard:Events')

import dashboardStoreModule from 'src/store/dashboard'

// import { EventBus } from 'boot/eventbus'

import { debounce } from 'quasar'

import { mapState } from 'vuex'

import moment from 'moment/moment'

const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24

import dashboardMenu from '@components/dashboard/menu.vue'

import dashboardMenuTabs from '@components/dashboard/menu.tabs.vue'

import chart from 'components/chart'
import chartTabular from 'components/chart.tabular'

import chartEmptyContainer from 'components/chart.empty.container'

export default {
  components: {
    dashboardMenu,
    dashboardMenuTabs,
    chart,
    chartTabular,
    chartEmptyContainer
  },

  __events_watcher: undefined,
  __pipelines_events: {},
  /**
  * should be user session configs?
  **/
  // stat_blacklist: /^[a-zA-Z0-9_\.]+$/i,
  // tabular_blacklist: /^[a-zA-Z0-9_\.]+$/i,
  stat_whitelist: undefined,
  tabular_whitelist: undefined,

  charts_stat_whitelist: undefined,
  charts_tabular_whitelist: undefined,

  charts_stat_blacklist: undefined,
  charts_tabular_blacklist: undefined,

  charts_payloads: {},
  collapsibles: {},
  pipelines: {},

  // __unwatchers__: {},
  unwatchers: {},

  daterangepicker: undefined,

  data () {
    return {
      // EventBus: EventBus,
      id: undefined,

      charts: {},
      available_charts: {},

      stat_init: false,
      tabular_init: false,
      reactive_data: {}, // manually merged stats

      visibility: {},

      daterangepicker: undefined,
      freeze_daterangepicker_update: false
    }
  },

  watch: {
    'theme': function (current, old) {
      /**
      * set color based on current theme
      **/
      Object.each(this.available_charts, function (chart, source) {
        this.__set_chart_color(source)
        // this.$set(
        //   this.available_charts[source].chart,
        //   'options',
        //   Object.merge(
        //     this.available_charts[source].chart.options,
        //     this.$store.state['dashboard_' + this.id].theme[this.theme].dygraph
        //   )
        // )

        // debug('watch theme', source)
      }.bind(this))
    },
    'id': function (id, old) {
      // if (process.env.DEV) { if (process.env.DEV) debug('id', id) }

      this.__dashboard_module(id, old)

      if (process.env.DEV) debug('id', id)
    }
  },

  computed: Object.merge(
    mapState({
      graph_always_update: function (state) {
        if (this.id && state['dashboard_' + this.id] && state['dashboard_' + this.id].options.graph.always_update !== undefined) {
          debug('graph_always_update', state['dashboard_' + this.id].options.graph.always_update)
          return state['dashboard_' + this.id].options.graph.always_update
        } else {
          return false
        }
      },
      // events: state => state.dashboard.events.list,
      theme: function (state) {
        return state.app.theme.current
      },

      events: function (state) {
        return (this.id && state['dashboard_' + this.id]) ? state['dashboard_' + this.id].events.list : undefined
      },

      range: function (state) {
        // console.log('EVENTS', this.id)
        debug('computed range', state['dashboard_' + this.id].range)

        if (this.id && state['dashboard_' + this.id] && state['dashboard_' + this.id].range.length > 0) {
          return state['dashboard_' + this.id].range
        } else {
          return [Date.now() - (MINUTE * 5), Date.now()]
        }
      },

      // paths: state => state.app.paths,
      reset: state => state.app.reset,

      paused: state => state.app.pause,
      freezed: state => state.app.freeze,

      // seconds: function(state){
      //   // //////////////////console.log('state.app.range', state.app.range)
      //
      //   let end = Date.now()
      //   if(
      //     this.range
      //     && this.range[1]
      //     && this.range != null
      //   )
      //     end = this.range[1]
      //
      //   let start = Date.now() - (MINUTE * 5) //5 mins default
      //   if(
      //     this.range
      //     && this.range[0] && this.range[0] != null
      //   )
      //     start = this.range[0]
      //
      //   let seconds = Math.trunc( (end - start) / 1000 )
      //
      //   return seconds
      //   // return 300
      // },

      // dashboard_charts: function(state){
      //   // let host = state.hosts.current || this.$route.params.host
      //   if(this.id && state['dashboard_'+this.id].charts && Object.getLength(state['dashboard_'+this.id].charts) > 0){
      //     // //console.log('dashboard_charts', state['dashboard_'+host].charts)
      //     return state['dashboard_'+this.id].charts
      //   }
      //   else{
      //     return undefined
      //   }
      // },
      dashboard_instances: function (state) {
        // let host = state.hosts.current || this.$route.params.host
        if (this.id && state['dashboard_' + this.id] && Object.getLength(state['dashboard_' + this.id].instances) > 0) {
        // if(this.id && state['dashboard_'+this.id].instances){
        // if(this.id){
          // //console.log('dashboard_instances', state['dashboard_'+host].instances)
          return state['dashboard_' + this.id].instances
        } else {
          return undefined
        }
      },
      dashboard_paths: function (state) {
        // let host = state.hosts.current || this.$route.params.host
        // if(this.id && state['dashboard_'+this.id].paths && state['dashboard_'+this.id].paths.length > 0){
        if (this.id && state['dashboard_' + this.id]) {
          // //console.log('dashboard_instances', state['dashboard_'+host].instances)
          return state['dashboard_' + this.id].paths
        } else {
          return undefined
        }
      }

    })
    // {
    //   all_init: function () {
    //     debug('all_init',
    //       this.id,
    //       this.dashboard_paths !== undefined,
    //       this.dashboard_instances !== undefined,
    //       this.stat_init === true,
    //       this.tabular_init === true
    //     )
    //
    //     return (
    //       this.id !== undefined &&
    //       this.dashboard_paths !== undefined &&
    //       this.dashboard_instances !== undefined &&
    //       this.stat_init === true &&
    //       this.tabular_init === true
    //     )
    //
    //     // if(
    //     //   // this.dashboard_charts != undefined &&
    //     //   this.id !== undefined
    //     //   && this.dashboard_paths != undefined
    //     //   && this.dashboard_instances != undefined
    //     //   && this.stat_init == true
    //     //   && this.tabular_init == true
    //     //   // && this.range.length > 0
    //     //   // && Object.getLength(this.$store.state.stats_sources) > 0
    //     //   // && Object.getLength(this.$store.state.tabulars_sources) > 0
    //     // ){
    //     // // if(this.dashboard_charts != undefined){
    //     //   return true
    //     // }
    //     // else{
    //     //   return false
    //     // }
    //   }
    // }
  ),

  methods: {
    __dashboard_module: function (id, old) {
      debug('__dashboard_module', id, old)

      if (!process.env.DEV) { if (old && this.$store.state['dashboard_' + old]) { this.$store.unregisterModule('dashboard_' + old) } }
      // if (old && this.$store.state['dashboard_' + old]) { this.$store.unregisterModule('dashboard_' + old) }

      if (id && !this.$store.state['dashboard_' + id]) { this.$store.registerModule('dashboard_' + id, Object.clone(dashboardStoreModule)) }
    },

    create_pipelines: function (next) {},
    destroy_pipelines: function () {},
    /**
    * @start - events
    **/
    __build_biggest_range: function (first, second) {
      let event = Object.clone(first)
      let start = 0
      let end = 0

      if (first.onRange && first.onRange.Range) {
        start = (first.onRange.Range.substring(first.onRange.Range.indexOf(' ') + 1, first.onRange.Range.indexOf('-'))) * 1
        end = (first.onRange.Range.substring(first.onRange.Range.indexOf('-') + 1, first.onRange.Range.indexOf('/'))) * 1
      }

      if (second.onRange && second.onRange.Range) {
        let second_start = (first.onRange.Range.substring(first.onRange.Range.indexOf(' ') + 1, first.onRange.Range.indexOf('-'))) * 1
        let second_end = (first.onRange.Range.substring(first.onRange.Range.indexOf('-') + 1, first.onRange.Range.indexOf('/'))) * 1

        start = (start < second_start) ? start : second_start
        end = (end > second_end) ? end : second_end
      }

      event.onRange.Range = 'posix ' + start + '-' + end + '/*'

      // console.log('__build_biggest_range', first, second, start, end, event)

      return event
    },

    __parse_event: function (event, stat) {
      let { type, opts } = event
      let { path, tabular } = stat
      let e = {}
      e[type] = {}

      if (type === 'onRange') {
        Object.each(opts, function (opt, name) {
          if (name === 'range') {
            e[type].Range = 'posix ' + opt[0] + '-' + opt[1] + '/*'
          } else {
            e[type][name] = opt
          }
        })
      } else if (opts) {
        e[type] = opts
      }

      e[type]['path'] = path
      e[type]['tabular'] = tabular

      return e
    },
    // fire_pipelines_events: throttle(function(){
    // fire_pipelines_events: debounce(function(){
    fire_pipelines_events: function () {
      let _events_paths = []
      Object.each(this.$options.__pipelines_events, function (pipes, pipe_name) {
        _events_paths.combine(pipes)
      })
      // console.log('fire_pipelines_events',this.$options.__pipelines_events, _events_paths, this.paths, Object.getLength(this.available_charts))

      // if (this.all_init && Object.getLength(this.$options.__pipelines_events)) {
      if (Object.getLength(this.$options.__pipelines_events)) {
        if (process.env.DEV) debug('fire_pipelines_events', this.$options.__pipelines_events, _events_paths, this.paths, Object.getLength(this.available_charts))

        // console.log('fire_pipelines_events',this.$options.__pipelines_events, this.paths)
        /**
        * first match app.paths with options path, if all matched, remove'em,
        * so the range event is fired for host instead of each path
        */
        // let all_path_matched = false

        // if(all_path_matched === false){

        Object.each(this.$options.__pipelines_events, function (pipeline, name) {
          let events = {}
          let pipe = this.$options.pipelines[name]

          while (pipeline.length > 0) {
            let event = pipeline.shift()
            // let {options, event} = obj
            // eval('pipe.'+options)
            // console.log('firing pipe', event_name, event)
            let event_name = Object.keys(event)[0]

            if (!events[event_name]) events[event_name] = []
            events[event_name].push(Object.clone(event[event_name]))

            // pipe.fireEvent(event_name, event[event_name])

            /**
              * removed queue, works better with rethinkdb lauching all events at once
              */
            // __events_queue.push({pipeline: pipe, event: event}, function(event){
            //   //// console.log('EVENT fired', event, new Date())
            // })
          }
          Object.each(events, function (arr_events, type) {
            console.log('firing...', type, arr_events)
            pipe.fireEvent(type, [arr_events])
          })

          delete this.$options.__pipelines_events[name]
        }.bind(this))

        // this.$store.commit('dashboard_'+this.id+'/events/clean')
      }
      // else{
      //   this.$nextTick(this.fire_pipelines_events())
      // }

    // }, 100),
    },
    __set_pipeline_event: function (payload) {
      let { pipeline, event } = payload

      // //// console.log('__set_pipeline_event', payload)
      if (!this.$options.__pipelines_events[pipeline]) { this.$options.__pipelines_events[pipeline] = [] }

      // let obj = {options: pipeline.options, event}
      // if(this.$options.__pipelines_events[pipeline].length === 0){
      //   this.$options.__pipelines_events[pipeline].push(event)
      // }
      // else{
      let found = false
      Array.each(this.$options.__pipelines_events[pipeline], function (pipe_event, index) {
        // found = false
        // if(pipe_event === event){
        // found = true

        let pipe_event_name = Object.keys(pipe_event)[0]
        let event_name = Object.keys(event)[0]

        // let prop_matched = true
        if (pipe_event_name === event_name) {
          // Object.each(event[event_name], function(val, prop){
          //   if(prop !== 'Range' || prop !== 'opt'){
          //      if(!pipe_event[pipe_event_name][prop] || pipe_event[pipe_event_name][prop] !== val)
          //       prop_matched = false
          //   }
          // })
          // if(pipe_event[pipe_event_name]['path'] && pipe_event[pipe_event_name]['path'] === event[event_name]['path']){
          if (
            pipe_event[pipe_event_name]['path'] === event[event_name]['path'] &&
                pipe_event[pipe_event_name]['tabular'] === event[event_name]['tabular']
          ) {
            found = index
            // console.log('_set_pipelines_events FOUND', pipe_event, event, index)
          }

          // if(prop_matched === true){
          //   found = index
          //   // console.log('_set_pipelines_events FOUND', pipe_event, event, index)
          // }
        }
        // }
      })

      if (found === false) {
        this.$options.__pipelines_events[pipeline].push(event)
      } else { // replace it as ranges get updated
        this.$options.__pipelines_events[pipeline][found] = this.__build_biggest_range(event, this.$options.__pipelines_events[pipeline][found])
      }
      // }

      // console.log('_set_pipelines_events', JSON.parse(JSON.stringify(this.$options.__pipelines_events[pipeline])))
    },
    /**
    * @end - events
    **/
    /**
    * @start - charts
    **/
    add_chart: function (payload) {
      let { name, chart, init, watch, watcher } = payload

      this.$set(this.charts, name, chart)

      if (init && typeof init === 'function') { init(payload) }
    },
    remove_chart: function (name, options) {
      options = options || {}

      if (this.charts[name] && this.charts[name].stop && typeof this.charts[name].stop === 'function') { this.charts[name].stop(this.charts[name]) }

      this.$delete(this.charts, name)
    },
    remove_charts: function (options) {
      Object.each(this.charts, function (chart, name) {
        this.remove_chart(name, options)
      }.bind(this))
    },

    __init_charts: function () {
    },

    // __process_dashboard_charts: function(doc){
    //   ////console.log('recived doc via Event charts', doc)
    //   // let counter = 0
    //   let charts_objects = {}
    //   Object.each(doc.charts, function(data, name){
    //     if(data.chart){
    //       // this.$options.charts_objects[name] = data.chart
    //       charts_objects[name] = data.chart
    //     }
    //     else{//named chart like os.cpus->times os.cpus->percentage
    //
    //       Object.each(data, function(chart_data, chart_name){
    //         // this.$options.charts_objects[name+'.'+chart_name] = chart_data.chart
    //         charts_objects[name+'.'+chart_name] = chart_data.chart
    //       }.bind(this))
    //
    //     }
    //
    //     // if(counter === Object.getLength(doc.charts) - 1)
    //     //   this.charts_objects_init = true
    //     //
    //     // counter++
    //   }.bind(this))
    //
    //   this.$store.commit('dashboard_'+this.id+'/charts', charts_objects)
    // },
    __process_dashboard_paths: function (doc) {
      if (process.env.DEV) debug('__process_dashboard_paths', doc, this.id)

      if (doc && this.host === doc.host && doc.paths && Array.isArray(doc.paths)) {
        // this.$eventbus.$off('paths', this.__process_dashboard_paths)
        let _paths = JSON.parse(JSON.stringify(this.$store.state['dashboard_' + this.id].paths)).combine(doc.paths)
        if (this.id && _paths.length !== this.$store.state['dashboard_' + this.id].paths.length) {
          this.$store.commit('dashboard_' + this.id + '/paths', _paths)
        }
      }
      // let paths = []
      // if(doc.paths && doc.paths !== null)
      //   Array.each(doc.paths, function(path){
      //     paths[] =
      //   }.bind(this))
      // let counter = 0
      // let instances_objects = {}
      // Object.each(doc.instances, function(data, name){
      //   // if(data.instance){
      //   //   // this.$options.instances_objects[name] = data.instance
      //   //   instances_objects[name] = data.instance
      //   // }
      //   // else{//named instance like os.cpus->times os.cpus->percentage
      //
      //     Object.each(data, function(instance_data, instance_name){
      //       // this.$options.instances_objects[name+'.'+instance_name] = instance_data.instance
      //       let path = name+'_'+instance_name
      //       path = path.replace(/\./g, '_')
      //       Object.each(instance_data, function(value, key){
      //         let new_key = key.replace(/\%/g, 'percentage_')
      //         if (process.env.DEV) debug('__process_dashboard_instances key', key, instance_data)
      //         delete instance_data[key]
      //         instance_data[new_key] = value
      //       })
      //       instances_objects[path] = instance_data
      //     }.bind(this))
      //
      //   // }
      //
      //   // if(counter === Object.getLength(doc.instances) - 1)
      //   //   this.instances_objects_init = true
      //   //
      //   // counter++
      // }.bind(this))

      // this.$store.commit('dashboard_'+this.id+'/instances', instances)
    },
    __process_dashboard_instances: function (doc) {
      if (process.env.DEV) debug('__process_dashboard_instances', doc, this.host === doc.host, doc.instances, doc.instances !== null)
      let instances = {}
      if (this.host === doc.host && doc.instances && doc.instances !== null && Object.getLength(doc.instances) >= 1) { // last one is a BUG
        // this.$eventbus.$off('instances', this.__process_dashboard_instances)

        Object.each(doc.instances, function (instance, name) {
          instances[doc.host + '_' + name] = instance
        })

        if (process.env.DEV) debug('__process_dashboard_instances commit', doc, this.host === doc.host, doc.instances, doc.instances !== null)

        if (this.id && Object.getLength(instances) !== Object.getLength(this.$store.state['dashboard_' + this.id].instances)) { this.$store.commit('dashboard_' + this.id + '/instances', instances) }
      }
      // let counter = 0
      // let instances_objects = {}
      // Object.each(doc.instances, function(data, name){
      //   // if(data.instance){
      //   //   // this.$options.instances_objects[name] = data.instance
      //   //   instances_objects[name] = data.instance
      //   // }
      //   // else{//named instance like os.cpus->times os.cpus->percentage
      //
      //     Object.each(data, function(instance_data, instance_name){
      //       // this.$options.instances_objects[name+'.'+instance_name] = instance_data.instance
      //       let path = name+'_'+instance_name
      //       path = path.replace(/\./g, '_')
      //       Object.each(instance_data, function(value, key){
      //         let new_key = key.replace(/\%/g, 'percentage_')
      //         if (process.env.DEV) debug('__process_dashboard_instances key', key, instance_data)
      //         delete instance_data[key]
      //         instance_data[new_key] = value
      //       })
      //       instances_objects[path] = instance_data
      //     }.bind(this))
      //
      //   // }
      //
      //   // if(counter === Object.getLength(doc.instances) - 1)
      //   //   this.instances_objects_init = true
      //   //
      //   // counter++
      // }.bind(this))
    },
    /**
    * @end - charts
    **/

    /**
    * @start - STATS
    **/
    __process_dashboard_data_range: function (payload) {
      if (process.env.DEV) debug('__process_dashboard_data_range', payload)

      if (this.freeze_daterangepicker_update === false && this.id) {
        // if (process.env.DEV) debug('__process_dashboard_data_range', payload, this.daterangepicker, this.$refs[this.id + '.daterangepicker'])

        let range_minutes = ((payload.data_range.end - payload.data_range.start) / 1000) / 60

        // if (this.$store.state['dashboard_' + this.id] && this.$store.state['dashboard_' + this.id].data_range[0] !== payload.data_range.start) { this.$refs[this.id + '.daterangepicker'].setStartDate(moment(payload.data_range.start)) }
        //
        // if (this.$store.state['dashboard_' + this.id] && this.$store.state['dashboard_' + this.id].data_range[1] !== payload.data_range.end) { this.$refs[this.id + '.daterangepicker'].setEndDate(moment(payload.data_range.end)) }

        // if (range_minutes > 5 && payload.data_range.start < Date.now() - MINUTE * 5) { this.$set(this.daterangepicker.ranges, 'Last 5 mins', [moment().subtract(5, 'minute'), moment()]) }
        //
        // if (range_minutes > 15 && payload.data_range.start < Date.now() - MINUTE * 15) { this.$set(this.daterangepicker.ranges, 'Last 15 mins', [moment().subtract(15, 'minute'), moment()]) }
        //
        // if (range_minutes > 30 && payload.data_range.start < Date.now() - MINUTE * 30) { this.$set(this.daterangepicker.ranges, 'Last 30 mins', [moment().subtract(30, 'minute'), moment()]) }
        //
        // if (range_minutes > 60 && payload.data_range.start < Date.now() - HOUR) { this.$set(this.daterangepicker.ranges, 'Last Hour', [moment().subtract(1, 'hour'), moment()]) }
      }

      if (this.id && this.$store.state['dashboard_' + this.id]) { this.$store.commit('dashboard_' + this.id + '/data_range', [payload.data_range.start, payload.data_range.end]) }
    },
    // __process_dashboard_data: function (payload) {},
    /**
    * @last
    **/
    __process_dashboard_data: function (payload) {
      debug('__process_dashboard_data', payload)
      // if(payload.range === true)
      // //console.log('recived doc via Event stats', payload)

      // let type = (payload.tabular === true) ? 'tabular' : 'stat'
      let { type } = payload

      let init = (type === 'tabular') ? 'tabular_init' : 'stat_init'
      // let iterate = (type === 'tabulars') ? payload.stats : payload.stats.data
      let whitelist = (type === 'tabular') ? this.$options.tabular_whitelist : this.$options.stat_whitelist
      let blacklist = (type === 'tabular') ? this.$options.tabular_blacklist : this.$options.stat_blacklist

      let counter = 0
      if (payload[type]) {
        if (Object.getLength(payload[type]) > 0) {
          Object.each(payload[type], function (data, path) {
            let new_path
            let new_val
            if (Array.isArray(data)) {
              // if((whitelist && whitelist.test(path)) || (blacklist && !blacklist.test(path)))
              // if (process.env.DEV) debug('__process_dashboard_data', payload.key + '_' + path)

              if (this.__white_black_lists_filter(whitelist, blacklist, path)) {
                this.$store.commit('dashboard_' + this.id + '/' + type + '_sources/add', { key: payload.key + '_' + path, value: data })
              }
            } else {
              Object.each(data, function (value, key) {
                if (Array.isArray(value)) {
                  // if((whitelist && whitelist.test(path+'.'+key)) || (blacklist && !blacklist.test(path+'.'+key)))
                  // if (process.env.DEV) debug('__process_dashboard_data', payload.key + '_' + path + '_' + key)

                  if (this.__white_black_lists_filter(whitelist, blacklist, path + '_' + key)) {
                    this.$store.commit('dashboard_' + this.id + '/' + type + '_sources/add', { key: payload.key + '_' + path + '_' + key, value: value })
                  }
                } else {
                  // 3rd level, there is no need for more
                  Object.each(value, function (val, sub_key) {
                    // if (process.env.DEV) debug('__process_dashboard_data', payload.key + '_' + path + '_' + key + '_' + sub_key)

                    if (this.__white_black_lists_filter(whitelist, blacklist, path + '_' + key + '_' + sub_key)) {
                      this.$store.commit('dashboard_' + this.id + '/' + type + '_sources/add', { key: payload.key + '_' + path + '_' + key + '_' + sub_key, value: val })
                    }
                  }.bind(this))
                }
              }.bind(this))
            }

            if (counter === Object.getLength(payload[type]) - 1) {
              this.$set(this, init, true)
              // this[init] = true
              this.$emit(type + '_sources')
            }

            counter++
          }.bind(this))
        }
        // else{
        //   this.$set(this, init, true)
        // }
      }
    },
    // __process_dashboard_data: function (payload) {
    //   if (process.env.DEV) debug('__process_dashboard_data', payload)
    //   // if(payload.range === true)
    //   // //console.log('recived doc via Event stats', payload)
    //
    //   // let type = (payload.tabular === true) ? 'tabular' : 'stat'
    //   let { type } = payload
    //   let init = (type === 'tabular') ? 'tabular_init' : 'stat_init'
    //   // let iterate = (type === 'tabulars') ? payload.stats : payload.stats.data
    //   let whitelist = (type === 'tabular') ? this.$options.tabular_whitelist : this.$options.stat_whitelist
    //   let blacklist = (type === 'tabular') ? this.$options.tabular_blacklist : this.$options.stat_blacklist
    //
    //   let counter = 0
    //   if (payload[type]) {
    //     if (Object.getLength(payload[type]) > 0) {
    //       Object.each(payload[type], function (data, path) {
    //         let new_path
    //         let new_val
    //         if (Array.isArray(data)) {
    //           // if((whitelist && whitelist.test(path)) || (blacklist && !blacklist.test(path)))
    //
    //           if (this.__white_black_lists_filter(whitelist, blacklist, path)) {
    //             this.$store.commit('dashboard_' + this.id + '/' + type + '_sources/add', { key: payload.key + '_' + path, value: data })
    //           }
    //         } else {
    //           Object.each(data, function (value, key) {
    //             if (Array.isArray(value)) {
    //               // if((whitelist && whitelist.test(path+'.'+key)) || (blacklist && !blacklist.test(path+'.'+key)))
    //               if (process.env.DEV) debug('__process_dashboard_data', payload.key + '_' + path + '_' + key)
    //
    //               if (this.__white_black_lists_filter(whitelist, blacklist, path + '_' + key)) {
    //                 this.$store.commit('dashboard_' + this.id + '/' + type + '_sources/add', { key: payload.key + '_' + path + '_' + key, value: value })
    //               }
    //             } else {
    //               // 3rd level, there is no need for more
    //               Object.each(value, function (val, sub_key) {
    //                 if (process.env.DEV) debug('__process_dashboard_data', payload.key + '_' + path + '_' + key + '_' + sub_key)
    //
    //                 if (this.__white_black_lists_filter(whitelist, blacklist, path + '_' + key + '_' + sub_key)) {
    //                   this.$store.commit('dashboard_' + this.id + '/' + type + '_sources/add', { key: payload.key + '_' + path + '_' + key + '_' + sub_key, value: val })
    //                 }
    //               }.bind(this))
    //             }
    //           }.bind(this))
    //         }
    //
    //         if (counter === Object.getLength(payload[type]) - 1) { this.$set(this, init, true) }
    //
    //         counter++
    //       }.bind(this))
    //     } else {
    //       this.$set(this, init, true)
    //     }
    //   }
    // },
    __white_black_lists_filter: function (whitelist, blacklist, str) {
      let filtered = false
      if (!blacklist && !whitelist) {
        filtered = true
      } else if (blacklist && !blacklist.test(str)) {
        filtered = true
      } else if (blacklist && blacklist.test(str) && (whitelist && whitelist.test(str))) {
        filtered = true
      } else if (!blacklist && (whitelist && whitelist.test(str))) {
        filtered = true
      }

      return filtered
    },
    /**
    * @end - STATS
    **/

    /**
    * @start life cycle
    **/
    __clean_create: function (next) {
      if (next) { next() }
    },

    __create: function (host, next) {
      // this.$eventbus.$once('charts', this.__process_dashboard_charts)

      // should be $on probably, not $once
      this.$eventbus.$on('instances', this.__process_dashboard_instances.bind(this))

      this.$eventbus.$on('paths', this.__process_dashboard_paths.bind(this))

      this.$eventbus.$on('stat', this.__process_dashboard_data.bind(this))
      this.$eventbus.$on('tabular', this.__process_dashboard_data.bind(this))
      this.$eventbus.$on('data_range', this.__process_dashboard_data_range.bind(this))

      // this.update_daterangepicker()

      // let __init = function (next) {
      //   // this.set_range(moment().subtract(10, 'minute'), moment())
      //
      //   // if (this.all_init === true) {
      //   this.__init_charts()
      //   this.$nextTick(this.fire_pipelines_events())
      //   // } else {
      //   //   let unwatch_all_init = this.$watch('all_init', function (val) {
      //   //     if (val === true) {
      //   //       if (process.env.DEV) debug('watch all_init', val)
      //   //
      //   //       unwatch_all_init()
      //   //
      //   //       this.__init_charts()
      //   //       this.$nextTick(this.fire_pipelines_events())
      //   //     }
      //   //   }, { deep: true })// watcher
      //   // }
      //
      //   if (next) { next() }
      // }.bind(this)
      //
      // if (process.env.DEV) debug('__create', Object.getLength(this.$options.pipelines))
      //
      // if (Object.getLength(this.$options.pipelines) === 0) {
      //   this.create_pipelines(host, __init.pass(next))
      // } else if (next) {
      //   __init(next())
      // }
    },
    __mount: function (next) {
      this.__dashboard_module(this.id)

      if (next) { next() }
    },
    __clean_destroy: function (next) {
      this.$store.commit('dashboard_' + this.id + '/events/clean')
      // this.$store.commit('dashboard_' + this.id + '/tabular_sources/clear')
      // this.$store.commit('dashboard_' + this.id + '/stat_sources/clear')
      // if (this.$store.state.tabular_sources) this.$store.commit('tabular_sources/clear')
      // if (this.$store.state.stat_sources) this.$store.commit('stat_sources/clear')

      // this.$store.unregisterModule('dashboard_' + this.id)
      this.__dashboard_module(undefined, this.id)

      if (!this.$options.__events_watcher) { this.$options.__events_watcher() }

      Object.each(this.charts, function (chart, name) {
        this.set_chart_visibility(name, false)
      }.bind(this))

      // this.$eventbus.$off('highlightCallback')
      // this.$eventbus.$off('unhighlightCallback')

      // this.$eventbus.$off('charts', this.__process_dashboard_charts)
      this.$eventbus.$off('instances', this.__process_dashboard_instances)
      this.$eventbus.$off('paths', this.__process_dashboard_paths)
      this.$eventbus.$off('stat', this.__process_dashboard_data)
      this.$eventbus.$off('tabular', this.__process_dashboard_data)
      this.$eventbus.$off('data_range', this.__process_dashboard_data_range)

      this.stat_init = false
      this.tabular_init = false

      this.$options.charts_payloads = {}

      this.destroy_pipelines()

      Object.each(this.$options.unwatchers, function (unwatcher, name) {
        if (typeof unwatcher === 'function') { unwatcher() }
      })
      this.$options.unwatchers = {}

      this.$set(this, 'reactive_data', {})
      this.$set(this, 'available_charts', {})

      // this.id = undefined

      // this.$store.dispatch('stats/flush_all', {host: this.host})
      // this.$store.dispatch('stats_tabular/flush_all', {host: this.host})

      // this.$store.dispatch('stats/splice', {host: this.host, length: 300})
      // this.$store.dispatch('stats_tabular/splice', {host: this.host, length: 300})

      if (next) { next() }
    },
    /**
    * @end life cycle
    **/

    /**
    * @start - UI
    **/
    // update_daterangepicker: function(){
    //   if(!this.daterangepicker) this.daterangepicker = this.$options.daterangepicker
    //
    //   // Object.each(this.$options.daterangepicker, function(data, prop){
    //   //   this.$set(this.daterangepicker, prop, data)
    //   // }.bind(this))
    //
    //   Object.each(this.$options.daterangepicker.ranges, function(range, key){
    //     // range[1] = moment(new Date())
    //     // this.$set(this.daterangepicker.ranges[key], 1, moment(Date.now()))
    //     Array.each(range, function(start_or_end, index){
    //       if(typeof this.$options.daterangepicker.ranges[key][index] === 'function')
    //         this.$set(this.daterangepicker.ranges[key], index, this.$options.daterangepicker.ranges[key][index]())
    //
    //     }.bind(this))
    //     //////////////console.log('update_daterangepicker', this.daterangepicker.ranges[key])
    //   }.bind(this))
    //
    // },
    __set_chart_color: function (source) {
      this.$set(
        this.available_charts[source].chart,
        'options',
        Object.merge(
          this.available_charts[source].chart.options,
          this.$store.state['dashboard_' + this.id].theme[this.theme].dygraph
        )
      )
    },
    set_range: function (start, end) {
      // ////////console.log('set_range', start.utc().startOf('second').valueOf(), end.utc().startOf('second').valueOf())
      let range = [start.utc().startOf('second').valueOf(), end.utc().startOf('second').valueOf()]
      // let length = Math.trunc((end.utc().valueOf() - start.utc().valueOf()) / 1000)
      // this.$store.commit('app/range', range)
      this.$store.commit('dashboard_' + this.id + '/range', range)

      // let counter = 0
      // Object.each(this.available_charts, function(payload, name){
      //   let range = [start.utc().startOf('second').valueOf(), end.utc().startOf('second').valueOf()]
      //   let length = Math.trunc((end.utc().valueOf() - start.utc().valueOf()) / 1000)
      //   this.$store.commit('app/range', Array.clone(range))
      //   // if(Array.isArray(this.available_charts[name].stat)){
      //   //   Array.each(this.available_charts[name].stat, function(stat, index){
      //   //     this.available_charts[name].stat[index].range = Array.clone(range)//clone it, as each one may modify range
      //   //     this.available_charts[name].stat[index].length = length
      //   //
      //   //     let indexed_name = name +'_'+index
      //   //     this.remove_watcher(indexed_name)
      //   //   }.bind(this))
      //   // }
      //   // else{
      //   //   this.available_charts[name].stat.range = Array.clone(range)
      //   //   this.available_charts[name].stat.length = length
      //   //   this.remove_watcher(name)
      //   // }
      //
      //   // this.remove_chart(name, {unwatch: true})
      //
      //
      //   // // if(name.indexOf('networkInterface') === -1)
      //   // if(!payload.init || typeof payload.init !== 'function'){
      //   //   this.__get_stat_for_chart(this.available_charts[name])
      //   //   //////////////console.log('set_range __get_stat_for_chart', this.available_charts[name])
      //   // }
      //
      //   // if(counter === Object.getLength(this.available_charts) - 1)
      //   //   this.$nextTick(this.fire_pipelines_events())
      //
      //   counter++
      // }.bind(this))
    },
    set_chart_visibility: function (id, isVisible) {
      if (
        isVisible === false &&
        this.available_charts[id] &&
        (this.visibility[id] === undefined || this.visibility[id] === true)
      ) {
        this.$set(this.visibility, id, false)
        this.remove_chart(id)
        /// /////////console.log('set_chart_visibility REMOVE', id, isVisible, this.visibility[id])
        // this.$store.dispatch('stats/splice', this.available_charts[id].stat)
        // this.$store.dispatch('stats_tabular/splice', this.available_charts[id].stat)
      } else if (
        isVisible === true &&
        this.available_charts[id] &&
        (this.visibility[id] === undefined || this.visibility[id] === false)
      ) {
        /// /////console.log('set_chart_visibility ADD', id, isVisible, this.available_charts[id])
        this.$set(this.visibility, id, true)
        this.add_chart(this.available_charts[id], id)

        // this.$nextTick.pass(this.fire_pipelines_events())
      }
    },
    onResize (size, id) {
      debug('onResize', size, id)
      if (id) {
        if (size.height === 0) {
          debug('onResize set_chart_visibility false', id)
          this.set_chart_visibility(id, false)
        } else {
          this.set_chart_visibility(id, true)
        }
      }
      // {
      //   width: 20 // width of container (in px)
      //   height: 50 // height of container (in px)
      // }
    },
    showCollapsible (evt) {
      debug('showCollapsible', evt)
      let collapsible = /collapsible/
      let id
      Array.each(evt.path, function (node) {
        if (node.id && collapsible.test(node.id)) { id = node.id.replace('-collapsible', '') }
      })

      debug('showCollapsible id', id)
      if (id) { this.set_chart_visibility(id, true) }

      /// /////////console.log('showCollapsible', $(collapsible).attr('id'))
      // throw new Error('Replace $ with something not from jQuery')
      // this.$options.collapsibles[$(collapsible).attr('id')] = true
      // let id = $(collapsible).attr('id').replace('-collapsible', '')
      // this.set_chart_visibility(id, true)
    },
    hideCollapsible (evt) {
      debug('hideCollapsible', evt)
      let collapsible = /collapsible/
      let id
      Array.each(evt.path, function (node) {
        if (node.id && collapsible.test(node.id)) { id = node.id.replace('-collapsible', '') }
      })

      debug('hideCollapsible id', id)
      if (id) { this.set_chart_visibility(id, false) }

      /// /////////console.log('hideCollapsible', $(collapsible).attr('id'))

      // throw new Error('Replace $ with something not from jQuery')
      // this.$options.collapsibles[$(collapsible).attr('id')] = false
      // let id = $(collapsible).attr('id').replace('-collapsible', '')
      // this.set_chart_visibility(id, false)
    }

  },
  /**
  * @start - lifecycle
  **/
  beforeRouteUpdate: function (to, from, next) {
    if (process.env.DEV) debug('life cycle beforeRouteUpdate', to.params.host, from)
    //   // console.log('life cycle beforeRouteUpdate')
    //
    //   // react to route changes...
    //   // don't forget to call next()
    //   this.__clean_destroy(
    //     this.__clean_create.pass(
    //       this.__create.pass([
    //         // this.$route.params.host || this.$store.state.hosts.current,
    //         to.params.host,
    //         this.__mount.pass(next, this)
    //       ], this),
    //       this
    //     )
    //   )
    //
    next()
  },
  beforeCreate: function () {
    debug('life cycle beforeCreate')
  },
  created: function () {
    debug('life cycle created', this.id)

    this.$options.__events_watcher = this.$watch('events', debounce(function (newVal, old) {
    // this.$options.__events_watcher = this.$watch('events', function (newVal, old) {
      if (process.env.DEV) debug('events', newVal)

      let val = Array.clone(newVal)
      // if(val && val.length > 0 && val.length > old.length){
      // if(this.all_init === true && val && val.length > 0){
      if (val && val.length > 0) {
        // console.log('this.$watch events', val, Object.getLength(this.available_charts))

        Array.each(val, function (event, e_index) {
          if (event.id && this.available_charts[event.id]) {
            let { id } = event
            let { stat, pipeline } = this.available_charts[id]

            // event = this.__parse_event(event)

            if (!Array.isArray(stat.events)) { stat.events = [stat.events] }

            /// ///// console.log('this.$watch events chart', pipeline, stat)

            Array.each(stat.events, function (stat_data, s_index) {
              let p
              if (Array.isArray(pipeline)) {
                p = pipeline[s_index]
              } else {
                p = pipeline
              }

              // let __pipeline = this.__parse_pipeline_opts(p, stat_data)

              // if(id === 'colo.cpus_times.uptime')
              // console.log('PRE __parse_event', id, stat_data, event, s_index)

              let parsed_event = this.__parse_event(event, stat_data)

              // if(id === 'colo.cpus_times.uptime')
              // console.log('PRE __parse_event', id, stat_data,parsed_event)

              this.__set_pipeline_event({
                pipeline: p.name,
                event: parsed_event
              })
            }.bind(this))
          }

          if (e_index === val.length - 1) {
            // this.fire_pipelines_events()
            this.$store.commit('dashboard_' + this.id + '/events/remove', val)
          }
        }.bind(this))

        this.$nextTick(this.fire_pipelines_events())
        // this.fire_pipelines_events()

        // Array.each(val, function(event, e_index){
        //   this.$nextTick(this.$store.commit('dashboard_'+this.id+'/events/remove', val[e_index]))
        // }.bind(this))
      }
    // }, 50))
    }, 200))
    // })

    document.addEventListener('beforeunload', function () {
      this.__clean_destroy()
    }.bind(this))

    // if (process.env.DEV) debug('life cycle created', this.$route.params.host)

    // this.__clean_create(
    //   this.__create.pass([this.$route.params.host || this.$store.state.hosts.current], this)
    // )
    this.__clean_create(
      this.__create.pass([this.id], this)
    )
  },
  beforeMount: function () {
    debug('life cycle beforeMount', this.id)
  },
  mounted: function () {
    debug('life cycle mounted', this.id)
    this.__mount()
  },
  beforeUpdate: function () {
    debug('life cycle beforeUpdate', this.id)
  },
  updated: function () {
    debug('life cycle updated', this.id)
  },
  beforeDestroy: function () {
    debug('life cycle beforeDestroy', this.id)
    this.__clean_destroy()
  },
  destroyed: function () {
    debug('life cycle destroyed')
    this.$off()
  }
  // mounted: function () {
  //   if (process.env.DEV) { if (process.env.DEV) debug('mounted %s', this.id) }
  //   this.__dashboard_module(this.id)
  // },

}
</script>

<style>

.netdata-chart-alignment {
    margin-left: 55px;
}

.netdata-chart-row {
    width: 100%;
    text-align: center;
    display: flex;
    display: -webkit-flex;
    display: -moz-flex;
    align-items: flex-end;
    -moz-align-items: flex-end;
    -webkit-align-items: flex-end;
    justify-content: center;
    -moz--webkit-justify-content: center;
    -moz-justify-content: center;
    padding-top: 10px;
}

.netdata-container {
    display: inline-block;
    overflow: hidden;

    transform: translate3d(0,0,0);

    /* required for child elements to have absolute position */
    position: relative;

    /* width and height is given per chart with data-width and data-height */
}

.netdata-container-gauge {
    display: inline-block;
    overflow: hidden;

    transform: translate3d(0,0,0);

    /* required for child elements to have absolute position */
    position: relative;

    /* width and height is given per chart with data-width and data-height */
}

.netdata-container-gauge:after {
    padding-top: 60%;
    display: block;
    content: '';
}

.netdata-container-easypiechart {
    display: inline-block;
    overflow: hidden;

    transform: translate3d(0,0,0);

    /* required for child elements to have absolute position */
    position: relative;

    /* width and height is given per chart with data-width and data-height */
}

.netdata-container-easypiechart:after {
    padding-top: 100%;
    display: block;
    content: '';
}

.netdata-aspect {
    position: relative;
    width: 100%;
    padding: 0px;
    margin: 0px;
}

.netdata-container-with-legend {
    display: inline-block;
    overflow: hidden;

    transform: translate3d(0,0,0);

    /* fix minimum scrollbar issue in firefox */
    min-height: 99px;

    /* required for child elements to have absolute position */
    position: relative;

    /* width and height is given per chart with data-width and data-height */
}

.netdata-legend-resize-handler {
    display: block;
    position: absolute;
    bottom: 0px;
    right: 0px;
    height: 15px;
    width: 20px;
    background-color: #272b30;
    font-size: 15px;
    vertical-align: middle;
    line-height: 15px;
    cursor: ns-resize;
    color: #373b40;
    text-align: center;
    overflow: hidden;
    z-index: 20;
    padding: 0px;
    margin: 0px;
}

.netdata-legend-toolbox {
    display: block;
    position: absolute;
    bottom: 0px;
    right: 30px;
    height: 15px;
    width: 110px;
    background-color: #272b30;
    font-size: 12px;
    vertical-align: middle;
    line-height: 15px;
    color: #373b40;
    text-align: center;
    overflow: hidden;
    z-index: 20;
    padding: 0px;
    margin: 0px;

    /* prevent text selection after double click */
    -webkit-user-select: none; /* webkit (safari, chrome) browsers */
    -moz-user-select: none; /* mozilla browsers */
    -khtml-user-select: none; /* webkit (konqueror) browsers */
    -ms-user-select: none; /* IE10+ */
}

.netdata-legend-toolbox-button {
    display: inline-block;
    position: relative;
    height: 15px;
    width: 18px;
    background-color: #272b30;
    font-size: 12px;
    vertical-align: middle;
    line-height: 15px;
    color: #474b50;
    text-align: center;
    overflow: hidden;
    z-index: 21;
    padding: 0px;
    margin: 0px;
    cursor: pointer;

    /* prevent text selection after double click */
    -webkit-user-select: none; /* webkit (safari, chrome) browsers */
    -moz-user-select: none; /* mozilla browsers */
    -khtml-user-select: none; /* webkit (konqueror) browsers */
    -ms-user-select: none; /* IE10+ */
}

.netdata-message {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: left;
    vertical-align: top;
    font-weight: bold;
    font-size: x-small;
    overflow: hidden;
    background: inherit;
    z-index: 0;
}

.netdata-message.hidden {
    display: none;
}

.netdata-message.icon {
    color: #2f3338;
    text-align: center;
    vertical-align: middle;
}

.netdata-chart-legend {
    position: absolute; /* within .netdata-container */
    top: 0;
    right: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 14px;
    display: block;
    width: 140px; /* --legend-width */
    height: calc(100% - 15px); /* 10px for the resize handler and 5px for the top margin */
    font-size: 11px;/* colo: 10 -> 11 */
    margin-top: 5px;
    text-align: left;
    /* width and height is calculated (depends on the appearance of the legend) */
}

.netdata-legend-title-date {
    font-size: 10px;
    font-weight: normal;
    margin-top: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.netdata-legend-title-time {
    font-size: 11px;
    font-weight: bold;
    margin-top: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.netdata-legend-title-units {
    position: absolute;
    right: 10px;
    float: right;
    font-size: 11px;
    vertical-align: top;
    font-weight: normal;
    margin-top: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.netdata-legend-series {
    position: absolute;
    width: 140px; /* legend-width */
    height: calc(100% - 50px);
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 14.5px; /* line spacing at the legend */
    display: block;
    font-size: 10px;
    margin-top: 0px;
}

.netdata-legend-name-table-line {
    display: inline-block;
    width: 13px;
    height: 4px;
    border-width: 0px;
    border-bottom-width: 2px;
    border-bottom-style: solid;
    border-bottom-color: #272b30;
}

.netdata-legend-name-table-area {
    display: inline-block;
    width: 13px;
    height: 5px;
    border-width: 1px;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: inherit;
}

.netdata-legend-name-table-stacked {
    display: inline-block;
    width: 13px;
    height: 5px;
    border-width: 1px;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: inherit;
}

.netdata-legend-name-tr {
}

.netdata-legend-name-td {
}

.netdata-legend-name {
    text-align: left;
    font-size: 11px; /* legend: dimension name size */
    font-weight: bold;
    vertical-align: bottom;
    margin-top: 0px;
    z-index: 9;
    padding: 0px;
    width: 80px !important;
    max-width: 80px !important;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: inline-block;
    cursor: pointer;
    -webkit-print-color-adjust: exact;
}

.netdata-legend-value {
    /*margin-left: 14px;*/
    position: absolute;
    right: 10px;
    float: right;
    text-align: right;
    font-size: 11px; /* legend: dimension value size */
    font-weight: bold;
    vertical-align: bottom;
    background-color: #272b30;
    margin-top: 0px;
    z-index: 10;
    padding: 0px;
    padding-left: 15px;
    cursor: pointer;
    /* -webkit-font-smoothing: none; */
}

.netdata-legend-name.not-selected {
    font-weight: normal;
    opacity: 0.3;
}

.netdata-chart {
    position: absolute; /* within .netdata-container */
    top: 0; /* within .netdata-container */
    left: 0; /* within .netdata-container */
    display: inline-block;
    overflow: hidden;
    width: 100%;
    height: 100%;
    z-index: 5;

    /* width and height is calculated (depends on the appearance of the legend) */
}

.netdata-chart-with-legend-right {
    position: absolute; /* within .netdata-container */
    top: 0; /* within .netdata-container */
    left: 0; /* within .netdata-container */
    display: block;
    overflow: hidden;
    margin-right: 140px; /* --legend-width */
    width: calc(100% - 140px); /* --legend-width */
    height: 100%;
    z-index: 5;
    flex-grow: 1;

    /* width and height is calculated (depends on the appearance of the legend) */
}

.netdata-peity-chart {

}

.netdata-sparkline-chart {

}

.netdata-morris-chart {

}

.netdata-google-chart {

}

/* fix for sparkline tooltip under bootstrap */
.jqstooltip {
    width: auto !important;
    height: auto !important;
}

.easyPieChart {
    position: relative;
    text-align: center;
}

.easyPieChart canvas {
    position: absolute;
    top: 0;
    left: 0;
}

.easyPieChartLabel {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 100%;
    text-align: center;
    color: #BBB;
    font-weight: normal;
    text-shadow: #272b30 0px 0px 1px;
    /* -webkit-font-smoothing: none; */
}

.easyPieChartTitle {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 64%;
    margin-left: 18% !important;
    text-align: center;
    color: #676b70;
    font-weight: bold;
}

.easyPieChartUnits {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 60%;
    margin-left: 20% !important;
    text-align: center;
    color: #676b70;
    font-weight: normal;
}

.gaugeChart {
    position: relative;
    text-align: center;
}

.gaugeChart canvas {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 0;
}

.gaugeChartLabel {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 100%;
    text-align: center;
    color: #BBB;
    font-weight: bold;
    z-index: 1;
    text-shadow: #272b30 0px 0px 1px;
    /* text-shadow: #CCC 1px 1px 0px, #CCC -1px -1px 0px, #CCC 1px -1px 0px, #CCC -1px 1px 0px; */
    /* -webkit-text-stroke: 1px #777; */
    /* -webkit-font-smoothing: none; */
}

.gaugeChartTitle {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 100%;
    text-align: center;
    color: #676b70;
    font-weight: bold;
}

.gaugeChartUnits {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    bottom: 0;
    width: 100%;
    text-align: left;
    margin-left: 5%;
    color: #676b70;
    font-weight: normal;
}

.gaugeChartMin {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    bottom: 8%;
    width: 92%;
    margin-left: 8%;
    text-align: left;
    color: #676b70;
    font-weight: normal;
}

.gaugeChartMax {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    bottom: 8%;
    width: 95%;
    margin-right: 5%;
    text-align: right;
    color: #676b70;
    font-weight: normal;
}

.popover-title {
    font-weight: bold;
    font-size: 12px;
}

.popover-content {
    font-size: 11px;
}
</style>
