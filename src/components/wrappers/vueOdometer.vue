<template>
  <!-- <div
  :style="chart.style"
  :class="chart.class"
  > -->

    <IOdometer
      :value="value"
      :id="id"
      v-bind="options"
    >
    </IOdometer>

  <!-- </div> -->
</template>

<script type="text/babel">
import * as Debug from 'debug'

const debug = Debug('mngr-ui:components:wrappers:vueOdometer')

import chartMixin from '@mixins/chart.vue'

import IOdometer from 'vue-odometer'
import 'odometer/themes/odometer-theme-default.css'
import 'odometer/themes/odometer-theme-car.css'

export default {
  name: 'vue-odometer-wrapper',
  mixins: [chartMixin],

  components: {
    IOdometer
  },

  freezed: false,

  props: {
    options: {
      type: [Object],
      default: () => ({})
    }
  },
  data () {
    return {
      value: 0
    }
  },
  methods: {

    update (data) {
      debug('update', data)
      data = this.get_data(data)
      // console.log('vue-easy-pie-chart update', data)
      let value = data.getLast()[1]
      // if (this.$options.visible === true && value !== null) {
      debug('update', value)
      // if (value !== null) {
      //   this.percentage = value.toFixed(this.decimals) * 1
      this.value = value
      // }
    }

  }
}
</script>
