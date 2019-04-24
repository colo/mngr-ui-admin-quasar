<template>
  <div
    :id="id+'-container'"
    class="netdata-container-easypiechart"
    v-bind:class="container_class_helper"
    :style="chart.style"
  >
  <!-- v-observe-visibility="visibilityChanged" -->
     <div
       :ref="id"
       :id="id"
       class="easyPieChart"
     >
     <!-- :class="chart.class" -->

    </div>
    <!-- <div
    class="netdata-chart-legend"
    :id="id+'-netdata-chart-legend'"
    >
    </div> -->
  </div>
</template>

<script>

// import { frameDebounce } from 'quasar'
import * as Debug from 'debug'

const debug = Debug('mngr-ui:components:wrappers:easyPieChart')

import chartMixin from '@mixins/chart.vue'
import EasyPieChart from 'easy-pie-chart'
// import 'vue-easy-pie-chart/dist/vue-easy-pie-chart.css'
export default {
  mixins: [chartMixin],

  name: 'dygraph-wrapper',

  chart_options: {},
  __unwatch_options: undefined,

  // created () {
  //   let self = this
  //   if (self.EventBus && typeof (self.EventBus.$on) === 'function') {
  //     self.EventBus.$on('highlightCallback', params => {
  //       self.highlighted = true
  //     })
  //     self.EventBus.$on('unhighlightCallback', event => {
  //       self.highlighted = false
  //     })
  //   }
  // },

  methods: {

    /**
    * UI related
    **/
    // reset: function(){
    //   this.destroy()
    //   this.create()
    // },
    destroy: function () {
      /// /////console.log('dygraph destroy', this.id)

      this.__chart_destroy()

      if (this.$options.__unwatcher) {
        this.$options.__unwatcher()
        this.$options.__unwatcher = undefined
      }

      if (this.$options.__unwatch_options) {
        this.$options.__unwatch_options()
        this.$options.__unwatch_options = undefined
      }
    },
    __chart_destroy () {
      // if (this.$options.graph && typeof this.$options.graph.destroy === 'function') {
      //   // //////////console.log('destroying ...', this.id)
      //   this.$options.graph.destroy()
      // }

      this.$options.graph = undefined
      this.ready = false
    },
    create () {
      // console.log('create dygraph', this.id, this.chart)

      if (this.chart && this.chart.options) {
        // this.create()
        this.__chart_create()
      } else {
        let unwatch = this.$watch('chart', function (val) {
          if (val && Object.getLength(val) > 0 && val.options) {
            this.__chart_destroy()
            this.__chart_create()
            // this.create()
            unwatch()
          }
        })
      }
    },
    __chart_create () {
      this.$options.chart_options = Object.clone(this.chart.options)
      this.$options.__unwatch_options = this.$watch('chart.options', function (val) {
        this.$options.chart_options = Object.clone(val)
      }, { deep: true })

      debug('__chart_create', this.id, this.$options.chart_options, this.smoothness)

      if (this.$options.chart_options.labels && document.getElementById(this.id)) {
        if (this.$options.chart_options.labelsDiv) { this.$options.chart_options.labelsDiv = this.id + '-' + this.$options.chart_options.labelsDiv }

        let data = []
        if (this.chart_data[0] && this.chart_data[0].length === 0) {
          let row = []
          Array.each(this.$options.chart_options.labels, function (label) {
            row.push(0)
          })
          data.push(row)
        } else {
          data = this.get_data()
          // data.sort(function(a,b) {return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);} )
          // data = []
        }

        this.$options.graph = new EasyPieChart(
          document.getElementById(this.id), // containing div
          this.options
          // this.$options.chart_options
        )

        if (this.chart.init) { this.chart.init(this, this.$options.graph, 'easyPieChart') }

        // this.update()
      }
    },
    get_data: function (data) {
      data = data || Array.clone(this.chart_data)

      data.sort(function (a, b) { return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0) })

      Array.each(data, function (row) {
        if (row) { row[0] = new Date(row[0]) }
        // data.push(row)
      })

      return data
    },
    update (data) {
      // debug('update', this.id, this.ready)

      data = this.get_data(data)
      // let options = (this.ready === true && this.$options.graph.numRows() > 1) ? { 'dateWindow': this.$options.graph.xAxisExtremes() } : {}
      // if(this.$options.visible === true && this.ready === true){
      if (this.ready === true && data && data[0]) {
        // //console.log('updateOptions', this.id, data)

        // this.updateOptions(
        //   data,
        //   Object.merge(this.$options.chart_options, { 'dateWindow': this.$options.graph.xAxisExtremes() }),
        //   false
        // )

        let end = data[data.length - 1][0]
        let start
        if (!this.chart_data_length) {
          start = data[0][0]
        } else {
          start = end - (this.chart_data_length * 1000)
        }

        debug('update start - end', this.chart_data_length, start, end)

        this.updateOptions(
          data,
          Object.merge(this.$options.chart_options, { 'dateWindow': [start, end] }),
          false
        )
      }
    },
    updateOptions (data, options, block_redraw) {
      // debug('updateOptions', this.id, this.ready)
      // let self = this

      if (
        this.highlighted === false &&
        this.ready === true

      ) {
        this.$options.graph.updateOptions(
          Object.merge(
            {
              'file': data
            },
            options
          ),
          block_redraw
        )

        let selection = (this.chart.skip && this.chart.skip > 0) ? this.chart.skip : 1

        debug('updateOptions selection', data.length, selection)

        this.$options.graph.setSelection(this.$options.graph.numRows() - selection, {}, false)
      }
    }
  }
}
</script>
