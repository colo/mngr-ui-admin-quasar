<!-- <i18n>
{
  "en": {
    "hello": "hello world!"
  },
  "es": {
    "hello": "hola"
  }
}
</i18n> -->

<template>
  <!-- <q-layout view="lHh Lpr lFf"> -->
  <q-layout view="hHh lpR lFr" @scroll="scrollHandler">

    <!-- <q-header elevated class="shadow-1"> -->
     <!-- class="bg-primary text-white shadow-1" -->
      <q-header
        elevated
        content-class="bg-primary"
        :dark="$store.state.app.theme.current === 'slate'"
      >
      <q-toolbar content-class="bg-primary" :dark="$store.state.app.theme.current === 'slate'">
        <q-btn
          flat
          dense
          round
          @click="drawer = !drawer"
          aria-label="Menu"
          icon="menu"
          class="text-grey"
        >
        </q-btn>

        <q-toolbar-title
          :dark="$store.state.app.theme.current === 'slate'"
          class="text-grey"
        >
          Quasar App
        </q-toolbar-title>
        <q-space />

        <!--
          notice shrink property since we are placing it
          as child of QToolbar
        -->
        <q-tabs
          v-model="tab"
          shrink
        >
          <q-tab
            class="text-grey"
            name="theme"
            icon="fas fa-palette"
            @click="$store.commit('app/swapTheme')"
          />
        </q-tabs>
        <!-- <q-select
          v-model="lang"
          :options="langOptions"
          label="Quasar Language"
          dense
          borderless
          emit-value
          map-options
          options-dense
          style="min-width: 150px"
          class="text-white"
        /> -->
        <!-- <p class="text-white">{{ $t('hello') }}</p> -->
        <!-- <div>Quasar v{{ $q.version }}</div> -->
        <!-- <q-btn dense flat round icon="menu"  @click="right = !right" /> -->
      </q-toolbar>
      <q-toolbar inset>
        <q-breadcrumbs active-color="info" class="text-grey">
          <q-breadcrumbs-el
          v-for="(breadcrumb, index) in breadcrumbs"
          :key="index"
          v-bind="breadcrumb"
          />
        </q-breadcrumbs>
      </q-toolbar>
    </q-header>

    <!-- <q-drawer
      v-model="leftDrawerOpen"
      bordered
      content-class="bg-secondary text-grey-4"
    > -->
    <q-drawer
      v-model="drawer"
      side="left"
      bordered
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      show-if-above
      content-class="bg-secondary"
    >
    <!-- overlay -->
      <q-list :dark="$store.state.app.theme.current === 'slate'">
        <!-- <q-item-label header>Essential Links</q-item-label> -->
        <q-item clickable to="/hosts">
          <q-item-section avatar>
            <q-icon name="fas fa-tachometer-alt" class="text-grey"/>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-grey">Hosts</q-item-label>
            <!-- <q-item-label caption>v1.quasar-framework.org</q-item-label> -->
          </q-item-section>
        </q-item>

        <!-- <q-item clickable tag="a" to="/other">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Docs</q-item-label>
            <q-item-label caption>v1.quasar-framework.org</q-item-label>
          </q-item-section>
        </q-item> -->

      </q-list>
    </q-drawer>

    <!-- <q-drawer
      v-model="right"
      side="right"
      overlay
      content-class="bg-secondary text-grey-4"
    >

    </q-drawer> -->

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
// import { openURL, colors } from 'quasar';
// import { openURL } from 'quasar'

// import languages from 'quasar/lang/index.json';

import { debounce } from 'quasar'

// const { lighten, setBrand } = colors;

import * as Debug from 'debug'
const debug = Debug('mngr-ui:layout:App')
// const debug_internals = Debug('mngr-ui:layout:App:Internals')
// const debug_events = Debug('mngr-ui:layout:App:Events')

export default {
  name: 'MyLayout',
  data () {
    return {
      // leftDrawerOpen: this.$q.platform.is.desktop,
      tab: '',
      drawer: true,
      miniState: true,
      // right: true,
      lang: this.$q.lang.isoName
      // dark: true,
    }
  },
  mounted () {
    this.$store.commit('app/setTheme', this.$store.state.app.theme.current)
  },
  computed: {
    breadcrumbs () {
      const pathArray = this.$route.path.split('/')
      // console.log('breadcrumbs', this.$route.path, this.$route.matched);
      // pathArray.shift();
      // const breadcrumbs = pathArray.reduce((breadcrumbArray, path, idx) => {
      //   breadcrumbArray.push({
      //     path,
      //     to: breadcrumbArray[idx - 1]
      //       ? `${breadcrumbArray[idx - 1].path}/${path}`
      //       : `/${path}`,
      //     ...this.$route.matched[idx].meta.breadcrumb
      //   })
      //   return breadcrumbArray
      // }, [])
      const breadcrumbs = []
      Array.each(pathArray, function (path, index) {
        breadcrumbs.push({
          path,
          to: pathArray[index - 1]
            ? `${pathArray[index - 1].path}/${path}`
            : `/${path}`,
          ...this.$route.matched[index].meta.breadcrumb
        })
      }.bind(this))
      // console.log('breadcrumbs', breadcrumbs)
      return breadcrumbs
    }
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
  methods: {
    /**
    * on scroll quasar seems to activate window.blur
    * wich makes @mixins/graph.vue to stop updating charts
    **/
    scrollHandler: debounce(function (info) {
      if (process.env.DEV) debug('scrollHandler', info)
      window.focus()
    }, 50)
    // openURL
    // swap_theme() {
    //   this.$store.commit('app/swapTheme');
    //   // let palette = {};
    //   // if (this.dark) {
    //   //   palette = {// white
    //   //     primary: '#f8f8f8',
    //   //     secondary: '#ffffff', // '#cdcdcd',
    //   //     accent: '#567a9a',
    //   //     positive: '#66aa00',
    //   //     negative: '#dc3912',
    //   //     info: '#3366cc',
    //   //     warning: '#ffad33',
    //   //   };
    //   // } else {
    //   //   palette = {// slate
    //   //     primary: '#3a3f44',
    //   //     secondary: '#272B30',
    //   //     accent: '#17191b',
    //   //     positive: '#6ec86e',
    //   //     negative: '#ee605c',
    //   //     info: '#4bb9db',
    //   //     warning: '#f9a022',
    //   //   };
    //   // }
    //   //
    //   // this.dark = !this.dark;
    //   //
    //   // this.$q.addressbarColor.set(palette.primary);
    //   //
    //   // Object.keys(palette).map((name, index) => {
    //   //   const color = palette[name];
    //   //   // console.log(value);
    //   //   setBrand(name, color);
    //   //   setBrand(`${name}-darkened`, lighten(color, -50));
    //   //   return true;
    //   // });
    //   //
    //   //
    //   // // Object.each(white, (color, name) => {
    //   // //
    //   // // });
    // },
  }
}
</script>

<style>
</style>
