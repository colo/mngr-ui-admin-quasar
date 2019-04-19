export default function () {
  return {
    options: {
      graph: {
        always_update: false
      },
      dygraph: {
        smoothness: false
      }
    },
    theme: {
      slate: {
        dygraph: {
          axisLineColor: '#283236',
          strokeBorderColor: '#272b30',
          gridLineColor: '#283236',
          colors: [
            '#66AA00', '#FE3912', '#3366CC', '#D66300', '#0099C6', '#DDDD00',
            '#5054e6', '#EE9911', '#BB44CC', '#e45757', '#ef0aef', '#CC7700',
            '#22AA99', '#109618', '#905bfd', '#f54882', '#4381bf', '#ff3737',
            '#329262', '#3B3EFF'
          ]
        }
      },
      white: {
        dygraph: {
          axisLineColor: '#F0F0F0',
          strokeBorderColor: '#FFFFFF',
          gridLineColor: '#F0F0F0',
          colors: [
            '#3366CC', '#DC3912', '#109618', '#FF9900', '#990099', '#DD4477',
            '#3B3EAC', '#66AA00', '#0099C6', '#B82E2E', '#AAAA11', '#5574A6',
            '#994499', '#22AA99', '#6633CC', '#E67300', '#316395', '#8B0707',
            '#329262', '#3B3EAC'
          ]
        }
      }
    },
    charts: {},
    instances: {},
    paths: [],
    data_range: [],
    range: []
    // networkInterfaces: undefined,
    // stats: {}
  }
}
