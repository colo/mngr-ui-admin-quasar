<template>
  <q-drawer
    v-model="drawer"
    side="right"
    content-class="bg-secondary"
    class="gt-sm"
    :width="280"
  >
    <q-card
      :dark="$store.state.app.theme.current === 'slate'"
      square
      flat
      class="bg-secondary"
    >
      <slot></slot>
    </q-card>

  </q-drawer>
</template>

<script>
export default {
  name: 'dashboard-menu',

  data () {
    return {

      drawer: true
      // tab: 'charts',

      // check1: true,
      // check2: false,
      // check3: false,
      //
      // notif1: true,
      // notif2: true,
      // notif3: false,
      //
      // volume: 6,
      // brightness: 3,
      // mic: 8
    }
  }
}
</script>
