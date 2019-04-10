<template>
  <!-- <q-layout class="bg-secondary"> -->
  <q-layout view="hHh lpR lFr">

    <q-drawer
      v-model="drawer"
      side="right"
      overlay
      bordered
      mini
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
    <!-- content-class="bg-secondary text-grey-4" -->

    <!-- v-model="right"
     -->
    <!-- this is where the Pages are injected -->
    <q-page-container>
      <router-view></router-view>
    </q-page-container>


  </q-layout>
</template>

<script>


export default {
  name: 'Dashboard',
  data() {
    return {
      // leftDrawerOpen: this.$q.platform.is.desktop,
      drawer: true,
      // miniState: true,
      // right: true,
      // lang: this.$q.lang.isoName,
    };
  },
  // watch: {
  //   lang(lang) {
  //     // dynamic import, so loading on demand only
  //     import(`quasar/lang/${lang}`).then((l) => {
  //       this.$q.lang.set(l.default);
  //       this.$i18n.locale = l.default.isoName;
  //       // console.log(l.default);
  //     });
  //   },
  // },
  // created() {
  //   this.langOptions = languages.map(lang => ({
  //     label: lang.nativeName, value: lang.isoName,
  //   }));
  // },
  // methods: {
  //   openURL,
  // },
};
</script>

<style>
</style>
