<i18n>
{
  "en": {
    "hello": "hello world!"
  },
  "es": {
    "hello": "hola"
  }
}
</i18n>

<template>
  <!-- <q-layout view="lHh Lpr lFf"> -->
  <q-layout view="hHh lpR lFr">

    <!-- <q-header elevated class="shadow-1"> -->
      <q-header elevated class="bg-primary text-white shadow-1">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>
        <q-select
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
        />
        <p class="text-white">{{ $t('hello') }}</p>
        <!-- <div>Quasar v{{ $q.version }}</div> -->
        <q-btn dense flat round icon="menu" @click="right = !right" />
      </q-toolbar>
    </q-header>

    <!-- <q-drawer
      v-model="leftDrawerOpen"
      bordered
      content-class="bg-secondary text-grey-4"
    > -->
    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      overlay
      bordered
      content-class="bg-secondary text-grey-4"
    >
      <q-list>
        <q-item-label header>Essential Links</q-item-label>
        <q-item clickable tag="a" target="_blank" href="http://v1.quasar-framework.org">
          <q-item-section avatar>
            <q-icon name="fas fa-graduation-cap" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Docs</q-item-label>
            <q-item-label caption>v1.quasar-framework.org</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://github.com/quasarframework/">
          <q-item-section avatar>
            <q-icon name="code" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Github</q-item-label>
            <q-item-label caption>github.com/quasarframework</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="http://chat.quasar-framework.org">
          <q-item-section avatar>
            <q-icon name="chat" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Discord Chat Channel</q-item-label>
            <q-item-label caption>chat.quasar-framework.org</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://forum.quasar-framework.org">
          <q-item-section avatar>
            <q-icon name="record_voice_over" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Forum</q-item-label>
            <q-item-label caption>forum.quasar-framework.org</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://twitter.com/quasarframework">
          <q-item-section avatar>
            <q-icon name="rss_feed" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Twitter</q-item-label>
            <q-item-label caption>@quasarframework</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-drawer v-model="right" side="right" overlay behavior="desktop">
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar';

import languages from 'quasar/lang/index.json';


export default {
  name: 'MyLayout',
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      right: true,
      lang: this.$q.lang.isoName,
    };
  },
  watch: {
    lang(lang) {
      // dynamic import, so loading on demand only
      import(`quasar/lang/${lang}`).then((l) => {
        this.$q.lang.set(l.default);
        this.$i18n.locale = l.default.isoName;
        // console.log(l.default);
      });
    },
  },
  created() {
    this.langOptions = languages.map(lang => ({
      label: lang.nativeName, value: lang.isoName,
    }));
  },
  methods: {
    openURL,
  },
};
</script>

<style>
</style>
