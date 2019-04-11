<template>
  <div></div>
</template>

<script>

import * as Debug from 'debug'
const debug = Debug('mngr-ui:components:components:dashboard')
// const debug_internals = Debug('mngr-ui:components:components:dashboard:Internals')
// const debug_events = Debug('mngr-ui:components:components:dashboard:Events')

import dashboardStoreModule from 'src/store/dashboard'

import dashboardMixin from '@mixins/dashboard'

export default {
  name: 'Dashboard',
  mixins: [dashboardMixin],

  preFetch ({ store, currentRoute, previousRoute, redirect, ssrContext }) {
    if (process.env.DEV) { debug('preFetch %o', currentRoute) }

    debug('preFetch %o', currentRoute)
    // store.registerModule('foo', fooStoreModule)
    // return store.dispatch('foo/inc')
  },

  // IMPORTANT: avoid duplicate module registration on the client
  // when the route is visited multiple times.
  destroyed () {
    // this.$store.unregisterModule('foo')
  },

  computed: {
    // fooCount () {
    //   return this.$store.state.foo.count
    // }
  }
}
</script>
