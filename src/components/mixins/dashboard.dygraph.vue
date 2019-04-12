<template>
  <div></div>
</template>

<script>
// import the module here instead of in `src/store/index.js`

import * as Debug from 'debug'
const debug = Debug('mngr-ui:components:mixins:dashboard.dygraph')
// const debug_internals = Debug('mngr-ui:components:mixins:dashboard.dygraph:Internals')
// const debug_events = Debug('mngr-ui:components:mixins:dashboard.dygraph:Events')

import dashboardMixin from '@mixins/dashboard'

import { EventBus } from 'boot/eventbus'

/* global synchronize */
/* eslint no-undef: "error" */
import '@libs/synchronizer' // modified version
import Dygraph from 'dygraphs'

export default {
  mixins: [dashboardMixin],

  __sync: undefined,
  highlighted: false,

  methods: {

    sync_charts: function () {
      if (this.$options.__sync === null) {
        let gs = []
        // let sync = []

        /// ///////////////////////////////console.log(this.$refs, this.host)
        Object.each(this.$refs, function (ref, name) {
          if (this.visibility[name] === true) {
            Array.each(ref, function (_ref) {
              if (_ref.$children && _ref.$options.visible === true) {
                Array.each(_ref.$children, function (child) {
                  if (child.$options.graph instanceof Dygraph) {
                  // console.log('sync charts', name, ref)
                    gs.push(child.$options.graph)
                  }
                })
              }
            })
          }
        }.bind(this))

        this.unsync_charts()

        // console.log('GS', gs)

        if (gs.length > 1) {
          this.$options.__sync = synchronize(gs, {
            zoom: true,
            // selection: true,
            range: false
          })
        }
      }
    },
    unsync_charts: function () {
      if (this.$options.__sync) {
        // ////////console.log('detaching', this.$options.sync)
        this.$options.__sync.detach()
        this.$options.__sync = undefined
      }
    }

  },

  created: function () {
    let self = this
    this.$eventbus.$on('highlightCallback', function (params) {
      self.$options.highlighted = true
      self.sync_charts()
    })

    this.$eventbus.$on('unhighlightCallback', event => {
      self.$options.highlighted = false
      self.unsync_charts()
    })
  },
  beforeDestroy: function () {
    this.$eventbus.$off('highlightCallback')
    this.$eventbus.$on('unhighlightCallback')
  }

}
</script>
