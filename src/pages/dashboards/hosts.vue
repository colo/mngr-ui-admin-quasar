<template>
  <q-page class="bg-secondary">

    <dashboard-menu>
      <dashboard-menu-tabs :tabs="menuTabs">
        <template v-slot:panel="{ tab }">
          <!-- <span v-if="tab.name === 'charts'">charts</span> -->
          <component v-bind:is="'dashboard-menu-tabs-panel-'+tab.name" :options="panels[tab.name]">

            <template v-if="tab.name === 'settings'" v-slot:performance="{ option }">
              {{option}}

              <!-- <component v-bind:is="'dashboard-menu-tabs-panel-'+tab.name+'-'+setting">
              </component> -->

            </template>

          </component>
        </template>
      </dashboard-menu-tabs>
    </dashboard-menu>
    <!-- <div class="q-pa-none row justify-end"> -->
    <div class="q-pa-md row">

      <!-- <div class="column items-end"> -->
      <!-- <div class="col text-grey">
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
      </div> -->

    </div>
    <router-view />

  </q-page>
</template>

<script>

import * as Debug from 'debug'

const debug = Debug('mngr-ui:pages:dashboard:default')
// const debug_internals = Debug('mngr-ui:pages:dashboard:default:Internals')
// const debug_events = Debug('mngr-ui:pages:dashboard:default:Events')

// import dashboardMixinDygraph from '@mixins/dashboard.dygraph'
import dashboardMixin from '@mixins/dashboard'

import dashboardMenuTabsPanelCharts from '@components/dashboard/menu.tabs.panel.charts.vue'
import dashboardMenuTabsPanelSettings from '@components/dashboard/menu.tabs.panel.settings.vue'

export default {

  mixins: [dashboardMixin],

  components: {
    dashboardMenuTabsPanelCharts,
    dashboardMenuTabsPanelSettings
  },

  data () {
    return {
      id: 'hosts',
      menuTabs: [
        { name: 'charts', label: 'Charts', active: true },
        { name: 'settings', label: 'Settings' }
      ],
      panels: {
        'charts': {},
        'settings': { performance: ['dygraph'] }

      }
    }
  },
  created: function () {
    this.id = this.id
  },
  preFetch ({ store, currentRoute, previousRoute, redirect, ssrContext }) {
    if (process.env.DEV) { debug('preFetch %o', currentRoute) }

    debug('preFetch %o', currentRoute)
    // store.registerModule('foo', fooStoreModule)
    // return store.dispatch('foo/inc')
    // if (currentRoute.params.id) { this.id = currentRoute.params.id }
  }

  // mounted () {
  //   debug(process.env.DEV, process.env.NODE_ENV)
  // }
}
</script>
