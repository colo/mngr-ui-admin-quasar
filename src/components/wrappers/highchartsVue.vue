<template>

    <div v-if="chart.class"
      :id="id+'-container'"
      :style="chart.style"
      v-bind:class="container_class_helper"
    >
    <!-- v-observe-visibility="visibilityChanged" -->
    <!--class="netdata-container-with-legend"   -->
    <highcharts
      :ref="id"
      :id="id"
      :class="chart.class"
      :options="chart.options"
    >
    </highcharts>

    <!-- <div
    class="netdata-chart-legend"
    :id="id+'-netdata-chart-legend'"
    >
    </div> -->
    </div>

    <div v-else
      :id="id+'-container'"
    >
    <!-- v-observe-visibility="visibilityChanged" -->
      <highcharts
        :ref="id"
        :id="id"
        :options="chart.options"
      >
      </highcharts>
    </div>

</template>

<script>

/**
* highcharts sync
* https://www.highcharts.com/blog/snippets/synchronisation-of-multiple-charts/
**/
// import { frameDebounce } from 'quasar'

export default {
  name: 'highcharts-vue-wrapper',

  // components: {
  //   highcharts
  // },

  // chart: null,
  freezed: false,

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
    gauge: {
      type: [Boolean],
      default: () => (false)
    },
    decimals: {
      type: [Number],
      default: 2
    }
    // animation: {
    //   type: [Boolean],
    //   default: false
    // }
  },
  data () {
    return {
      // values: [],
      // labels: [],
      container_class_helper: ''
      // chart: null,
      // highlighted: false,
      // ready: false,
      // to_suspend: false,
    }
  },
  watch: {
    // visible: function (val) {
    //   this.container_class_helper = (val === false) ? 'invisible' : ''
    //   // console.log('class visible', val, this.container_class_helper)
    // }
  },

  created () {
    // window.addEventListener('blur', function() {
    //    this.focus = false
    // }.bind(this), false)
    //
    // window.addEventListener('focus', function() {
    //    this.focus = true
    // }.bind(this), false)

    // let __unwatcher = this.$watch('stat.data', function (val, oldVal) {
    //
    //   if(val.length > 1){
    //
    //     // if(this.$options.graph === null){
    //     //
    //     //   this.__create_dygraph()
    //     //
    //     // }
    //
    //     this.update()
    //   }
    //
    // })
  },
  // mounted () {
  //
  //   if(this.chart === null){
  //
  //     this._create_frappe()
  //
  //   }
  //
  // },

  destroyed () {
    this.$off()
  },
  methods: {
    update (data) {
      data = data || this.stat.data
      // console.log('highcharts-vue update', data)
      // if(this.$options.visible === true){

      if (this.gauge === true && data.length > 0) {
        let value = data.getLast()
        if (value && Array.isArray(value) && value[1]) { this.$set(this.chart.options.series[0].data, 0, value[1].toFixed(this.decimals) * 1) }
        // frameDebounce(
        // { this.$set(this.chart.options.series[0].data, 0, value[1].toFixed(this.decimals) * 1) }
        // this.chart.options.series[0].data.push(value.toFixed(this.decimals) * 1)
        // this.chart.options.series[0].data.shift()
        // )
      } else {
        Array.each(data, function (column, index) {
          // if(column.length === 1){//gauge type
          //   this.$set(this.options.options.series[0].data, 0, column[0])
          //   // this.options.options.series[0].data.push(column[0])
          //   // this.options.options.series[0].data.shift()
          // }
          // else{
          Array.each(column, function (value, value_index) {
            if (value_index !== 0) {
              // if(!this.$refs[this.id].options.series[value_index -1]){
              //   this.$refs[this.id].options.series[value_index -1] = {
              //     name: this.id,
              //     data: []
              //   }
              // }
              // else
              if (index === 0) {
                // let serie = this.options.options.series[value_index -1]
                // serie.data = []
                this.$set(this.chart.options.series[value_index - 1], 'data', [])
              }

              this.chart.options.series[value_index - 1].data.push([
                new Date(column[0]).getTime(), // timestamp
                value
              ])
            }
          }.bind(this))
          // }
        }.bind(this))
      }

      // }
    }

    /**
    * UI related
    **/
    // visibilityChanged (isVisible, entry) {
    //   this.$options.visible = isVisible
    //   // if(isVisible === true && !this.$options.graph)
    //   //   this.__create_dygraph()
    // },
  }
}
</script>

<style scoped>
/**
* https://stackoverflow.com/questions/15901030/reset-remove-css-styles-for-element-only/31317986
**/

.reset-this {
    animation : none;
    animation-delay : 0;
    animation-direction : normal;
    animation-duration : 0;
    animation-fill-mode : none;
    animation-iteration-count : 1;
    animation-name : none;
    animation-play-state : running;
    animation-timing-function : ease;
    backface-visibility : visible;
    background : 0;
    background-attachment : scroll;
    background-clip : border-box;
    background-color : transparent;
    background-image : none;
    background-origin : padding-box;
    background-position : 0 0;
    background-position-x : 0;
    background-position-y : 0;
    background-repeat : repeat;
    background-size : auto auto;
    border : 0;
    border-style : none;
    border-width : medium;
    border-color : inherit;
    border-bottom : 0;
    border-bottom-color : inherit;
    border-bottom-left-radius : 0;
    border-bottom-right-radius : 0;
    border-bottom-style : none;
    border-bottom-width : medium;
    border-collapse : separate;
    border-image : none;
    border-left : 0;
    border-left-color : inherit;
    border-left-style : none;
    border-left-width : medium;
    border-radius : 0;
    border-right : 0;
    border-right-color : inherit;
    border-right-style : none;
    border-right-width : medium;
    border-spacing : 0;
    border-top : 0;
    border-top-color : inherit;
    border-top-left-radius : 0;
    border-top-right-radius : 0;
    border-top-style : none;
    border-top-width : medium;
    bottom : auto;
    box-shadow : none;
    box-sizing : content-box;
    caption-side : top;
    clear : none;
    clip : auto;
    color : inherit;
    columns : auto;
    column-count : auto;
    column-fill : balance;
    column-gap : normal;
    column-rule : medium none currentColor;
    column-rule-color : currentColor;
    column-rule-style : none;
    column-rule-width : none;
    column-span : 1;
    column-width : auto;
    content : normal;
    counter-increment : none;
    counter-reset : none;
    cursor : auto;
    direction : ltr;
    display : inline;
    empty-cells : show;
    float : none;
    font : normal;
    font-family : inherit;
    font-size : medium;
    font-style : normal;
    font-variant : normal;
    font-weight : normal;
    height : auto;
    hyphens : none;
    left : auto;
    letter-spacing : normal;
    line-height : normal;
    list-style : none;
    list-style-image : none;
    list-style-position : outside;
    list-style-type : disc;
    margin : 0;
    margin-bottom : 0;
    margin-left : 0;
    margin-right : 0;
    margin-top : 0;
    max-height : none;
    max-width : none;
    min-height : 0;
    min-width : 0;
    opacity : 1;
    orphans : 0;
    outline : 0;
    outline-color : invert;
    outline-style : none;
    outline-width : medium;
    overflow : visible;
    overflow-x : visible;
    overflow-y : visible;
    padding : 0;
    padding-bottom : 0;
    padding-left : 0;
    padding-right : 0;
    padding-top : 0;
    page-break-after : auto;
    page-break-before : auto;
    page-break-inside : auto;
    perspective : none;
    perspective-origin : 50% 50%;
    position : static;
    /* May need to alter quotes for different locales (e.g fr) */
    quotes : '\201C' '\201D' '\2018' '\2019';
    right : auto;
    tab-size : 8;
    table-layout : auto;
    text-align : inherit;
    text-align-last : auto;
    text-decoration : none;
    text-decoration-color : inherit;
    text-decoration-line : none;
    text-decoration-style : solid;
    text-indent : 0;
    text-shadow : none;
    text-transform : none;
    top : auto;
    transform : none;
    transform-style : flat;
    transition : none;
    transition-delay : 0s;
    transition-duration : 0s;
    transition-property : none;
    transition-timing-function : ease;
    unicode-bidi : normal;
    vertical-align : baseline;
    visibility : visible;
    white-space : normal;
    widows : 0;
    width : auto;
    word-spacing : normal;
    z-index : auto;
    /* basic modern patch */
    all: initial;
    all: unset;
}

/* basic modern patch */

#reset-this-root {
    all: initial;
    * {
        all: unset;
    }
}

/* Colors for data series and points. */
/* Chart background, point stroke for markers and columns etc, */
/* Neutral colors, grayscale by default. The default colors are defined by mixing the background-color
with neutral, with a weight corresponding to the number in the name. */
/* Strong text. */
/* Main text and some strokes. */
/* Axis labels, axis title, connector fallback. */
/* Credits text, export menu stroke. */
/* Disabled texts, button strokes, crosshair etc. */
/* Grid lines etc. */
/* Minor grid lines etc. */
/* Tooltip backgroud, button fills, map null points. */
/* Colored, shades of blue by default */
/* Drilldown clickable labels, color axis max color. */
/* Selection marker, menu hover, button hover, chart border, navigator series. */
/* Navigator mask fill. */
/* Ticks and axis line. */
/* Pressed button, color axis min color. */
.highcharts-container {
position: relative;
overflow: hidden;
width: 100%;
height: 100%;
text-align: left;
line-height: normal;
z-index: 0;
/* #1072 */
-webkit-tap-highlight-color: transparent;
font-family: "Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif;
font-size: 12px; }

.highcharts-root text {
stroke-width: 0; }

.highcharts-background {
fill: #ffffff; }

.highcharts-plot-border, .highcharts-plot-background {
fill: none; }

.highcharts-label-box {
fill: none; }

.highcharts-button-box {
fill: inherit; }

/* Titles */
.highcharts-title {
fill: #333333;
font-size: 1.5em; }

.highcharts-subtitle {
fill: #666666; }

/* Axes */
.highcharts-axis-line {
fill: none;
stroke: #ccd6eb; }

.highcharts-yaxis .highcharts-axis-line {
stroke-width: 0; }

.highcharts-axis-title {
fill: #666666; }

.highcharts-axis-labels {
fill: #666666;
cursor: default;
font-size: 0.9em; }

.highcharts-grid-line {
fill: none;
stroke: #e6e6e6; }

.highcharts-xaxis-grid .highcharts-grid-line {
stroke-width: 0; }

.highcharts-tick {
stroke: #ccd6eb; }

.highcharts-yaxis .highcharts-tick {
stroke-width: 0; }

.highcharts-minor-grid-line {
stroke: #f2f2f2; }

.highcharts-crosshair-thin {
stroke-width: 1px;
stroke: #cccccc; }

.highcharts-crosshair-category {
stroke: #ccd6eb;
stroke-opacity: 0.25; }

/* Credits */
.highcharts-credits {
cursor: pointer;
fill: #999999;
font-size: 0.7em;
transition: fill 250ms, font-size 250ms; }

.highcharts-credits:hover {
fill: black;
font-size: 1em; }

/* Tooltip */
.highcharts-tooltip {
cursor: default;
pointer-events: none;
white-space: nowrap;
transition: stroke 150ms; }

.highcharts-tooltip text {
fill: #333333; }

.highcharts-tooltip .highcharts-header {
font-size: 0.85em; }

.highcharts-tooltip-box {
stroke-width: 1px;
fill: #f7f7f7;
fill-opacity: 0.85; }

.highcharts-selection-marker {
fill: #335cad;
fill-opacity: 0.25; }

.highcharts-graph {
fill: none;
stroke-width: 2px;
stroke-linecap: round;
stroke-linejoin: round; }

.highcharts-state-hover .highcharts-graph {
stroke-width: 3; }

.highcharts-state-hover path {
transition: stroke-width 50;
/* quick in */ }

.highcharts-state-normal path {
transition: stroke-width 250ms;
/* slow out */ }

/* Legend hover affects points and series */
g.highcharts-series, .highcharts-point {
transition: opacity 250ms; }

.highcharts-legend-series-active g.highcharts-series:not(.highcharts-series-hover),
.highcharts-legend-point-active .highcharts-point:not(.highcharts-point-hover) {
opacity: 0.2; }

/* Series options */
/* Default colors */
.highcharts-color-0 {
fill: #7cb5ec;
stroke: #7cb5ec; }

.highcharts-color-1 {
fill: #434348;
stroke: #434348; }

.highcharts-color-2 {
fill: #90ed7d;
stroke: #90ed7d; }

.highcharts-color-3 {
fill: #f7a35c;
stroke: #f7a35c; }

.highcharts-color-4 {
fill: #8085e9;
stroke: #8085e9; }

.highcharts-color-5 {
fill: #f15c80;
stroke: #f15c80; }

.highcharts-color-6 {
fill: #e4d354;
stroke: #e4d354; }

.highcharts-color-7 {
fill: #2b908f;
stroke: #2b908f; }

.highcharts-color-8 {
fill: #f45b5b;
stroke: #f45b5b; }

.highcharts-color-9 {
fill: #91e8e1;
stroke: #91e8e1; }

.highcharts-area {
fill-opacity: 0.75;
stroke-width: 0; }

.highcharts-markers {
stroke-width: 1px;
stroke: #ffffff; }

.highcharts-point {
stroke-width: 1px; }

.highcharts-dense-data .highcharts-point {
stroke-width: 0; }

.highcharts-data-label {
font-size: 0.9em;
font-weight: bold; }

.highcharts-data-label-box {
fill: none;
stroke-width: 0; }

.highcharts-data-label text {
fill: #333333; }

.highcharts-data-label-connector {
fill: none; }

.highcharts-halo {
fill-opacity: 0.25;
stroke-width: 0; }

.highcharts-point-select {
fill: #cccccc;
stroke: #000000; }

.highcharts-column-series .highcharts-point {
stroke: #ffffff;
transition: fill-opacity 250ms; }

.highcharts-column-series .highcharts-point-hover {
fill-opacity: 0.75;
transition: fill-opacity 50ms; }

.highcharts-pie-series .highcharts-point {
stroke-linejoin: round;
stroke: #ffffff; }

.highcharts-pie-series .highcharts-point-hover {
fill-opacity: 0.75;
transition: fill-opacity 50ms; }

.highcharts-pie-series .highcharts-point-select {
fill: inherit;
stroke: inherit; }

.highcharts-funnel-series .highcharts-point {
stroke-linejoin: round;
stroke: #ffffff; }

.highcharts-funnel-series .highcharts-point-hover {
fill-opacity: 0.75;
transition: fill-opacity 50ms; }

.highcharts-funnel-series .highcharts-point-select {
fill: inherit;
stroke: inherit; }

.highcharts-pyramid-series .highcharts-point {
stroke-linejoin: round;
stroke: #ffffff; }

.highcharts-pyramid-series .highcharts-point-hover {
fill-opacity: 0.75;
transition: fill-opacity 50ms; }

.highcharts-pyramid-series .highcharts-point-select {
fill: inherit;
stroke: inherit; }

.highcharts-solidgauge-series .highcharts-point {
stroke-width: 0; }

.highcharts-treemap-series .highcharts-point {
stroke-width: 1px;
stroke: #e6e6e6;
transition: stroke 250ms, fill 250ms, fill-opacity 250ms; }

.highcharts-treemap-series .highcharts-point-hover {
stroke: #999999;
transition: stroke 25ms, fill 25ms, fill-opacity 25ms; }

.highcharts-treemap-series .highcharts-above-level {
display: none; }

.highcharts-treemap-series .highcharts-internal-node {
fill: none; }

.highcharts-treemap-series .highcharts-internal-node-interactive {
fill-opacity: 0.15;
cursor: pointer; }

.highcharts-treemap-series .highcharts-internal-node-interactive:hover {
fill-opacity: 0.75; }

/* Legend */
.highcharts-legend-box {
fill: none;
stroke-width: 0; }

.highcharts-legend-item text {
fill: #333333;
font-weight: bold;
cursor: pointer;
stroke-width: 0; }

.highcharts-legend-item:hover text {
fill: #000000; }

.highcharts-legend-item-hidden * {
fill: #cccccc !important;
stroke: #cccccc !important;
transition: fill 250ms; }

.highcharts-legend-nav-active {
fill: #003399;
cursor: pointer; }

.highcharts-legend-nav-inactive {
fill: #cccccc; }

.highcharts-legend-title-box {
fill: none;
stroke-width: 0; }

/* Loading */
.highcharts-loading {
position: absolute;
background-color: #ffffff;
opacity: 0.5;
text-align: center;
z-index: 10;
transition: opacity 250ms; }

.highcharts-loading-hidden {
height: 0 !important;
opacity: 0;
overflow: hidden;
transition: opacity 250ms, height 250ms step-end; }

.highcharts-loading-inner {
font-weight: bold;
position: relative;
top: 45%; }

/* Plot bands and polar pane backgrounds */
.highcharts-plot-band {
fill: #000000;
fill-opacity: 0.05; }

.highcharts-plot-line {
fill: none;
stroke: #999999;
stroke-width: 1px; }

/* Highcharts More */
.highcharts-boxplot-box {
fill: #ffffff; }

.highcharts-boxplot-median {
stroke-width: 2px; }

.highcharts-bubble-series .highcharts-point {
fill-opacity: 0.5; }

.highcharts-errorbar-series .highcharts-point {
stroke: #000000; }

.highcharts-gauge-series .highcharts-data-label-box {
stroke: #cccccc;
stroke-width: 1px; }

.highcharts-gauge-series .highcharts-dial {
fill: #000000;
stroke-width: 0; }

.highcharts-polygon-series .highcharts-graph {
fill: inherit;
stroke-width: 0; }

.highcharts-waterfall-series .highcharts-graph {
stroke: #333333;
stroke-dasharray: 1, 3; }

/* Highstock */
.highcharts-navigator-mask {
fill: #6685c2;
/* navigator.maskFill option */
fill-opacity: 0.25; }

.highcharts-navigator-mask-inside {
fill: #6685c2;
/* navigator.maskFill option */
fill-opacity: 0.25;
cursor: ew-resize; }

.highcharts-navigator-outline {
stroke: #cccccc;
fill: none; }

.highcharts-navigator-handle {
stroke: #cccccc;
fill: #f2f2f2;
cursor: ew-resize; }

.highcharts-navigator-series {
fill: #335cad;
stroke: #335cad; }

.highcharts-navigator-series .highcharts-graph {
stroke-width: 1px; }

.highcharts-navigator-series .highcharts-area {
fill-opacity: 0.05; }

.highcharts-navigator-xaxis .highcharts-axis-line {
stroke-width: 0; }

.highcharts-navigator-xaxis .highcharts-grid-line {
stroke-width: 1px;
stroke: #e6e6e6; }

.highcharts-navigator-xaxis.highcharts-axis-labels {
fill: #999999; }

.highcharts-navigator-yaxis .highcharts-grid-line {
stroke-width: 0; }

.highcharts-scrollbar-thumb {
fill: #cccccc;
stroke: #cccccc;
stroke-width: 1px; }

.highcharts-scrollbar-button {
fill: #e6e6e6;
stroke: #cccccc;
stroke-width: 1px; }

.highcharts-scrollbar-arrow {
fill: #666666; }

.highcharts-scrollbar-rifles {
stroke: #666666;
stroke-width: 1px; }

.highcharts-scrollbar-track {
fill: #f2f2f2;
stroke: #f2f2f2;
stroke-width: 1px; }

.highcharts-button {
fill: #f7f7f7;
stroke: #cccccc;
cursor: default;
stroke-width: 1px;
transition: fill 250ms; }

.highcharts-button text {
fill: #333333; }

.highcharts-button-hover {
transition: fill 0ms;
fill: #e6e6e6;
stroke: #333333; }

.highcharts-button-pressed {
font-weight: bold;
fill: #e6ebf5;
stroke: #335cad; }

.highcharts-button-disabled text {
fill: #cccccc; }

.highcharts-range-selector-buttons .highcharts-button {
stroke-width: 0; }

.highcharts-range-label rect {
fill: none; }

.highcharts-range-label text {
fill: #666666; }

.highcharts-range-input rect {
fill: none; }

.highcharts-range-input text {
fill: #333333; }

input.highcharts-range-selector {
position: absolute;
border: 0;
width: 1px;
/* Chrome needs a pixel to see it */
height: 1px;
padding: 0;
text-align: center;
left: -9em;
/* #4798 */ }

.highcharts-crosshair-label text {
fill: #ffffff;
font-size: 1.1em; }

.highcharts-crosshair-label .highcharts-label-box {
fill: inherit; }

.highcharts-candlestick-series .highcharts-point {
stroke: #000000;
stroke-width: 1px; }

.highcharts-candlestick-series .highcharts-point-up {
fill: #ffffff; }

.highcharts-ohlc-series .highcharts-point-hover {
stroke-width: 3px; }

.highcharts-flags-series .highcharts-point {
stroke: #999999;
fill: #ffffff; }

.highcharts-flags-series .highcharts-point-hover {
stroke: #000000;
fill: #ccd6eb; }

.highcharts-flags-series .highcharts-point text {
fill: #000000;
font-size: 0.9em;
font-weight: bold; }

/* Highmaps */
.highcharts-map-series .highcharts-point {
transition: fill 500ms, fill-opacity 500ms, stroke-width 250ms;
stroke: #cccccc; }

.highcharts-map-series .highcharts-point-hover {
transition: fill 0ms, fill-opacity 0ms;
fill-opacity: 0.5;
stroke-width: 2px; }

.highcharts-mapline-series .highcharts-point {
fill: none; }

.highcharts-heatmap-series .highcharts-point {
stroke-width: 0; }

.highcharts-map-navigation {
font-size: 1.3em;
font-weight: bold;
text-align: center; }

.highcharts-coloraxis {
stroke-width: 0; }

.highcharts-coloraxis-marker {
fill: #999999; }

.highcharts-null-point {
fill: #f7f7f7; }

/* 3d charts */
.highcharts-3d-frame {
fill: transparent; }

.highcharts-column-series .highcharts-point {
stroke: inherit;
/* use point color */ }

/* Exporting module */
.highcharts-contextbutton {
fill: #ffffff;
/* needed to capture hover */
stroke: none;
stroke-linecap: round; }

.highcharts-contextbutton:hover {
fill: #e6e6e6;
stroke: #e6e6e6; }

.highcharts-button-symbol {
stroke: #666666;
stroke-width: 3px; }

.highcharts-menu {
border: 1px solid #999999;
background: #ffffff;
padding: 5px 0;
box-shadow: 3px 3px 10px #888; }

.highcharts-menu-item {
padding: 0.5em 1em;
background: none;
color: #333333;
cursor: pointer;
transition: background 250ms, color 250ms; }

.highcharts-menu-item:hover {
background: #335cad;
color: #ffffff; }

/* Drilldown module */
.highcharts-drilldown-point {
cursor: pointer; }

.highcharts-drilldown-data-label text, .highcharts-drilldown-axis-label {
cursor: pointer;
fill: #003399;
font-weight: bold;
text-decoration: underline; }

/* No-data module */
.highcharts-no-data text {
font-weight: bold;
font-size: 12px;
fill: #666666; }
</style>
