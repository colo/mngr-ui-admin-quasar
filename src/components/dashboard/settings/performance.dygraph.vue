<template>
  <q-item tag="label" v-ripple>
  <q-item-section>
  <q-item-label>Dygraph: smoothness</q-item-label>
  </q-item-section>
  <q-item-section side >
  <q-toggle color="positive" v-model="OnOff" val="dygraph.smoothness" />
  </q-item-section>
  </q-item>

</template>

<script>
import * as Debug from 'debug'
const debug = Debug('mngr-ui:components:dashboard:menu:tabs:panel:settings:performance:dygraph')

export default {
  name: 'dashboard-menu-tabs-panel-settings-performance-dygraph',

  props: {
    smoothness: {
      type: [Boolean],
      default: false
    }
  },

  computed: {
    'OnOff': {
      // getter
      get: function () {
        return this.smoothness
      },
      // setter
      set: function (newValue) {
        // Array.each(this.tabs, function (tab, index) {
        //   if (tab.name === newValue) { this.$set(this.tabs[index], 'active', true) } else { this.$set(this.tabs[index], 'active', false) }
        // }.bind(this))
        // this.$set(this, 'smoothness', newValue)
        // debug('set', newValue)
        this.$emit('input', { performance: { dygraph: { smoothness: newValue } } })
      }
    }
  },

  data () {
    return {
      // notif1: true
    }
  }
}
</script>
