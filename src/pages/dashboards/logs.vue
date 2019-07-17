<template>
  <q-page class="bg-secondary">

    <dashboard-menu>
      <dashboard-menu-tabs :tabs="menuTabs">
        <template v-slot:panel="{ tab }">
          <!-- <span v-if="tab.name === 'charts'">charts</span> -->
          <component v-bind:is="'dashboard-menu-tabs-panel-'+tab.name" :options="panels[tab.name]">

            <!-- <template v-if="tab.name === 'charts'" v-slot:menu="{ option, row }">
            </template> -->

            <template v-if="tab.name === 'settings'" v-slot:performance="{ option, setting }">
              <!-- {{option}} -->
              <!-- v-for="(data, prop) in option" :key="setting+'.'+prop"  -->
              <component
                v-bind:is="'dashboard-menu-tabs-panel-'+tab.name+'-performance-'+setting"
                v-bind="option"
                @input="handleInput"
                >
              </component>

            </template>

          </component>
        </template>
      </dashboard-menu-tabs>
    </dashboard-menu>

    <q-card class="bg-secondary" :dark="$store.state.app.theme.current === 'slate'" :class="($store.state.app.theme.current === 'slate') ? 'text-white' : 'text-black'">

      <q-card-section>
        <div class="text-h6">Logs</div>
        <div class="text-subtitle2">Count: 8k</div>
        <!-- <q-rating size="24px" v-model="stars" :max="5" /> -->
      </q-card-section>
    </q-card>
    <!-- <div class="row items-center justify-center" :dark="$store.state.app.theme.current === 'slate'">
      <template v-for="log in $store.state['logs'].all">
      <div
      :key="log"
      :class="(!$route.params.log) ? 'col-6' : 'col-12'"
      v-if="!$route.params.log || log === $route.params.log"
      :dark="$store.state.app.theme.current === 'slate'"
      >

        <q-expansion-item
          :icon="( !$route.params.log ) ? 'add_circle_outline' : 'remove_circle_outline'"
          :to="( !$route.params.log ) ? { name: 'log', params: { log: log } } : { name: 'logs' }"
          :id="log+'-collapsible'"
          :key="log+'-collapsible'"
          :label="log"
          :name="log"
          default-opened
          :header-inset-level="0"
          :content-inset-level="0"
          style="width: 100%"
          :dark="$store.state.app.theme.current === 'slate'"
          :header-class="($store.state.app.theme.current === 'slate') ? 'text-white' : 'text-black'"
        >
        <div class="row justify-center">

          <template v-for="(chart, name) in logs_charts[log]">
            <div :key="log+'-'+name" class="column">
            <div class="col text-grey q-pa-md text-center">
              <div class="text-caption">{{chart.label || chart.name}}</div>
              <component
                :key="log+'-'+name+'component'"
                :is="chart.tabular === false ? 'chart' : 'chart-tabular'"
                dashboard="logs"
                :wrapper="chart.wrapper"
                :ref="log+'-'+name"
                :id="log+'-'+name"
                :EventBus="$eventbus"
                :chart="chart.chart"
                :stat="{
                  range: chart.stat.range,
                  length: chart.stat.length,
                  merged: chart.stat.merged,
                  data: chart.stat.data
                }"
              >

              </component>

            </div>
            </div>
        </template>
        </div>
        </q-expansion-item>

      </div>
      </template>
    </div> -->

    <!-- https://stackoverflow.com/questions/40404787/best-practice-for-reacting-to-params-changes-with-vue-router -->
    <transition name="view" mode="out-in" appear>
      <router-view :key="$route.params.log"/>
    </transition>

  </q-page>
</template>

<script>

import * as Debug from 'debug'

const debug = Debug('mngr-ui:pages:dashboard:logs')
// const debug_internals = Debug('mngr-ui:pages:dashboard:logs:Internals')
// const debug_events = Debug('mngr-ui:pages:dashboard:logs:Events')

// import dashboardMixinDygraph from '@mixins/dashboard.dygraph'
import dashboardDygraphMixin from '@mixins/dashboard.dygraph'

import dashboardMenuTabsPanelCharts from '@components/dashboard/menu.tabs.panel.charts.vue'
import dashboardMenuTabsPanelSettings from '@components/dashboard/menu.tabs.panel.settings.vue'

import dashboardMenuTabsPanelSettingsPerformanceGraph from '@components/dashboard/settings/performance.graph.vue'
import dashboardMenuTabsPanelSettingsPerformanceDygraph from '@components/dashboard/settings/performance.dygraph.vue'

import Pipeline from 'js-pipeline'
import LogsPipeline from '@libs/pipelines/logs'
import logsStoreModule from 'src/store/logs'

import LogPipeline from '@libs/pipelines/logs.log'

import pie_chart from 'mngr-ui-admin-charts/defaults/vueEasyPieChart'

export default {
  name: 'dashboard-logs',

  mixins: [dashboardDygraphMixin],

  components: {
    dashboardMenuTabsPanelCharts,
    dashboardMenuTabsPanelSettings,
    dashboardMenuTabsPanelSettingsPerformanceGraph,
    dashboardMenuTabsPanelSettingsPerformanceDygraph
  },

  /**
  * @start - from pages/dashboard/log.vue
  **/
  // tabular_sources: undefined,
  // stat_sources: undefined,
  // stat_whitelist: /^[a-zA-Z0-9_.]+$/,
  stat_whitelist: /freemem|totalmem|cpus/,
  tabular_whitelist: /os_cpus_percentage|os_loadavg|os_uptime/,
  // tabular_whitelist: /^[a-zA-Z0-9_.]+$/,
  /**
  * @end - from pages/dashboard/log.vue
  **/

  data () {
    return {
      logs_charts: {},
      id: 'logs',
      menuTabs: [
        { name: 'charts', label: 'Charts', active: true },
        { name: 'settings', label: 'Settings' }
      ],
      panels: {
        'charts': {
          menu: {
            logs: {
              label: 'Logs',
              icon: 'desktop_windows',
              route: {},
              menu: {
                // colo: {
                //   label: 'colo', icon: 'desktop_windows', route: { name: 'log', params: { log: 'colo' } }
                // }
              }
            }
          }
        },
        'settings': {
          performance: {
            'graph': { always_update: false },
            'dygraph': { smoothness: false }
          }
        }

      }
    }
  },
  watch: {
    'panels.settings.performance.dygraph.smoothness': function (newValue) {
      Array.each(this.$children, function (child) { // q-page content
        debug('panels.settings.performance.dygraph.smoothness page', child)
        Array.each(child.$children, function (content_child) { // q-drawer || child dashboard(s)
          debug('panels.settings.performance.dygraph.smoothness content', content_child)
          if (content_child.dygraph_smoothness !== undefined && content_child.id) {
            this.$store.commit('dashboard_' + content_child.id + '/options_dygraph_smoothness', newValue)
          }
        }.bind(this))
      }.bind(this))

      debug('panels.settings.performance.dygraph.smoothness', newValue)
      this.$store.commit('dashboard_' + this.id + '/options_dygraph_smoothness', newValue)
    },
    'panels.settings.performance.graph.always_update': function (newValue) {
      Array.each(this.$children, function (child) { // q-page content
        debug('panels.settings.performance.graph.always_update page', child)
        Array.each(child.$children, function (content_child) { // q-drawer || child dashboard(s)
          debug('panels.settings.performance.graph.always_update content', content_child)
          if (content_child.graph_always_update !== undefined && content_child.id) {
            this.$store.commit('dashboard_' + content_child.id + '/options', { graph: { always_update: newValue } })
          }
        }.bind(this))
      }.bind(this))

      debug('panels.settings.performance.graph.always_update content', { graph: { always_update: newValue } })
      this.$store.commit('dashboard_' + this.id + '/options', { graph: { always_update: newValue } })
    }
  },
  created: function () {
    debug('created')
    this.id = this.id
    this.$eventbus.$on('log_menu', this.handleMenu.bind(this))
  },
  mounted: function () {
    debug('mounted')

    this.$set(this.panels.settings.performance.graph, 'always_update', this.graph_always_update)
    this.$set(this.panels.settings.performance.dygraph, 'smoothness', this.dygraph_smoothness)
    this.__logs_module()
  },
  beforeUpdate: function () {
    debug('beforeUpdate')
    if (!this.$route.params.log) { this.panels.charts.menu.log = undefined }
  },
  beforeDestroy: function () {
    debug('life cycle beforeDestroy', this.id)
    this.$eventbus.$off('logs')
    this.$eventbus.$off('logs.log')
    this.$eventbus.$off('log_menu')
  },
  methods: {

    __logs_module: function () {
      debug('__logs_module')

      if (!this.$store.state['logs']) { this.$store.registerModule('logs', logsStoreModule) }
    },
    handleInput: function (payload) {
      this.$set(this.panels, 'settings', Object.merge(this.panels.settings, payload))
      debug('handleInput', payload)
    },
    handleMenu: function (payload) {
      this.$set(this.panels, 'charts', { menu: Object.merge(this.panels.charts.menu, payload) })
      debug('handleMenu', this.panels.charts.menu)
    },
    /**
    * @start pipelines
    **/
    create_pipelines: function (logs, next) {
      debug('create_pipelines', logs)

      if (logs && Array.isArray(logs)) {
        Array.each(logs, function (log) {
          if (log) {
            let template = Object.clone(LogPipeline)

            template.input[0].poll.conn[0].stat_log = log

            template.input[0].poll.id += '-' + log
            template.input[0].poll.conn[0].id = template.input[0].poll.id
            let pipeline_id = template.input[0].poll.id

            // template.input[0].poll.conn[0].id = template.input[0].poll.suspended = true

            if (!this.$options.pipelines[pipeline_id]) {
              let pipe = new Pipeline(template)

              this.$options.pipelines[pipeline_id] = pipe
            }
          }
        }.bind(this))
      }

      let template = Object.clone(LogsPipeline)

      let pipeline_id = template.input[0].poll.id

      if (!this.$options.pipelines[pipeline_id]) {
        let pipe = new Pipeline(template)

        this.$options.pipelines[pipeline_id] = pipe
      } else if (this.$options.pipelines[pipeline_id].inputs[0].options.suspended !== false) {
        debug('LogsPipeline suspended', this.$options.pipelines[pipeline_id].inputs[0].options.suspended)
        this.$options.pipelines[pipeline_id].fireEvent('onResume')
      }

      if (next) { next() }
    },
    destroy_pipelines: function () {
      debug('destroy_pipelines')

      Object.each(this.$options.pipelines, function (pipe, id) { // destroy old ones
        pipe.fireEvent('onSuspend')
        pipe.fireEvent('onExit')
        pipe.removeEvents()

        delete this.$options.pipelines[id]
      }.bind(this))

      debug('destroy_pipelines', this.$options.pipelines)
    },
    /**
    * @end pipelines
    **/
    /**
    * @overrides: mixins/dashboard
    **/
    __create: function (id, next) { // process one event only ('log')
      this.$eventbus.$on('logs', this.__process_dashboard_logs.bind(this))
      // this.$eventbus.$on('logs.log', this.__process_dashboard_log.bind(this))

      this.__logs_module()// why __hosts_module isn't here on hosts.vue??

      let __init = function (next) {
        this.__init_charts()
        this.$nextTick(this.fire_pipelines_events())

        if (next) { next() }
      }.bind(this)

      if (process.env.DEV) debug('__create', Object.getLength(this.$options.pipelines))

      if (Object.getLength(this.$options.pipelines) === 0) {
        this.create_pipelines(this.$store.state['logs'].all, __init.pass(next))
      } else if (next) {
        __init(next())
      }
    },
    /**
    * @start single log (from pages/dashboard/log.vue)
    **/
    __init_charts: function (next) {
      // this.$options.charts_payloads = log_charts_payloads({
      //   log: this.log,
      //   // seconds: this.seconds,
      //   // seconds: 300,
      //   range: this.range
      // })

      // let __create_from_tabular_sources = function (tabular_sources) {
      //   debug('__init_charts $store.state.tabular_sources', tabular_sources)
      //   let whitelist = this.$options.charts_tabular_whitelist
      //   let blacklist = this.$options.charts_tabular_blacklist
      //
      //   Object.each(tabular_sources, function (tab, source) {
      //     // debug('__init_charts $store.state.tabular_sources', source)
      //
      //     if (
      //       !this.available_charts[source] &&
      //       this.dashboard_instances[source] &&
      //       this.$store.state['dashboard_' + this.log].paths.length > 0 &&
      //       this.__white_black_lists_filter(whitelist, blacklist, source)
      //     ) {
      //       debug('__init_charts $store.state.tabular_sources creating', source, this.__match_source_paths(source.replace(this.log + '_', ''), this.$store.state['dashboard_' + this.log].paths, false))
      //
      //       this.$set(this.available_charts, source, Object.merge(
      //         Object.clone({
      //           name: source,
      //           chart: undefined,
      //           init: undefined,
      //           stop: undefined,
      //           wrapper: {
      //             type: 'dygraph'
      //             // props: {}
      //           },
      //           stat: {
      //             merged: false,
      //             // sources: [{type: 'tabular', path: source}],
      //             data: [this.$options['tabular_sources'][source].data],
      //             events: [{
      //               log: this.log,
      //               path: this.__match_source_paths(source.replace(this.log + '_', ''), this.$store.state['dashboard_' + this.log].paths, false),
      //               // key: 'cpus',
      //               // length: this.seconds,
      //               tabular: true
      //               // range: this.range
      //             }],
      //             length: this.$options.MAX_DATA_POINTS,
      //             range: this.range
      //           },
      //           /**
      //           * for __get_stat_for_chart
      //           **/
      //           pipeline: {
      //             name: 'input.os'
      //             // // path: 'os',
      //             // range: true
      //           }
      //         })
      //
      //       )
      //       )
      //
      //       this.$set(this.available_charts[source], 'chart', Object.merge(
      //         Object.clone(dygraph_line_chart),
      //         this.dashboard_instances[source],
      //         {
      //           skip: (this.dashboard_instances[source].skip > this.$options['tabular_sources'][source].step) ? this.dashboard_instances[source].skip : this.$options['tabular_sources'][source].step - 1,
      //           interval: (this.dashboard_instances[source].interval > this.$options['tabular_sources'][source].step) ? this.dashboard_instances[source].interval : this.$options['tabular_sources'][source].step - 1
      //         }
      //       ))
      //
      //       /**
      //       * set color based on current theme
      //       **/
      //       this.__set_chart_color(source)
      //       this.$set(this.available_charts[source].wrapper, 'props', {})
      //       this.$set(this.available_charts[source].wrapper.props, 'smoothness', this.dygraph_smoothness)
      //
      //       debug(source + ' skip', this.available_charts[source].chart)
      //
      //       // this.set_chart_visibility(source, true)
      //
      //       this.$on('tabular_sources', function () {
      //         debug('on tabular_sources', source, this.$options['tabular_sources'][source])
      //         this.$set(this.available_charts[source].stat, 'data', [this.$options['tabular_sources'][source].data])
      //
      //         debug('log tabular_sources skip', this.$options['tabular_sources'][source].step)
      //         // console.log('log tabular_sources skip', this.$options['tabular_sources'][source].step)
      //
      //         this.$set(
      //           this.available_charts[source].chart,
      //           'skip',
      //           (this.available_charts[source].chart.skip > this.$options['tabular_sources'][source].step) ? this.available_charts[source].chart.skip : this.$options['tabular_sources'][source].step - 1
      //         )
      //
      //         this.$set(
      //           this.available_charts[source].chart,
      //           'interval',
      //           (this.available_charts[source].chart.interval > this.$options['tabular_sources'][source].step) ? this.available_charts[source].chart.interval : this.$options['tabular_sources'][source].step - 1
      //         )
      //       })
      //     }
      //   }.bind(this))
      // }.bind(this)
      //
      // let __create_from_stat_sources = function (stat_sources) {
      //   // debug('__init_charts $store.state.stat_sources', stat_sources)
      //   let whitelist = this.$options.charts_stat_whitelist
      //   let blacklist = this.$options.charts_stat_blacklist
      //
      //   Object.each(stat_sources, function (stat, source) {
      //     // debug('__init_charts $store.state.stat_sources', source)
      //
      //     if (
      //       !this.available_charts[source] &&
      //       // && this.dashboard_instances[source]
      //       this.$store.state['dashboard_' + this.log].paths.length > 0 &&
      //       this.__white_black_lists_filter(whitelist, blacklist, source)
      //     ) {
      //       debug('__init_charts $store.state.stat_sources creating', source, this.__match_source_paths(source.replace(this.log + '_', ''), this.$store.state['dashboard_' + this.log].paths, false))
      //
      //       let chart_payload = this.$options.charts_payloads[source.replace(this.log + '_', '')]
      //
      //       this.$set(this.available_charts, source, Object.merge(
      //         Object.clone({
      //           name: source,
      //           chart: undefined,
      //           init: undefined,
      //           stop: undefined,
      //           tabular: false, // this is for component, if not set, it's "chart-tabular"
      //           wrapper: {
      //             type: 'dygraph'
      //             // props: {}
      //           },
      //           stat: {
      //             merged: false,
      //             // sources: [{type: 'stat', path: source}],
      //             data: [this.$options['stat_sources'][source].data],
      //             events: [{
      //               log: this.log,
      //               path: this.__match_source_paths(source.replace(this.log + '_', ''), this.$store.state['dashboard_' + this.log].paths, false),
      //               // key: 'cpus',
      //               // length: this.seconds,
      //               tabular: false
      //               // range: this.range
      //             }],
      //             length: this.$options.MAX_DATA_POINTS,
      //             range: this.range
      //           },
      //           /**
      //           * for __get_stat_for_chart
      //           **/
      //           pipeline: {
      //             name: 'input.os'
      //             // // path: 'os',
      //             // range: true
      //           }
      //         }),
      //         {
      //           // chart: Object.merge(Object.clone(dygraph_line_chart), this.dashboard_instances[source]),
      //           // chart: Object.clone(dygraph_line_chart),
      //
      //         },
      //         chart_payload
      //       )
      //       )
      //
      //       this.$set(this.available_charts[source], 'chart', Object.merge(
      //         Object.clone(dygraph_line_chart),
      //         {
      //           skip: this.$options['stat_sources'][source].step - 1,
      //           interval: this.$options['stat_sources'][source].step - 1
      //         }
      //       ))
      //
      //       /**
      //       * set color based on current theme
      //       **/
      //       this.__set_chart_color(source)
      //       this.$set(this.available_charts[source].wrapper, 'props', {})
      //       this.$set(this.available_charts[source].wrapper.props, 'smoothness', this.dygraph_smoothness)
      //
      //       // this.set_chart_visibility(source, true)
      //
      //       this.$on('stat_sources', function () {
      //         debug('on stat_sources', source, this.$options['stat_sources'][source])
      //         this.$set(this.available_charts[source].stat, 'data', [this.$options['stat_sources'][source].data])
      //
      //         this.$set(
      //           this.available_charts[source].chart,
      //           'skip',
      //           (this.available_charts[source].chart.skip > this.$options['stat_sources'][source].step) ? this.available_charts[source].chart.skip : this.$options['stat_sources'][source].step - 1
      //         )
      //
      //         this.$set(
      //           this.available_charts[source].chart,
      //           'interval',
      //           (this.available_charts[source].chart.interval > this.$options['stat_sources'][source].step) ? this.available_charts[source].chart.interval : this.$options['stat_sources'][source].step - 1
      //         )
      //       })
      //     }
      //   }.bind(this))
      // }.bind(this)
      //
      let __create_cpus_percentage = function (tabular_sources) {
        let re = /_os_cpus_percentage$/

        Object.each(tabular_sources, function (data, source) {
          if (re.test(source)) {
            debug('PRE __create_cpus_percentage', source, this.$options['dashboard_' + this.id]['tabular_sources'][source])

            let log = source.substring(0, source.indexOf('_'))
            let name = source + '_pie'
            if (
              (!this.available_charts[name] || !this.logs_charts[log] || !this.logs_charts[log][name]) &&
              this.$options['dashboard_' + this.id]['stat_sources'] && this.$options['dashboard_' + this.id]['stat_sources'][log + '_os_cpus']
            ) {
              debug('__create_cpus_percentage', name, this.$options['dashboard_' + this.id]['tabular_sources'][source])

              let cpus = this.$options['dashboard_' + this.id]['stat_sources'][log + '_os_cpus'].data[0].value.length
              this.$set(this.available_charts, name, Object.merge(
                Object.clone({
                  name: name,
                  label: 'CPUs [' + cpus + '] usage',
                  chart: undefined,
                  init: undefined,
                  stop: undefined,
                  tabular: true, // this is for component, if not set, it's "chart-tabular"
                  wrapper: {
                    type: 'vue-easy-pie-chart',
                    props: {
                      decimals: 2,
                      options: {
                        // 'track-color': true,
                        size: 90,
                        // animated: false,
                        'font-size': '14px',
                        'bar-color': function (percentage) {
                          if (percentage > 0 && percentage < 20) {
                            return '#86b300'
                          } else if (percentage > 20 && percentage < 40) {
                            return '#eef65a'
                          } else if (percentage > 40 && percentage < 60) {
                            return '#f6d95b'
                          } else if (percentage > 60 && percentage < 80) {
                            return '#f6a05a'
                          } else {
                            return '#ff704d'
                          }
                        }
                      }
                    }
                  },
                  stat: {
                    merged: false,
                    // sources: [{type: 'stat', path: source}],
                    data: [this.$options['dashboard_' + this.id]['tabular_sources'][source].data],
                    // events: [{
                    //   log: this.log,
                    //   path: this.__match_source_paths(source.replace(this.log + '_', ''), this.$store.state['dashboard_' + this.log].paths, false),
                    //   // key: 'cpus',
                    //   // length: this.seconds,
                    //   tabular: false
                    //   // range: this.range
                    // }],
                    length: 2,
                    range: 2
                  }
                  /**
                    * for __get_stat_for_chart
                    **/
                  // pipeline: {
                  //   name: 'input.os'
                  //   // // path: 'os',
                  //   // range: true
                  // }
                })
                // chart_payload,
                // {
                //   // chart: {totalmem: stat_sources[this.log+'_os_totalmem'][0].data}
                //   chart: {totalmem: this.$options.stat_sources[this.log+'_os_totalmem'].data[0].value}
                // }
              ))

              this.$set(this.available_charts[name], 'chart', Object.clone(pie_chart))

              if (!this.logs_charts[log]) { this.$set(this.logs_charts, log, {}) }

              this.$set(this.logs_charts[log], name, this.available_charts[name])

              /**
              * set color based on current theme
              **/
              // this.__set_chart_color(source)
              // this.$set(this.available_charts[source].wrapper, 'props', {})
              // this.$set(this.available_charts[source].wrapper.props, 'smoothness', this.dygraph_smoothness)

              // this.set_chart_visibility(name, true)

              this.$on('tabular_sources', function () {
                let re = /_os_cpus_percentage$/
                Object.each(this.$options['dashboard_' + this.id]['tabular_sources'], function (data, source) {
                  if (re.test(source)) {
                    let log = source.substring(0, source.indexOf('_'))
                    let name = source + '_pie'
                    debug('on tabular_sources', name, this.$options['dashboard_' + this.id]['tabular_sources'][source])

                    // if(this.$options['dashboard_' + this.id]['stat_sources'][source] !== undefined){
                    this.$set(this.available_charts[name].stat, 'data', [this.$options['dashboard_' + this.id]['tabular_sources'][source].data])

                    this.$set(
                      this.available_charts[name].chart,
                      'skip',
                      (this.available_charts[name].chart.skip > this.$options['dashboard_' + this.id]['tabular_sources'][source].step) ? this.available_charts[name].chart.skip : this.$options['dashboard_' + this.id]['tabular_sources'][source].step - 1
                    )

                    this.$set(
                      this.available_charts[name].chart,
                      'interval',
                      (this.available_charts[name].chart.interval > this.$options['dashboard_' + this.id]['tabular_sources'][source].step) ? this.available_charts[name].chart.interval : this.$options['dashboard_' + this.id]['tabular_sources'][source].step - 1
                    )
                  }
                }.bind(this))

                // }
              }.bind(this))
            }
            debug('cpus_percentage pie', this.logs_charts[log])
          }
        }.bind(this))

        // let source = this.log + '_os_freemem'
        // let chart_payload = this.$options.charts_payloads['os_freemem']
      }.bind(this)

      let __create_os_loadavg = function (tabular_sources) {
        let re = /_os_loadavg$/

        Object.each(tabular_sources, function (data, source) {
          if (re.test(source)) {
            debug('PRE __create_os_loadavg', source, this.$options['dashboard_' + this.id]['tabular_sources'][source])

            let log = source.substring(0, source.indexOf('_'))
            let name = source + '_odometer'
            if (
              !this.available_charts[name] || !this.logs_charts[log] || !this.logs_charts[log][name]
            ) {
              debug('__create_os_loadavg', name, this.$options['dashboard_' + this.id]['tabular_sources'][source])

              this.$set(this.available_charts, name, Object.merge(
                Object.clone({
                  name: name,
                  label: 'Load AVG',
                  chart: undefined,
                  init: undefined,
                  stop: undefined,
                  tabular: true, // this is for component, if not set, it's "chart-tabular"
                  wrapper: {
                    type: 'vue-odometer',
                    props: {
                      // decimals: 2,
                      options: {
                        // theme: 'car'
                        duration: 200
                      }
                    }
                  },
                  stat: {
                    merged: false,
                    // sources: [{type: 'stat', path: source}],
                    data: [this.$options['dashboard_' + this.id]['tabular_sources'][source].data],
                    // events: [{
                    //   log: this.log,
                    //   path: this.__match_source_paths(source.replace(this.log + '_', ''), this.$store.state['dashboard_' + this.log].paths, false),
                    //   // key: 'cpus',
                    //   // length: this.seconds,
                    //   tabular: false
                    //   // range: this.range
                    // }],
                    length: 2,
                    range: 2
                  }
                  /**
                    * for __get_stat_for_chart
                    **/
                  // pipeline: {
                  //   name: 'input.os'
                  //   // // path: 'os',
                  //   // range: true
                  // }
                })
                // chart_payload,
                // {
                //   // chart: {totalmem: stat_sources[this.log+'_os_totalmem'][0].data}
                //   chart: {totalmem: this.$options.stat_sources[this.log+'_os_totalmem'].data[0].value}
                // }
              ))

              // this.$set(this.available_charts[name], 'chart', Object.clone(pie_chart))
              this.$set(this.available_charts[name], 'chart', {})

              if (!this.logs_charts[log]) { this.$set(this.logs_charts, log, {}) }

              this.$set(this.logs_charts[log], name, this.available_charts[name])

              /**
              * set color based on current theme
              **/
              // this.__set_chart_color(source)
              // this.$set(this.available_charts[source].wrapper, 'props', {})
              // this.$set(this.available_charts[source].wrapper.props, 'smoothness', this.dygraph_smoothness)

              // this.set_chart_visibility(name, true)

              this.$on('tabular_sources', function () {
                let re = /_os_loadavg$/
                Object.each(this.$options['dashboard_' + this.id]['tabular_sources'], function (data, source) {
                  if (re.test(source)) {
                    let log = source.substring(0, source.indexOf('_'))
                    let name = source + '_odometer'
                    debug('on tabular_sources', name, this.$options['dashboard_' + this.id]['tabular_sources'][source])

                    // if(this.$options['dashboard_' + this.id]['stat_sources'][source] !== undefined){
                    this.$set(this.available_charts[name].stat, 'data', [this.$options['dashboard_' + this.id]['tabular_sources'][source].data])

                    this.$set(
                      this.available_charts[name].chart,
                      'skip',
                      (this.available_charts[name].chart.skip > this.$options['dashboard_' + this.id]['tabular_sources'][source].step) ? this.available_charts[name].chart.skip : this.$options['dashboard_' + this.id]['tabular_sources'][source].step - 1
                    )

                    this.$set(
                      this.available_charts[name].chart,
                      'interval',
                      (this.available_charts[name].chart.interval > this.$options['dashboard_' + this.id]['tabular_sources'][source].step) ? this.available_charts[name].chart.interval : this.$options['dashboard_' + this.id]['tabular_sources'][source].step - 1
                    )
                  }
                }.bind(this))

                // }
              }.bind(this))
            }
            debug('os_loadavg odometer', this.logs_charts[log])
          }
        }.bind(this))

        // let source = this.log + '_os_freemem'
        // let chart_payload = this.$options.charts_payloads['os_freemem']
      }.bind(this)

      let __create_os_uptime = function (tabular_sources) {
        let re = /_os_uptime$/

        Object.each(tabular_sources, function (data, source) {
          if (re.test(source)) {
            debug('PRE __create_os_uptime', source, this.$options['dashboard_' + this.id]['tabular_sources'][source])

            let log = source.substring(0, source.indexOf('_'))
            let name = source + '_odometer'
            if (
              !this.available_charts[name] || !this.logs_charts[log] || !this.logs_charts[log][name]
            ) {
              debug('__create_os_uptime', name, this.$options['dashboard_' + this.id]['tabular_sources'][source])

              this.$set(this.available_charts, name, Object.merge(
                Object.clone({
                  name: name,
                  label: undefined,
                  chart: undefined,
                  init: undefined,
                  stop: undefined,
                  tabular: true, // this is for component, if not set, it's "chart-tabular"
                  wrapper: {
                    type: 'vue-odometer',
                    props: {
                      // decimals: 2,
                      options: {
                        // theme: 'car'
                        duration: 200
                      }
                    }
                  },
                  stat: {
                    merged: false,
                    // sources: [{type: 'stat', path: source}],
                    data: [],
                    // events: [{
                    //   log: this.log,
                    //   path: this.__match_source_paths(source.replace(this.log + '_', ''), this.$store.state['dashboard_' + this.log].paths, false),
                    //   // key: 'cpus',
                    //   // length: this.seconds,
                    //   tabular: false
                    //   // range: this.range
                    // }],
                    length: 2,
                    range: 2
                  }
                  /**
                    * for __get_stat_for_chart
                    **/
                  // pipeline: {
                  //   name: 'input.os'
                  //   // // path: 'os',
                  //   // range: true
                  // }
                })
                // chart_payload,
                // {
                //   // chart: {totalmem: stat_sources[this.log+'_os_totalmem'][0].data}
                //   chart: {totalmem: this.$options.stat_sources[this.log+'_os_totalmem'].data[0].value}
                // }
              ))

              // this.$set(this.available_charts[name], 'chart', Object.clone(pie_chart))
              this.$set(this.available_charts[name], 'chart', {})

              if (!this.logs_charts[log]) { this.$set(this.logs_charts, log, {}) }

              this.$set(this.logs_charts[log], name, this.available_charts[name])

              /**
              * set color based on current theme
              **/
              // this.__set_chart_color(source)
              // this.$set(this.available_charts[source].wrapper, 'props', {})
              // this.$set(this.available_charts[source].wrapper.props, 'smoothness', this.dygraph_smoothness)

              // this.set_chart_visibility(name, true)

              this.$on('tabular_sources', function () {
                let re = /_os_uptime$/
                Object.each(this.$options['dashboard_' + this.id]['tabular_sources'], function (data, source) {
                  if (re.test(source)) {
                    let log = source.substring(0, source.indexOf('_'))
                    let name = source + '_odometer'
                    debug('on tabular_sources', name, this.$options['dashboard_' + this.id]['tabular_sources'][source])

                    const seconds = this.$options['dashboard_' + this.id]['tabular_sources'][source].data[0][1]
                    const minutes = seconds / 60
                    const hours = minutes / 60
                    const days = hours / 24
                    let value = (days >= 1) ? days : ((hours >= 1) ? hours : ((minutes >= 1) ? minutes : seconds))
                    let label = (days >= 1) ? 'Uptime in days' : ((hours >= 1) ? 'Uptime in hours' : ((minutes >= 1) ? 'Uptime in minutes' : 'Uptime in seconds'))

                    debug('tabular_sources uptime', this.$options['dashboard_' + this.id]['tabular_sources'][source].data, seconds, minutes, hours, days, value)

                    this.$set(this.available_charts[name].stat, 'data', [[[this.$options['dashboard_' + this.id]['tabular_sources'][source].data[0][0], value]]])
                    this.$set(this.available_charts[name], 'label', label)

                    this.$set(
                      this.available_charts[name].chart,
                      'skip',
                      (this.available_charts[name].chart.skip > this.$options['dashboard_' + this.id]['tabular_sources'][source].step) ? this.available_charts[name].chart.skip : this.$options['dashboard_' + this.id]['tabular_sources'][source].step - 1
                    )

                    this.$set(
                      this.available_charts[name].chart,
                      'interval',
                      (this.available_charts[name].chart.interval > this.$options['dashboard_' + this.id]['tabular_sources'][source].step) ? this.available_charts[name].chart.interval : this.$options['dashboard_' + this.id]['tabular_sources'][source].step - 1
                    )
                  }
                }.bind(this))

                // }
              }.bind(this))
            }
            debug('os_uptime odometer', this.logs_charts[log])
          }
        }.bind(this))

        // let source = this.log + '_os_freemem'
        // let chart_payload = this.$options.charts_payloads['os_freemem']
      }.bind(this)

      let __create_freemem = function (stat_sources) {
        let re = /_os_freemem$/

        Object.each(stat_sources, function (data, source) {
          if (re.test(source)) {
            debug('PRE __create_freemem', source, this.$options['dashboard_' + this.id]['stat_sources'][source])

            let log = source.substring(0, source.indexOf('_'))
            let name = source + '_pie'
            if (
              (!this.available_charts[name] || !this.logs_charts[log] || !this.logs_charts[log][name]) &&
              stat_sources[log + '_os_totalmem']
            ) {
              debug('__create_freemem', name, this.$options['dashboard_' + this.id]['stat_sources'][source])

              let totalmem = (stat_sources[log + '_os_totalmem'].data[0].value / 1024 / 1024 / 1024).toFixed(0)
              this.$set(this.available_charts, name, Object.merge(
                Object.clone({
                  name: name,
                  label: 'RAM [' + totalmem + ' GB] free ',
                  chart: undefined,
                  init: undefined,
                  stop: undefined,
                  tabular: false, // this is for component, if not set, it's "chart-tabular"
                  wrapper: {
                    type: 'vue-easy-pie-chart',
                    props: {
                      decimals: 2,
                      options: {
                        // 'track-color': true,
                        size: 90,
                        // animated: false,
                        'font-size': '14px',
                        'bar-color': function (percentage) {
                          if (percentage > 0 && percentage < 20) {
                            return '#ff704d'
                          } else if (percentage > 20 && percentage < 40) {
                            return '#f6a05a'
                          } else if (percentage > 40 && percentage < 60) {
                            return '#f6d95b'
                          } else if (percentage > 60 && percentage < 80) {
                            return '#eef65a'
                          } else {
                            return '#86b300'
                          }
                        }
                      }
                    }
                  },
                  stat: {
                    merged: false,
                    // sources: [{type: 'stat', path: source}],
                    data: [this.$options['dashboard_' + this.id]['stat_sources'][source].data],
                    // events: [{
                    //   log: this.log,
                    //   path: this.__match_source_paths(source.replace(this.log + '_', ''), this.$store.state['dashboard_' + this.log].paths, false),
                    //   // key: 'cpus',
                    //   // length: this.seconds,
                    //   tabular: false
                    //   // range: this.range
                    // }],
                    length: 2,
                    range: 2
                  }
                  /**
                    * for __get_stat_for_chart
                    **/
                  // pipeline: {
                  //   name: 'input.os'
                  //   // // path: 'os',
                  //   // range: true
                  // }
                })
                // chart_payload,
                // {
                //   // chart: {totalmem: stat_sources[this.log+'_os_totalmem'][0].data}
                //   chart: {totalmem: this.$options.stat_sources[this.log+'_os_totalmem'].data[0].value}
                // }
              ))

              this.$set(this.available_charts[name], 'chart', Object.merge(Object.clone(pie_chart), {
                totalmem: stat_sources[log + '_os_totalmem'].data[0].value,
                watch: {
                  /**
                  * @trasnform: diff between each value against its prev one
                  */
                  transform: function (values, caller, chart) {
                    debug('freemem transform', values, chart.totalmem)
                    let last = Object.clone(values[values.length - 1])
                    last.value = ((last.value) * 100) / chart.totalmem

                    debug('freemem transformed', last)
                    return [last]
                    // return values
                  }
                }
                // options: {
                //   // 'track-color': false,
                //   size: 80,
                //   // animated: false,
                //   'font-size': '14px',
                //   'bar-color': function (percentage) {
                //     if (percentage > 0 && percentage < 33) {
                //       return '#ff704d'
                //     } else if (percentage > 33 && percentage < 66) {
                //       return '#f6d95b'
                //     } else {
                //       return '#86b300'
                //     }
                //   }
                // }
              }))

              if (!this.logs_charts[log]) { this.$set(this.logs_charts, log, {}) }

              this.$set(this.logs_charts[log], name, this.available_charts[name])

              /**
              * set color based on current theme
              **/
              // this.__set_chart_color(source)
              // this.$set(this.available_charts[source].wrapper, 'props', {})
              // this.$set(this.available_charts[source].wrapper.props, 'smoothness', this.dygraph_smoothness)

              // this.set_chart_visibility(name, true)

              this.$on('stat_sources', function () {
                let re = /_os_freemem$/
                Object.each(this.$options['dashboard_' + this.id]['stat_sources'], function (data, source) {
                  if (re.test(source)) {
                    let log = source.substring(0, source.indexOf('_'))
                    let name = source + '_pie'
                    debug('on stat_sources', name, this.$options['dashboard_' + this.id]['stat_sources'][source])

                    // if(this.$options['dashboard_' + this.id]['stat_sources'][source] !== undefined){
                    this.$set(this.available_charts[name].stat, 'data', [this.$options['dashboard_' + this.id]['stat_sources'][source].data])

                    this.$set(
                      this.available_charts[name].chart,
                      'skip',
                      (this.available_charts[name].chart.skip > this.$options['dashboard_' + this.id]['stat_sources'][source].step) ? this.available_charts[name].chart.skip : this.$options['dashboard_' + this.id]['stat_sources'][source].step - 1
                    )

                    this.$set(
                      this.available_charts[name].chart,
                      'interval',
                      (this.available_charts[name].chart.interval > this.$options['dashboard_' + this.id]['stat_sources'][source].step) ? this.available_charts[name].chart.interval : this.$options['dashboard_' + this.id]['stat_sources'][source].step - 1
                    )
                  }
                }.bind(this))

                // }
              }.bind(this))
            }
            debug('freemem pie', this.logs_charts[log])
          }
        }.bind(this))

        // let source = this.log + '_os_freemem'
        // let chart_payload = this.$options.charts_payloads['os_freemem']
      }.bind(this)

      let __tabular_sources_event = function () {
        debug('$options.tabular_sources', this.$options.tabular_sources, this.$store.state['dashboard_' + this.id].instances, this.$store.state['dashboard_' + this.id].paths.length)

        if (
          this.$options['dashboard_' + this.id] &&
          this.$options['dashboard_' + this.id].tabular_sources
          // &&
          // this.dashboard_instances &&
          // this.$store.state['dashboard_' + this.id].paths.length > 0
        ) {
          debug('$options.tabular_sources TRUE', this.$options['dashboard_' + this.id].tabular_sources, this.id)
          // __create_from_tabular_sources(this.$options.tabular_sources)
          // __create_os_procs_percentage_cpu(this.$options.tabular_sources)
          // __create_os_networkInterfaces_stats_packets_drop_err(this.$options.tabular_sources)
          // __create_os_mounts(this.$options.tabular_sources)
          __create_cpus_percentage(this.$options['dashboard_' + this.id].tabular_sources)
          __create_os_loadavg(this.$options['dashboard_' + this.id].tabular_sources)
          __create_os_uptime(this.$options['dashboard_' + this.id].tabular_sources)
          /**
          * should we turn it off??
          **/
          // this.$off('tabular_sources', __tabular_sources_event)
        }
      }.bind(this)

      this.$on('tabular_sources', __tabular_sources_event)

      let __stat_sources_event = function () {
        debug('$options.stat_sources', this.$options['dashboard_' + this.id].stat_sources, this.id)

        if (
          this.$options['dashboard_' + this.id] &&
          this.$options['dashboard_' + this.id].stat_sources
          // this.dashboard_instances &&
          // this.$store.state['dashboard_' + this.log].paths.length > 0
        ) {
          debug('$options.stat_sources TRUE', this.$options['dashboard_' + this.id].stat_sources, this.id)
          // __create_from_stat_sources(this.$options.stat_sources)
          __create_freemem(this.$options['dashboard_' + this.id].stat_sources)

          /**
          * should we turn it off??
          **/
          // this.$off('stat_sources', __stat_sources_event)
        }
      }.bind(this)

      this.$on('stat_sources', __stat_sources_event)
    },
    __process_dashboard_log: function (payloads) {
      debug('__process_dashboard_log', payloads)

      if (payloads && Array.isArray(payloads) && payloads.length > 0) {
        Array.each(payloads, function (payload) {
          let _type = (payload.type === 'stat' || payload.type === 'tabular') ? 'data' : payload.type
          this['__process_dashboard_' + _type].attempt(payload, this)
        }.bind(this))
      }
    },
    /**
    * MODIFED from original
    **/
    __process_dashboard_data: function (payload) {
      debug('__process_dashboard_data', payload)

      // if (payload && payload.log === this.log) {
      if (payload && payload.log) { // WATCH OUT - modified
        // let type = (payload.tabular == true) ? 'tabular' : 'stat'
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

                if (this.__white_black_lists_filter(whitelist, blacklist, path)) {
                  // this.$store.commit(type+'_sources/add', {key: payload.key+'_'+path, value: data})
                  this.__set_source(type, { key: payload.key + '_' + path, value: data, step: payload.step })
                }
              } else if (data) {
                Object.each(data, function (value, key) {
                  if (Array.isArray(value)) {
                    // if((whitelist && whitelist.test(path+'.'+key)) || (blacklist && !blacklist.test(path+'.'+key)))

                    if (this.__white_black_lists_filter(whitelist, blacklist, path + '_' + key)) {
                      // this.$store.commit(type+'_sources/add', {key: payload.key+'_'+path+'_'+key, value: value})
                      this.__set_source(type, { key: payload.key + '_' + path + '_' + key, value: value, step: payload.step })
                    }
                  } else {
                    // 3rd level, there is no need for more
                    Object.each(value, function (val, sub_key) {
                      if (this.__white_black_lists_filter(whitelist, blacklist, path + '_' + key + '_' + sub_key)) {
                        // this.$store.commit(type+'_sources/add', {key: payload.key+'_'+path+'_'+key+'_'+sub_key, value: val})
                        this.__set_source(type, { key: payload.key + '_' + path + '_' + key + '_' + sub_key, value: val, step: payload.step })
                      }
                    }.bind(this))
                  }
                }.bind(this))
              }

              if (counter === Object.getLength(payload[type]) - 1) {
                this.$set(this, init, true)
                this.$emit(type + '_sources')
                debug('emiting...' + type + '_sources')
              }

              counter++
            }.bind(this))
          }
          // else{
          //   this.$set(this, init, true)
          // }
        }
      }
    },
    __set_source: function (type, payload) {
      payload.key = payload.key.replace(/\./g, '_')
      payload.key = payload.key.replace(/%/g, 'percentage_') // prev to eslint, is it right? /\%/g

      if (!this.$options['dashboard_' + this.id]) this.$options['dashboard_' + this.id] = {}

      if (!this.$options['dashboard_' + this.id][type + '_sources']) this.$options['dashboard_' + this.id][type + '_sources'] = {}

      if (!this.$options['dashboard_' + this.id][type + '_sources'][payload.key]) this.$options['dashboard_' + this.id][type + '_sources'][payload.key] = { data: undefined, step: 1 }

      this.$options['dashboard_' + this.id][type + '_sources'][payload.key].data = payload.value
      if (payload.step - 1 && payload.step >= 1 && payload.step > this.$options['dashboard_' + this.id][type + '_sources'][payload.key].step) { this.$options['dashboard_' + this.id][type + '_sources'][payload.key].step = payload.step }

      // console.log('__set_source step', this.$options['dashboard_' + this.id][type+'_sources'][payload.key].step, payload.step)
      debug('__set_source', type, this.$options['dashboard_' + this.id][type + '_sources'])
    },
    /**
    * @end single log
    **/
    /**
    * all logs
    **/
    __process_dashboard_logs: function (payload) {
      debug('__process_dashboard_logs', payload)

      if (Array.isArray(payload.logs) && payload.logs.length > 0) {
        let _menu = {}
        Array.each(payload.logs, function (log) {
          _menu[log] = {
            label: log, icon: 'desktop_windows', route: { name: 'log', params: { log: log } }
          }
        })

        this.$set(this.panels.charts.menu.logs, 'menu', _menu)

        this.$store.commit('logs/clear')
        this.$store.commit('logs/set', payload.logs)
        this.create_pipelines(payload.logs)
      }
    }
  }
  // preFetch ({ store, currentRoute, previousRoute, redirect, ssrContext }) {
  //   if (process.env.DEV) { debug('preFetch %o', currentRoute) }
  //
  //   debug('preFetch %o', currentRoute)
  //   // store.registerModule('foo', fooStoreModule)
  //   // return store.dispatch('foo/inc')
  //   // if (currentRoute.params.id) { this.id = currentRoute.params.id }
  // }

  // mounted () {
  //   debug(process.env.DEV, process.env.NODE_ENV)
  // }
}
</script>
