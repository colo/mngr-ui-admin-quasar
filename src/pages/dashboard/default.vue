<template>
  <q-page class="flex flex-center bg-secondary">
    <q-drawer
      v-model="drawer"
      side="right"
      overlay
      bordered
      show-if-above
    >
    <div class="list platform-delimiter">
      <div class="list-header">
        Right Side Drawer
      </div>
      <q-drawer-link icon="mail" to="/shopping-cart">Shopping Cart</q-drawer-link>
      <q-drawer-link icon="mail" to="/weather">Weather</q-drawer-link>
    </div>
    </q-drawer>
    <div class="text-white">hello</div>
    <!-- <img alt="Quasar logo" src="~assets/quasar-logo-full.svg"> -->
  </q-page>
</template>
