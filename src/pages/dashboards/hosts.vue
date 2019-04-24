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
    <!-- <div class="q-pa-none row justify-end"> -->
    <!-- <div class="q-pa-md row"> -->

      <!-- <div class="column items-end"> -->
      <!-- <div class="col-4 text-grey">
        .col
      </div> -->
      <!-- <div class="col-8 text-grey">
        qqewqwe
      </div> -->
        <!-- <div class="q-pa-md row text-grey"> -->

          <div
            v-for="host in $store.state['hosts'].all"
            :key="host"
            style="width: 100%"
            class="row"
          >
          <!-- :class="(!$route.params.host) ? 'col-4 gt-sm text-grey' : 'col-auto gt-sm text-grey'" -->
          <q-expansion-item
            v-if="!$route.params.host || host === $route.params.host"
            :id="host+'-collapsible'"
            :key="host+'-collapsible'"
            :label="host"
            :name="host"
            default-opened
            :header-inset-level="0"
            :content-inset-level="0"
          >
            <!-- <q-card class="text-grey"> -->
              <template v-for="(chart, name) in hosts_charts[host]">
                <div :key="host+'-'+name" class="col-auto text-grey">
              <!-- <q-card class="text-grey"> -->
                <!-- <q-card-section :key="host+'-'+name"> -->

              <!-- class="col gt-sm text-grey q-mb-lg" -->
              <!-- class="q-mb-lg" -->
                <!-- {{host}} {{name}} -->
                <!-- :style="chart.chart.style"  -->
                <!-- <transition-group name="sumarry-component"> -->
                  <!-- <keep-alive> -->
                  <component

                    :key="host+'-'+name+'component'"
                    :is="chart.tabular === false ? 'chart' : 'chart-tabular'"
                    dashboard="hosts"
                    :wrapper="chart.wrapper"
                    :ref="host+'-'+name"
                    :id="host+'-'+name"
                    :EventBus="$eventbus"
                    :chart="chart.chart"
                    :stat="{
                      range: chart.stat.range,
                      length: chart.stat.length,
                      merged: chart.stat.merged,
                      data: chart.stat.data
                    }"
                  >
                  <!-- :stat="{
                    range: range,
                    length: chart.stat.length,
                    merged: chart.stat.merged,
                    data: chart.stat.sources ? chart.stat.sources.map(function(source){ return $store.state[source.type+'_sources'][source.path]}) : chart.stat.data
                  }" -->
                  <!-- :always_update="graph_always_update" -->
                  </component>
                  <!-- </keep-alive> -->
                <!-- </transition-group > -->

                <!-- </q-card-section> -->
                  </div>
                </template>
              <!-- </q-card> -->

            <!-- </div> -->
            <!-- <q-separator /> -->

          </q-expansion-item>
          </div>

        <!-- </div> -->
        <!-- https://stackoverflow.com/questions/40404787/best-practice-for-reacting-to-params-changes-with-vue-router -->

    <!-- </div> -->

    <transition name="view" mode="out-in" appear>
      <router-view :key="$route.params.host"/>
    </transition>

  </q-page>
</template>

<script>

import * as Debug from 'debug'

const debug = Debug('mngr-ui:pages:dashboard:hosts')
// const debug_internals = Debug('mngr-ui:pages:dashboard:hosts:Internals')
// const debug_events = Debug('mngr-ui:pages:dashboard:hosts:Events')

// import dashboardMixinDygraph from '@mixins/dashboard.dygraph'
import dashboardDygraphMixin from '@mixins/dashboard.dygraph'

import dashboardMenuTabsPanelCharts from '@components/dashboard/menu.tabs.panel.charts.vue'
import dashboardMenuTabsPanelSettings from '@components/dashboard/menu.tabs.panel.settings.vue'

import dashboardMenuTabsPanelSettingsPerformanceGraph from '@components/dashboard/settings/performance.graph.vue'
import dashboardMenuTabsPanelSettingsPerformanceDygraph from '@components/dashboard/settings/performance.dygraph.vue'

import Pipeline from 'js-pipeline'
import HostsPipeline from '@libs/pipelines/hosts'
import hostsStoreModule from 'src/store/hosts'

import HostPipeline from '@libs/pipelines/hosts.host'

import pie_chart from 'mngr-ui-admin-charts/defaults/vueEasyPieChart'

export default {
  name: 'dashboard-hosts',

  mixins: [dashboardDygraphMixin],

  components: {
    dashboardMenuTabsPanelCharts,
    dashboardMenuTabsPanelSettings,
    dashboardMenuTabsPanelSettingsPerformanceGraph,
    dashboardMenuTabsPanelSettingsPerformanceDygraph
  },

  /**
  * @start - from pages/dashboard/host.vue
  **/
  tabular_sources: undefined,
  stat_sources: undefined,
  // stat_whitelist: /^[a-zA-Z0-9_.]+$/,
  stat_whitelist: /freemem|totalmem|cpus/,
  tabular_whitelist: /os_cpus_percentage|os_loadavg|os_uptime/,
  // tabular_whitelist: /^[a-zA-Z0-9_.]+$/,
  /**
  * @end - from pages/dashboard/host.vue
  **/

  data () {
    return {
      hosts_charts: {},
      id: 'hosts',
      menuTabs: [
        { name: 'charts', label: 'Charts', active: true },
        { name: 'settings', label: 'Settings' }
      ],
      panels: {
        'charts': {
          menu: {
            hosts: {
              label: 'Hosts',
              icon: 'desktop_windows',
              route: {},
              menu: {
                // colo: {
                //   label: 'colo', icon: 'desktop_windows', route: { name: 'host', params: { host: 'colo' } }
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
    this.$eventbus.$on('host_menu', this.handleMenu.bind(this))
  },
  mounted: function () {
    debug('mounted')

    this.$set(this.panels.settings.performance.graph, 'always_update', this.graph_always_update)
    this.$set(this.panels.settings.performance.dygraph, 'smoothness', this.dygraph_smoothness)
    this.__hosts_module()
  },
  beforeUpdate: function () {
    debug('beforeUpdate')
    if (!this.$route.params.host) { this.panels.charts.menu.host = undefined }
  },
  beforeDestroy: function () {
    debug('life cycle beforeDestroy', this.id)
    this.$eventbus.$off('hosts')
    this.$eventbus.$off('hosts.host')
    this.$eventbus.$off('host_menu')
  },
  methods: {

    __hosts_module: function () {
      debug('__hosts_module')

      if (!this.$store.state['hosts']) { this.$store.registerModule('hosts', hostsStoreModule) }
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
    create_pipelines: function (hosts, next) {
      debug('create_pipelines', hosts)

      if (hosts && Array.isArray(hosts)) {
        Array.each(hosts, function (host) {
          if (host) {
            let template = Object.clone(HostPipeline)

            template.input[0].poll.conn[0].stat_host = host

            template.input[0].poll.id += '-' + host
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

      let template = Object.clone(HostsPipeline)

      let pipeline_id = template.input[0].poll.id

      if (!this.$options.pipelines[pipeline_id]) {
        let pipe = new Pipeline(template)

        this.$options.pipelines[pipeline_id] = pipe
      } else if (this.$options.pipelines[pipeline_id].inputs[0].options.suspended !== false) {
        debug('HostsPipeline suspended', this.$options.pipelines[pipeline_id].inputs[0].options.suspended)
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
    __create: function (id, next) { // process one event only ('host')
      this.$eventbus.$on('hosts', this.__process_dashboard_hosts.bind(this))
      this.$eventbus.$on('hosts.host', this.__process_dashboard_host.bind(this))

      let __init = function (next) {
        this.__init_charts()
        this.$nextTick(this.fire_pipelines_events())

        if (next) { next() }
      }.bind(this)

      if (process.env.DEV) debug('__create', Object.getLength(this.$options.pipelines))

      if (Object.getLength(this.$options.pipelines) === 0) {
        this.create_pipelines(this.$store.state['hosts'].all, __init.pass(next))
      } else if (next) {
        __init(next())
      }
    },
    /**
    * @start single host (from pages/dashboard/host.vue)
    **/
    __init_charts: function (next) {
      // this.$options.charts_payloads = host_charts_payloads({
      //   host: this.host,
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
      //       this.$store.state['dashboard_' + this.host].paths.length > 0 &&
      //       this.__white_black_lists_filter(whitelist, blacklist, source)
      //     ) {
      //       debug('__init_charts $store.state.tabular_sources creating', source, this.__match_source_paths(source.replace(this.host + '_', ''), this.$store.state['dashboard_' + this.host].paths, false))
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
      //               host: this.host,
      //               path: this.__match_source_paths(source.replace(this.host + '_', ''), this.$store.state['dashboard_' + this.host].paths, false),
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
      //         debug('host tabular_sources skip', this.$options['tabular_sources'][source].step)
      //         // console.log('host tabular_sources skip', this.$options['tabular_sources'][source].step)
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
      //       this.$store.state['dashboard_' + this.host].paths.length > 0 &&
      //       this.__white_black_lists_filter(whitelist, blacklist, source)
      //     ) {
      //       debug('__init_charts $store.state.stat_sources creating', source, this.__match_source_paths(source.replace(this.host + '_', ''), this.$store.state['dashboard_' + this.host].paths, false))
      //
      //       let chart_payload = this.$options.charts_payloads[source.replace(this.host + '_', '')]
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
      //               host: this.host,
      //               path: this.__match_source_paths(source.replace(this.host + '_', ''), this.$store.state['dashboard_' + this.host].paths, false),
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
            debug('PRE __create_cpus_percentage', source, this.$options['tabular_sources'][source])

            let host = source.substring(0, source.indexOf('_'))
            let name = source + '_pie'
            if (
              !this.available_charts[name]
            ) {
              debug('__create_cpus_percentage', name, this.$options['tabular_sources'][source])

              this.$set(this.available_charts, name, Object.merge(
                Object.clone({
                  name: name,
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
                        // size: 80,
                        // animated: false,
                        'font-size': '14px',
                        'bar-color': function (percentage) {
                          if (percentage > 0 && percentage < 33) {
                            return '#86b300'
                          } else if (percentage > 33 && percentage < 66) {
                            return '#f6d95b'
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
                    data: [this.$options['tabular_sources'][source].data],
                    // events: [{
                    //   host: this.host,
                    //   path: this.__match_source_paths(source.replace(this.host + '_', ''), this.$store.state['dashboard_' + this.host].paths, false),
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
                //   // chart: {totalmem: stat_sources[this.host+'_os_totalmem'][0].data}
                //   chart: {totalmem: this.$options.stat_sources[this.host+'_os_totalmem'].data[0].value}
                // }
              ))

              this.$set(this.available_charts[name], 'chart', Object.clone(pie_chart))

              if (!this.hosts_charts[host]) { this.$set(this.hosts_charts, host, {}) }

              this.$set(this.hosts_charts[host], name, this.available_charts[name])

              /**
              * set color based on current theme
              **/
              // this.__set_chart_color(source)
              // this.$set(this.available_charts[source].wrapper, 'props', {})
              // this.$set(this.available_charts[source].wrapper.props, 'smoothness', this.dygraph_smoothness)

              this.set_chart_visibility(name, true)

              this.$on('tabular_sources', function () {
                let re = /_os_cpus_percentage$/
                Object.each(this.$options['tabular_sources'], function (data, source) {
                  if (re.test(source)) {
                    let host = source.substring(0, source.indexOf('_'))
                    let name = source + '_pie'
                    debug('on tabular_sources', name, this.$options['tabular_sources'][source])

                    // if(this.$options['stat_sources'][source] !== undefined){
                    this.$set(this.available_charts[name].stat, 'data', [this.$options['tabular_sources'][source].data])

                    this.$set(
                      this.available_charts[name].chart,
                      'skip',
                      (this.available_charts[name].chart.skip > this.$options['tabular_sources'][source].step) ? this.available_charts[name].chart.skip : this.$options['tabular_sources'][source].step - 1
                    )

                    this.$set(
                      this.available_charts[name].chart,
                      'interval',
                      (this.available_charts[name].chart.interval > this.$options['tabular_sources'][source].step) ? this.available_charts[name].chart.interval : this.$options['tabular_sources'][source].step - 1
                    )
                  }
                }.bind(this))

                // }
              }.bind(this))
            }
            debug('cpus_percentage pie', this.hosts_charts[host])
          }
        }.bind(this))

        // let source = this.host + '_os_freemem'
        // let chart_payload = this.$options.charts_payloads['os_freemem']
      }.bind(this)

      let __create_freemem = function (stat_sources) {
        let re = /_os_freemem$/

        Object.each(stat_sources, function (data, source) {
          if (re.test(source)) {
            debug('PRE __create_freemem', source, this.$options['stat_sources'][source])

            let host = source.substring(0, source.indexOf('_'))
            let name = source + '_pie'
            if (
              !this.available_charts[name] &&
              stat_sources[host + '_os_totalmem']
            ) {
              debug('__create_freemem', name, this.$options['stat_sources'][source])

              this.$set(this.available_charts, name, Object.merge(
                Object.clone({
                  name: name,
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
                          if (percentage > 0 && percentage < 33) {
                            return '#ff704d'
                          } else if (percentage > 33 && percentage < 66) {
                            return '#f6d95b'
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
                    data: [this.$options['stat_sources'][source].data],
                    // events: [{
                    //   host: this.host,
                    //   path: this.__match_source_paths(source.replace(this.host + '_', ''), this.$store.state['dashboard_' + this.host].paths, false),
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
                //   // chart: {totalmem: stat_sources[this.host+'_os_totalmem'][0].data}
                //   chart: {totalmem: this.$options.stat_sources[this.host+'_os_totalmem'].data[0].value}
                // }
              ))

              this.$set(this.available_charts[name], 'chart', Object.merge(Object.clone(pie_chart), {
                totalmem: this.$options.stat_sources[host + '_os_totalmem'].data[0].value,
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

              if (!this.hosts_charts[host]) { this.$set(this.hosts_charts, host, {}) }

              this.$set(this.hosts_charts[host], name, this.available_charts[name])

              /**
              * set color based on current theme
              **/
              // this.__set_chart_color(source)
              // this.$set(this.available_charts[source].wrapper, 'props', {})
              // this.$set(this.available_charts[source].wrapper.props, 'smoothness', this.dygraph_smoothness)

              this.set_chart_visibility(name, true)

              this.$on('stat_sources', function () {
                let re = /_os_freemem$/
                Object.each(this.$options['stat_sources'], function (data, source) {
                  if (re.test(source)) {
                    let host = source.substring(0, source.indexOf('_'))
                    let name = source + '_pie'
                    debug('on stat_sources', name, this.$options['stat_sources'][source])

                    // if(this.$options['stat_sources'][source] !== undefined){
                    this.$set(this.available_charts[name].stat, 'data', [this.$options['stat_sources'][source].data])

                    this.$set(
                      this.available_charts[name].chart,
                      'skip',
                      (this.available_charts[name].chart.skip > this.$options['stat_sources'][source].step) ? this.available_charts[name].chart.skip : this.$options['stat_sources'][source].step - 1
                    )

                    this.$set(
                      this.available_charts[name].chart,
                      'interval',
                      (this.available_charts[name].chart.interval > this.$options['stat_sources'][source].step) ? this.available_charts[name].chart.interval : this.$options['stat_sources'][source].step - 1
                    )
                  }
                }.bind(this))

                // }
              }.bind(this))
            }
            debug('freemem pie', this.hosts_charts[host])
          }
        }.bind(this))

        // let source = this.host + '_os_freemem'
        // let chart_payload = this.$options.charts_payloads['os_freemem']
      }.bind(this)

      let __tabular_sources_event = function () {
        debug('$options.tabular_sources', this.$options.tabular_sources, this.$store.state['dashboard_' + this.id].instances, this.$store.state['dashboard_' + this.id].paths.length)

        if (
          this.$options.tabular_sources
          // &&
          // this.dashboard_instances &&
          // this.$store.state['dashboard_' + this.id].paths.length > 0
        ) {
          debug('$options.tabular_sources TRUE', this.$options.tabular_sources, this.id)
          // __create_from_tabular_sources(this.$options.tabular_sources)
          // __create_os_procs_percentage_cpu(this.$options.tabular_sources)
          // __create_os_networkInterfaces_stats_packets_drop_err(this.$options.tabular_sources)
          // __create_os_mounts(this.$options.tabular_sources)
          __create_cpus_percentage(this.$options.tabular_sources)
          /**
          * should we turn it off??
          **/
          // this.$off('tabular_sources', __tabular_sources_event)
        }
      }.bind(this)

      this.$on('tabular_sources', __tabular_sources_event)

      let __stat_sources_event = function () {
        debug('$options.stat_sources', this.$options.stat_sources, this.id)

        if (
          this.$options.stat_sources
          // this.dashboard_instances &&
          // this.$store.state['dashboard_' + this.host].paths.length > 0
        ) {
          debug('$options.stat_sources TRUE', this.$options.stat_sources, this.id)
          // __create_from_stat_sources(this.$options.stat_sources)
          __create_freemem(this.$options.stat_sources)

          /**
          * should we turn it off??
          **/
          // this.$off('stat_sources', __stat_sources_event)
        }
      }.bind(this)

      this.$on('stat_sources', __stat_sources_event)
    },
    __process_dashboard_host: function (payloads) {
      debug('__process_dashboard_host', payloads)

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

      // if (payload && payload.host === this.host) {
      if (payload && payload.host) { // WATCH OUT - modified
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

      if (!this.$options[type + '_sources']) this.$options[type + '_sources'] = {}

      if (!this.$options[type + '_sources'][payload.key]) this.$options[type + '_sources'][payload.key] = { data: undefined, step: 1 }

      this.$options[type + '_sources'][payload.key].data = payload.value
      if (payload.step - 1 && payload.step >= 1 && payload.step > this.$options[type + '_sources'][payload.key].step) { this.$options[type + '_sources'][payload.key].step = payload.step }

      // console.log('__set_source step', this.$options[type+'_sources'][payload.key].step, payload.step)
      debug('__set_source', type, this.$options[type + '_sources'])
    },
    /**
    * @end single host
    **/
    /**
    * all hosts
    **/
    __process_dashboard_hosts: function (payload) {
      debug('__process_dashboard_hosts', payload)

      if (Array.isArray(payload.hosts) && payload.hosts.length > 0) {
        let _menu = {}
        Array.each(payload.hosts, function (host) {
          _menu[host] = {
            label: host, icon: 'desktop_windows', route: { name: 'host', params: { host: host } }
          }
        })

        this.$set(this.panels.charts.menu.hosts, 'menu', _menu)

        this.$store.commit('hosts/clear')
        this.$store.commit('hosts/set', payload.hosts)
        this.create_pipelines(payload.hosts)
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
