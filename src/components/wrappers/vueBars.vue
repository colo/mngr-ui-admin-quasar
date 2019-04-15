<template>
  <!-- <div
  :style="chart.style"
  :class="chart.class"
  > -->
  <div
    :id="id+'-container'"
    :class="chart.class"
    :style="chart.style"
  >
    <!-- linear-gauge | radial-gauge -->
    <bars
      :data="values"
      autoDraw
      smooth
      v-bind="chart.options"
    >
    </bars>

  </div>
</template>

<script>

import chartMixin from '@mixins/chart.vue'

import Bars from 'vuebars'

export default {
  mixins: [chartMixin],

  name: 'vue-bars-wrapper',

  components: {
    Bars
  },

  data () {
    return {
      values: []
    }
  },
  // watch: {
  //   visible: function (val) {
  //     this.container_class_helper = (val == false) ? 'invisible' : ''
  //     // console.log('class visible', val, this.container_class_helper)
  //   }
  // },

  // created () {
  //   this.chart = this
  // },
  methods: {
    create () {
      this.update()
    },
    update (data) {
      data = this.get_data(data)
      console.log('vueBars update', data)

      this.$set(this, 'values', data)

      // Array.each(data, function(d){
      //   this.values.push(data[1])
      // }.bind(this))
    }

  }
}
</script>
