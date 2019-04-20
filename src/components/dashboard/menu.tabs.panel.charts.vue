<template>
  <q-list :dark="$store.state.app.theme.current === 'slate'" class="bg-secondary q-pa-none q-ma-none">
    <template v-for="(option, name) in options.menu">
      <q-expansion-item
        :key="name"
        group="menu"
        :icon="option.icon"
        :label="option.label || name"
        default-opened
        :header-inset-level="0"
        :content-inset-level="0.1"
        class="bg-secondary"
      >
        <!-- expand-separator -->
        <!-- caption="5 unread emails" -->

        <slot name="menu-item" v-bind:option="option" v-bind:row="name">
        </slot>

        <slot v-bind:option="option" v-bind:row="name">
          <q-list :dark="$store.state.app.theme.current === 'slate'" class="bg-secondary q-pa-none q-ma-none">
            <template v-for="(sub_option, sub_name) in option.menu">
              <q-item
                :dark="$store.state.app.theme.current === 'slate'" class="bg-secondary"
                :key="sub_name"
                clickable
                v-ripple
                dense
                :to="{name: sub_option.route.name, params: sub_option.route.params, hash: sub_option.route.hash}"
              >
                <q-item-section v-if="sub_option.icon" avatar>
                <q-icon :name="sub_option.icon" />
                </q-item-section>

                <q-item-section>{{ sub_option.label || sub_name }}</q-item-section>

              </q-item>
               <!-- :active="active" -->
           </template>
          </q-list>
          <!-- <q-card class="bg-secondary">
            <q-card-section>
              Today
            </q-card-section>
          </q-card> -->
        </slot>
      </q-expansion-item>

    </template>

    <!-- <q-expansion-item
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

      <q-card class="bg-secondary">
        <q-card-section>
          Today
        </q-card-section>
      </q-card>

    </q-expansion-item> -->

    <!-- <q-expansion-item
      dense-toggle
      dense
      group="somegroup"
      icon="mail"
      label="Inbox"
      :header-inset-level="0"
      :content-inset-level="0.1"
    >

      <q-card class="bg-secondary">
        <q-card-section>
          Today
        </q-card-section>
      </q-card>

    </q-expansion-item> -->

  </q-list>

</template>

<script>
import * as Debug from 'debug'
const debug = Debug('mngr-ui:components:dashboard:menu:tabs:panel:charts')

// import AnchorRouterLink from 'vue-anchor-router-link'

export default {
  name: 'dashboard-menu-tabs-panel-charts',

  // components: {
  //   AnchorRouterLink
  // },

  // props: {
  //   menu: {
  //     type: [Object],
  //     default: () => ({
  //       menu: { label: 'test menu', icon: 'mail' }
  //     })
  //   }
  // }

  props: {
    options: {
      type: [Object],
      default: () => ({
        menu: {
          test: { label: 'test menu', icon: 'mail' }
        }
      })
    }
  }
}
</script>
