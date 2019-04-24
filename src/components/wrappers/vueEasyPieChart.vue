<template>

  <!-- <div
    :id="id+'-container'"
    :style="chart.style"
    class="netdata-container-easypiechart"
  > -->
  <!-- v-observe-visibility="visibilityChanged" -->

    <vue-easy-pie-chart
      :percent="percentage"
      :id="id"
      v-bind="options"
    />
    <!-- v-bind="chart.options" -->

  <!-- </div> -->
  <!-- v-bind:class="container_class_helper" -->
</template>

<script>

// import { frameDebounce } from 'quasar'
import * as Debug from 'debug'

const debug = Debug('mngr-ui:components:wrappers:vueEasyPieChart')

import chartMixin from '@mixins/chart.vue'
import VueEasyPieChart from 'vue-easy-pie-chart'
import 'vue-easy-pie-chart/dist/vue-easy-pie-chart.css'

export default {
  name: 'vue-easy-pie-chart-wrapper',

  mixins: [chartMixin],

  components: {
    VueEasyPieChart
  },

  props: {
  //   EventBus: {
  //     type: [Object],
  //     default: () => ({})
  //   },
  //   id: {
  //     type: [String],
  //     default: () => ('')
  //   },
  //   chart: {
  //     type: [Object],
  //     default: () => ({})
  //   },
  //
  //   stat: {
  //     type: [Object],
  //     default: () => ({})
  //   },
  //
  //   freezed: {
  //     type: [Boolean],
  //     default: () => (false)
  //   },
  //   visible: {
  //     type: [Boolean],
  //     default: () => (true)
  //   },
    decimals: {
      type: [Number],
      default: 2
    },
    options: {
      type: [Object],
      default: () => ({})
    }
  },

  data () {
    return {
      percentage: 0
      // container_class_helper: '',
      // chart: null,
      // highlighted: false,
      // ready: false,
      // to_suspend: false,
    }
  },
  // watch: {
  //   visible: function (val) {
  //     this.container_class_helper = (val === false) ? 'invisible' : ''
  //     // console.log('class visible', val, this.container_class_helper)
  //   }
  // },

  // created () {
  //   debug('created', this.id)
  //   // this.chart = this
  //   // window.addEventListener('blur', function() {
  //   //    this.focus = false
  //   // }.bind(this), false)
  //   //
  //   // window.addEventListener('focus', function() {
  //   //    this.focus = true
  //   // }.bind(this), false)
  //
  //   let __unwatcher = this.$watch('stat.data', function (val, oldVal) {
  //     if (val.length > 1) {
  //       // if(this.$options.graph === null){
  //       //
  //       //   this.__create_dygraph()
  //       //
  //       // }
  //
  //       this.update()
  //     }
  //   })
  // },

  destroyed () {
    this.$off()
  },
  // mounted () {
  //
  //   // if(this.$options.graph === null && this.stat.data && this.stat.data.length > 1){
  //   //
  //   //   this.__create_dygraph()
  //   //
  //   // }
  //   // this.__watcher()
  //
  //   // this.create()
  // },
  methods: {
    /**
    * UI related
    **/
    // visibilityChanged (isVisible, entry) {
    //   this.$options.visible = isVisible
    //   // if(isVisible === true && !this.$options.graph)
    //   //   this.__create_dygraph()
    // },
    // destroy: function () {
    //
    // },
    // create () {
    //   this.destroy()
    // },
    // update () {
    //   // console.log('qknob update')
    //   // this.model = this.stat.data.getLast()[1]
    //   this.percentage = this.stat.data.getLast()[1]
    // },
    update (data) {
      data = this.get_data(data)
      // console.log('vue-easy-pie-chart update', data)
      let value = data.getLast()[1]
      // if (this.$options.visible === true && value !== null) {
      debug('update', value)
      if (value !== null) {
        this.percentage = value.toFixed(this.decimals) * 1
      }
    }
  }
}
</script>

<style scoped>

/* #vue-easy-pie-chart {
  all: initial;
  * {
    all: unset;
  }
} */
</style>
