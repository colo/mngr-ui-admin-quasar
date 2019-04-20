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
    <div class="q-pa-md row">

      <!-- <div class="column items-end"> -->
      <div class="col text-grey">
        .col
      </div>
      <div class="col-8 text-grey">
        qqewqwe
      </div>

      <div
        v-if="!$route.params.host"
        class="col-auto gt-sm text-grey"
      >
        asdasd
      </div>

    </div>
    <router-view />

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

export default {
  name: 'dashboard-hosts',

  mixins: [dashboardDygraphMixin],

  components: {
    dashboardMenuTabsPanelCharts,
    dashboardMenuTabsPanelSettings,
    dashboardMenuTabsPanelSettingsPerformanceGraph,
    dashboardMenuTabsPanelSettingsPerformanceDygraph
  },

  data () {
    return {
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
                colo: {
                  label: 'colo', icon: 'desktop_windows', route: { name: 'hosts', params: {}, hash: '#colo' }
                }
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
    this.id = this.id
    this.$eventbus.$on('host_menu', this.handleMenu.bind(this))
  },
  mounted: function () {
    // debug('created smoothness', this.dygraph_smoothness)

    this.$set(this.panels.settings.performance.graph, 'always_update', this.graph_always_update)
    this.$set(this.panels.settings.performance.dygraph, 'smoothness', this.dygraph_smoothness)
  },
  methods: {
    handleInput: function (payload) {
      this.$set(this.panels, 'settings', Object.merge(this.panels.settings, payload))
      debug('handleInput', payload)
    },
    handleMenu: function (payload) {
      this.$set(this.panels, 'charts', { menu: Object.merge(this.panels.charts.menu, payload) })
      debug('handleMenu', this.panels.charts.menu)
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
