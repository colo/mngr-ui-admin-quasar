<template>
  <q-page class="flex flex-center bg-secondary">
    <!-- <img alt="Quasar logo" src="~assets/quasar-logo-full.svg"> -->
  </q-page>
</template>

<style>
</style>

<script>
// import { Loading } from 'quasar';

import * as Debug from 'debug'
const debug = Debug('mngr-ui:pages:Index')
// const debug_internals = Debug('mngr-ui:pages:Index:Internals')
// const debug_events = Debug('mngr-ui:pages:Index:Events')

export default {
  name: 'PageIndex'

  // preFetch({
  //   store, currentRoute, previousRoute, redirect, ssrContext,
  // }) {
  //   Loading.show();
  //
  //   return new Promise((resolve) => {
  //     // do something async here
  //     // then call "resolve()"
  //     setTimeout(resolve, 1000);
  //   }).then(() => {
  //     Loading.hide();
  //   });
  // },
}
</script>
