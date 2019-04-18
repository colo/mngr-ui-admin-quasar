<template>
<div>
  <q-tabs
    v-model="active"
    dense
    align="justify"
    indicator-color="negative"
    narrow-indicator
  >
    <template v-for="tab in tabs">
      <q-tab :key="tab.name" :name="tab.name" :label="tab.label || tab.name" />
    </template>

  </q-tabs>

  <q-separator />

  <q-tab-panels
    v-model="active"
    animated
    class="bg-secondary"
    :dark="$store.state.app.theme.current === 'slate'"
  >
    <template v-for="tab in tabs">
      <q-tab-panel :key="tab.name" :name="tab.name" :dark="$store.state.app.theme.current === 'slate'">

        <slot name="panel" v-bind:tab="tab">
        </slot>

      </q-tab-panel>
    </template>

  </q-tab-panels>
</div>
</template>

<script>

import * as Debug from 'debug'
const debug = Debug('mngr-ui:components:dashboard:menu:tabs')

export default {
  name: 'dashboard-menu-tabs',

  props: {
    tabs: {
      type: [Array],
      default: () => ([])
    }
  },
  computed: {
    'active': {
      // getter
      get: function () {
        let active = ''
        Array.each(this.tabs, function (tab) {
          if (tab.active === true) active = tab.name
        })
        return active
      },
      // setter
      set: function (newValue) {
        Array.each(this.tabs, function (tab, index) {
          if (tab.name === newValue) { this.$set(this.tabs[index], 'active', true) } else { this.$set(this.tabs[index], 'active', false) }
        }.bind(this))
        // debug(newValue)
      }
    }
  }
  // data () {
  //   return {
  //
  //     check1: true,
  //     check2: false,
  //     check3: false,
  //
  //     notif1: true,
  //     notif2: true,
  //     notif3: false,
  //
  //     volume: 6,
  //     brightness: 3,
  //     mic: 8
  //   }
  // }
}
</script>
