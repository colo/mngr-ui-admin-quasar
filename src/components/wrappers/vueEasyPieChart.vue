<template>

  <div
    v-observe-visibility="visibilityChanged"
    :id="id+'-container'"
    :style="chart.style"
    :class="chart.class"
  >
    <vue-easy-pie-chart
      v-bind="chart.options"
      :percent="percentage"
      :id="id"
    />

  </div>
  <!-- v-bind:class="container_class_helper" -->
</template>

<script>

// import { frameDebounce } from 'quasar'

import VueEasyPieChart from 'vue-easy-pie-chart'
import 'vue-easy-pie-chart/dist/vue-easy-pie-chart.css'

export default {
  name: 'vue-easy-pie-chart-wrapper',

  components: {
    VueEasyPieChart
  },

  // graph: undefined,
  freezed: false,
  visible: true,

  props: {
    EventBus: {
      type: [Object],
      default: () => ({})
    },
    id: {
      type: [String],
      default: () => ('')
    },
    chart: {
      type: [Object],
      default: () => ({})
    },

    stat: {
      type: [Object],
      default: () => ({})
    },

    freezed: {
      type: [Boolean],
      default: () => (false)
    },
    visible: {
      type: [Boolean],
      default: () => (true)
    },
    decimals: {
      type: [Number],
      default: 2
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
  watch: {
    visible: function (val) {
      this.container_class_helper = (val === false) ? 'invisible' : ''
      // console.log('class visible', val, this.container_class_helper)
    }
  },

  created () {
    // this.chart = this
    // window.addEventListener('blur', function() {
    //    this.focus = false
    // }.bind(this), false)
    //
    // window.addEventListener('focus', function() {
    //    this.focus = true
    // }.bind(this), false)

    let __unwatcher = this.$watch('stat.data', function (val, oldVal) {
      if (val.length > 1) {
        // if(this.$options.graph === null){
        //
        //   this.__create_dygraph()
        //
        // }

        this.update()
      }
    })
  },

  destroyed () {
    this.$off()
  },
  mounted () {

    // if(this.$options.graph === null && this.stat.data && this.stat.data.length > 1){
    //
    //   this.__create_dygraph()
    //
    // }
    // this.__watcher()

    // this.create()
  },
  methods: {
    /**
    * UI related
    **/
    visibilityChanged (isVisible, entry) {
      this.$options.visible = isVisible
      // if(isVisible === true && !this.$options.graph)
      //   this.__create_dygraph()
    },
    destroy: function () {

    },
    create () {
      this.destroy()
    },
    // update () {
    //   // console.log('qknob update')
    //   // this.model = this.stat.data.getLast()[1]
    //   this.percentage = this.stat.data.getLast()[1]
    // },
    update (data) {
      data = data || this.stat.data
      // console.log('vue-easy-pie-chart update', data)
      let value = data.getLast()[1]
      if (this.$options.visible === true && value !== null) {
        // https://stackoverflow.com/questions/17218938/requestanimationframe-and-knowing-when-the-browser-is-re-painting
        // if(this.focus === true){
        //   //console.log('focus, frameDebounce...')
        //   frameDebounce(
        this.percentage = value.toFixed(this.decimals) * 1
        //   )
        // }
        // else{
        //
        //   this.percentage = value.toFixed(this.decimals) * 1
        //
        // }
      }
    }
  }
}
</script>
