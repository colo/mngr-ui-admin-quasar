<template>
  <div class="form-group">
    <label>Date range button:</label>

    <div class="input-group">
      <button type="button" class="btn btn-default pull-right" :id="id" @click="$emit('click')">
        <span>
          <i class="fa fa-calendar"></i> Date range picker
        </span>
        <i class="fa fa-caret-down"></i>
      </button>
    </div>
  </div>
</template>

<script>
import 'bootstrap-daterangepicker/daterangepicker.css'
import moment from 'moment/min/moment-with-locales'
import 'bootstrap-daterangepicker/daterangepicker.js'


import * as Debug from "debug"

const debug = Debug("mngr-ui:components:wrappers:bootstrap.daterangepicker"),
      debug_internals = Debug("mngr-ui:components:wrappers:bootstrap.daterangepicker:Internals"),
      debug_events = Debug("mngr-ui:components:wrappers:bootstrap.daterangepicker:Events");


export default {
  name: 'bootstrap-daterangepicker-wrapper',

  interval: undefined,

  props: {
    options: {
      type: [Object],
      default: () => {
        return {
          opens: 'center',
          timePicker: true,
          timePicker24Hour: true,
          timePickerSeconds: true,
          alwaysShowCalendars: true,
          startDate: moment().subtract(29, 'days'),
          endDate  : moment(),
          ranges: {
            // 'Last 5 mins'       : [moment().subtract(5, 'minute'), moment()],
            'Today'       : [moment(), moment()],
            'Yesterday'   : [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days' : [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month'  : [moment().startOf('month'), moment().endOf('month')],
            'Last Month'  : [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
          }
        }
      }
    },
    id:{
      type: [String],
      default: 'daterange-btn'
    },

  },

  // data () {
  //   return {
  //
  //   }
  // },
  // computed: {
  //   now: function(){
  //     return moment(new Date())
  //   }
  // },
  // beforeDestroy () {
  //   clearInterval(this.$options.interval);
  // },
  created: function(){
    // this.$options.interval = setInterval(() => {this.now = moment(new Date())}, 1000);
    //
    // Object.each(this.options.ranges, function(range, key){
    //   Array.each(range, function(start_or_end, index){
    //     if(start_or_end == null){
    //       // start_or_end = this.now
    //       this.options.ranges[key][index] = this.now
    //     }
    //
    //   }.bind(this))
    // }.bind(this))
  },
  watch: {
    'options':{
      handler: function(val, old) { this._update_daterangepicker(val, old) },
      deep: true
    }
  },
  mounted: function(){
    this._daterangepicker()
  },
  methods: {
    setStartDate: function(date){
      $('#'+this.id).data('daterangepicker').setStartDate(date)
    },
    setEndDate: function(date){
      $('#'+this.id).data('daterangepicker').setEndDate(date)
    },
    _update_daterangepicker: function(val, old){
      debug_internals('_update_daterangepicker', val, old)
      // if(old)
      //   Object.each(old, function(option, key){
      //     delete $('#'+this.id).data('daterangepicker')[key]
      //   }.bind(this))
      //
      // Object.each(val, function(option, key){
      //   $('#'+this.id).data('daterangepicker')[key] = option
      // }.bind(this))
      $('#'+this.id).daterangepicker('destroy')
      this._daterangepicker()
    },
    _daterangepicker: function(){

      let self = this
      // console.log('_daterangepicker', self.ranges)
      $('#'+this.id).daterangepicker(
        self.options,
        function (start, end) {
          $('#daterange-btn span').html(start.format('MMMM Do YYYY, HH:mm:ss') + ' - ' + end.format('MMMM Do YYYY, HH:mm:ss'))
          self.$emit('range', start, end)
          // $('#'+self.id+' span').html(start.format('llll') + ' - ' + end.format('llll'))
        }
      )

      $('#'+this.id).on('hide.daterangepicker', function(){
        self.$emit('hide')
      })

      debug_internals('_daterangepicker', this.id, this.options)
    },
  }

}
</script>
