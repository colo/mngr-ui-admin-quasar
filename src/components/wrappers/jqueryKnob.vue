<template>

  <div
    v-observe-visibility="visibilityChanged"
    :id="id+'-container'"
    :style="chart.style"
    :class="chart.class"
  >
    <input
      v-bind="$options.knob"
      :id="id"
      type="text"

    />
    <!-- :value="percentage" -->

  </div>
  <!-- v-bind:class="container_class_helper" -->
</template>

<script>

// import { frameDebounce } from 'quasar'

import jqueryKnob from 'jquery-knob'
// import 'vue-easy-pie-chart/dist/vue-easy-pie-chart.css'

export default {
  name: 'jquery-knob-wrapper',

  components: {
    jqueryKnob
  },

  // graph: undefined,
  freezed: false,
  visible: true,

  knob: {},

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
    },
    animation: {
      type: [Boolean],
      default: false
    }
  },
  data () {
    return {
      // percentage: 0,
      // container_class_helper: '',
      // chart: null,
      // highlighted: false,
      // ready: false,
      // to_suspend: false,
    }
  },
  watch: {
    visible: function (val) {
      // this.container_class_helper = (val == false) ? 'invisible' : ''
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
        // if(this.$options.graph == null){
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
  updated () {
    // this._jquery_knob()
  },
  mounted () {
    this._jquery_knob()
    // if(this.$options.graph == null && this.stat.data && this.stat.data.length > 1){
    //
    //   this.__create_dygraph()
    //
    // }
    // this.__watcher()

    // this.create()
  },
  methods: {

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
      if (this.$options.visible == true && value != null) {
        // https://stackoverflow.com/questions/17218938/requestanimationframe-and-knowing-when-the-browser-is-re-painting
        // if(this.focus === true){
        //   //console.log('focus, frameDebounce...')
        //   frameDebounce(function(){
        //     this.percentage = value.toFixed(this.decimals) * 1
        //
        //     $('#'+this.id).val(this.percentage).trigger('change')
        //   }.bind(this))
        // }
        // else{
        let el = $('#' + this.id)
        let percentage = value.toFixed(this.decimals) * 1
        if (this.animation == true) {
          let self = this
          // let percentage = this.percentage = value.toFixed(this.decimals) * 1;

          let prev = el.val()
          el.knob({
            value: prev
          }).animate({
            value: percentage
          }, {
            duration: 100,
            easing: 'swing',
            step: function () {
              // console.log('steping')
              self._jquery_knob_pre_update(el, percentage)
              el.val(Math.ceil(percentage)).trigger('change')
            }
          })
        } else {
          // this.percentage = value.toFixed(this.decimals) * 1;

          this._jquery_knob_pre_update(el, percentage)
          el.val(percentage).trigger('change')
        }
        // }
      }
    },

    /**
    * UI related
    **/
    visibilityChanged (isVisible, entry) {
      this.$options.visible = isVisible
      // if(isVisible == true && !this.$options.graph)
      //   this.__create_dygraph()
    },
    _jquery_knob_pre_update (el, percentage) {
      let new_opts = {}

      if (typeof this.chart.options.fgColor === 'function') {
        new_opts.fgColor = this.chart.options.fgColor(percentage)
      }
      if (typeof this.chart.options.bgColor === 'function') {
        new_opts.bgColor = this.chart.options.bgColor(percentage)
      }
      if (typeof this.chart.options.inputColor === 'function') {
        new_opts.inputColor = this.chart.options.inputColor(percentage)
      }

      el.trigger('configure', Object.merge(Object.clone(this.$options.knob), new_opts))
    },
    _jquery_knob: function () {
      console.log('_jquery_knob', this.id)

      this.$options.knob = Object.clone(this.chart.options)

      if (typeof this.$options.knob.fgColor === 'function') {
        delete this.$options.knob.fgColor
      }

      if (typeof this.$options.knob.bgColor === 'function') {
        delete this.$options.knob.bgColor
      }
      if (typeof this.$options.knob.inputColor === 'function') {
        delete this.$options.knob.inputColor
      }

      // $("#"+this.id).knob(this.$options.knob);
      let self = this
      $('#' + this.id).knob(Object.merge(Object.clone(self.$options.knob), {
        draw: function () {
          // "tron" case
          if (self.$options.knob.skin && self.$options.knob.skin == 'tron') {
            var a = this.angle(this.cv), // Angle
              sa = this.startAngle, // Previous start angle
              sat = this.startAngle, // Start angle
              ea, // Previous end angle
              eat = sat + a, // End angle
              r = true

            this.g.lineWidth = this.lineWidth

            this.o.cursor &&
            (sat = eat - 0.3) &&
            (eat = eat + 0.3)

            if (this.o.displayPrevious) {
              ea = this.startAngle + this.angle(this.value)
              this.o.cursor &&
              (sa = ea - 0.3) &&
              (ea = ea + 0.3)
              this.g.beginPath()
              this.g.strokeStyle = this.previousColor
              this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sa, ea, false)
              this.g.stroke()
            }

            this.g.beginPath()
            this.g.strokeStyle = r ? this.o.fgColor : this.fgColor
            this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sat, eat, false)
            this.g.stroke()

            this.g.lineWidth = 2
            this.g.beginPath()
            this.g.strokeStyle = this.o.fgColor
            this.g.arc(this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false)
            this.g.stroke()

            return false
          }
        }
      }))
    }
  }
}
</script>
