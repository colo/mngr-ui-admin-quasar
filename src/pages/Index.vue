<template>
  <q-page class="flex flex-center bg-secondary">
    <!-- <img alt="Quasar logo" src="~assets/quasar-logo-full.svg"> -->
  </q-page>
</template>

<style>
</style>

<script>
import { Loading } from 'quasar';

export default {
  name: 'PageIndex',

  preFetch({
    store, currentRoute, previousRoute, redirect, ssrContext,
  }) {
    Loading.show();

    return new Promise((resolve) => {
      // do something async here
      // then call "resolve()"
      setTimeout(resolve, 1000);
    }).then(() => {
      Loading.hide();
    });
  },
};
</script>
