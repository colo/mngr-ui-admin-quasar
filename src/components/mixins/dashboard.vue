<template>
  <div></div>
</template>

<script>
// import the module here instead of in `src/store/index.js`

import * as Debug from 'debug'
const debug = Debug('mngr-ui:components:mixins:dashboard')
// const debug_internals = Debug('mngr-ui:components:mixins:dashboard:Internals')
// const debug_events = Debug('mngr-ui:components:mixins:dashboard:Events')

import dashboardStoreModule from 'src/store/dashboard'

export default {

  data () {
    return {
      id: undefined
    }
  },

  watch: {
    'id': function (id, old) {
      // if (process.env.DEV) { debug('id', id) }

      this.__register_module(id, old)
      debug('id', id)
    }
  },
  mounted: function () {
    if (process.env.DEV) { debug('mounted %s', this.id) }
    this.__register_module(this.id)
  },
  methods: {
    __register_module: function (id, old) {
      if (old && this.$store.state['dashboard_' + old]) { this.$store.unregisterModule('dashboard_' + old) }
      if (id && !this.$store.state['dashboard_' + id]) { this.$store.registerModule('dashboard_' + id, Object.clone(dashboardStoreModule)) }
    }
  }
}
</script>
