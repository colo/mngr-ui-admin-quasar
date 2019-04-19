<template>
  <q-item tag="label" v-ripple>
  <q-item-section>
  <q-item-label>Always update</q-item-label>
  </q-item-section>
  <q-item-section side >
  <q-toggle color="positive" v-model="OnOff" val="always_update" />
  </q-item-section>
  </q-item>

</template>

<script>
import * as Debug from 'debug'
const debug = Debug('mngr-ui:components:dashboard:menu:tabs:panel:settings:performance')

export default {
  name: 'dashboard-menu-tabs-panel-settings-performance-graph',

  props: {
    always_update: {
      type: [Boolean],
      default: false
    }
  },

  computed: {
    'OnOff': {
      // getter
      get: function () {
        return this.always_update
      },
      // setter
      set: function (newValue) {
        // Array.each(this.tabs, function (tab, index) {
        //   if (tab.name === newValue) { this.$set(this.tabs[index], 'active', true) } else { this.$set(this.tabs[index], 'active', false) }
        // }.bind(this))
        // this.$set(this, 'smoothness', newValue)
        // debug('set', newValue)
        this.$emit('input', { performance: { graph: { always_update: newValue } } })
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
