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
  <q-layout view="hHh lpR lFr">

    <!-- <q-header elevated class="shadow-1"> -->
     <!-- class="bg-primary text-white shadow-1" -->
      <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="drawer = !drawer"
          aria-label="Menu"
          icon="menu"
        >
        </q-btn>

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>
        <q-space />

        <!--
          notice shrink property since we are placing it
          as child of QToolbar
        -->
        <q-tabs v-model="tab" shrink>
          <q-tab name="theme" icon="home" @click="change_theme"/>
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
        <q-breadcrumbs active-color="white">
          <q-breadcrumbs-el
          v-for="(breadcrumb, index) in breadcrumbs"
          :key="index"
          v-bind="breadcrumb"
          />
          <!-- {{ index }} -->
          <!-- :class="{'linked': !!breadcrumb.link}" -->
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
      content-class="bg-secondary text-grey-4"
    >
    <!-- overlay -->
      <q-list :dark="dark">
        <!-- <q-item-label header>Essential Links</q-item-label> -->
        <q-item clickable tag="a" to="/dashboard">
          <q-item-section avatar>
            <q-icon name="fas fa-graduation-cap" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Docs</q-item-label>
            <q-item-label caption>v1.quasar-framework.org</q-item-label>
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
import { openURL, colors } from 'quasar';

// import languages from 'quasar/lang/index.json';

// import { colors } from 'quasar';

const { lighten, setBrand } = colors;

export default {
  name: 'MyLayout',
  data() {
    return {
      // leftDrawerOpen: this.$q.platform.is.desktop,
      tab: '',
      drawer: true,
      miniState: true,
      // right: true,
      lang: this.$q.lang.isoName,
      dark: true,
    };
  },
  computed: {
    breadcrumbs() {
      const pathArray = this.$route.path.split('/');
      // console.log('breadcrumbs', this.$route.path, this.$route.matched);
      // pathArray.shift();
      const breadcrumbs = pathArray.reduce((breadcrumbArray, path, idx) => {
        breadcrumbArray.push({
          path,
          to: breadcrumbArray[idx - 1]
            ? `${breadcrumbArray[idx - 1].path}/${path}`
            : `/${path}`,
          ...this.$route.matched[idx].meta.breadcrumb,
        });
        return breadcrumbArray;
      }, []);
      // console.log('breadcrumbs', breadcrumbs);
      return breadcrumbs;
    },
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
    openURL,
    change_theme() {
      const white = {
        primary: '#f8f8f8',
        secondary: '#cdcdcd',
        accent: '#567a9a',
        positive: '#66aa00',
        negative: '#dc3912',
        info: '#3366cc',
        warning: '#ffad33',
      };

      this.dark = false;
      this.$q.addressbarColor.set(white.primary);

      Object.keys(white).map((name, index) => {
        const color = white[name];
        // console.log(value);
        setBrand(name, color);
        setBrand(`${name}-darkened`, lighten(color, -50));
        return true;
      });


      // Object.each(white, (color, name) => {
      //
      // });
    },
  },
};
</script>

<style>
</style>
