<template>
  <q-list :dark="$store.state.app.theme.current === 'slate'" class="bg-secondary q-pa-none q-ma-none">
    <q-expansion-item
      dense-toggle
      dense
      group="somegroup"
      icon="mail"
      label="Inbox"
      default-opened
      :header-inset-level="0"
      :content-inset-level="0.1"
      class="bg-secondary"
    >
      <!-- expand-separator -->
      <!-- caption="5 unread emails" -->

      <q-card class="bg-secondary">
        <q-card-section>
          Today
        </q-card-section>
      </q-card>

    </q-expansion-item>

    <q-expansion-item
      dense-toggle
      dense
      group="somegroup"
      icon="mail"
      label="Inbox"
      :header-inset-level="0"
      :content-inset-level="0.1"
    >
      <!-- expand-separator -->
      <!-- caption="5 unread emails" -->

      <q-card class="bg-secondary">
        <q-card-section>
          Today
        </q-card-section>
      </q-card>

    </q-expansion-item>

  </q-list>

</template>

<script>
import * as Debug from 'debug'
const debug = Debug('mngr-ui:components:dashboard:menu:tabs:panel:charts')

export default {
  name: 'dashboard-menu-tabs-panel-charts'

}
</script>
