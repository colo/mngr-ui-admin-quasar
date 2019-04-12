<template>
  <q-page class="bg-secondary">

    <dashboard-menu />

    <div class="q-pa-md row justify-end">
      <!-- <div class="column items-end"> -->
        <!-- <div class="col">
         .col
       </div> -->
       <div class="col-8">
        .col-12 .col-md-auto (Variable width content)
      </div>

       <div class="col-auto gt-sm">

        ads
      </div>
      <!-- </div> -->
    </div>
    <!-- <div class="text-white">hello</div> -->
    <!-- <img alt="Quasar logo" src="~assets/quasar-logo-full.svg"> -->
  </q-page>
</template>

<script>

import * as Debug from 'debug'

const debug = Debug('mngr-ui:pages:dashboard:default')
// const debug_internals = Debug('mngr-ui:pages:dashboard:default:Internals')
// const debug_events = Debug('mngr-ui:pages:dashboard:default:Events')

import dashboardMenu from '@components/dashboard/menu.vue'
import dashboardMixinDygraph from '@mixins/dashboard.dygraph'

export default {
  components: {
    dashboardMenu
  },
  mixins: [dashboardMixinDygraph],

  data () {
    return {
      id: 'default'

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
