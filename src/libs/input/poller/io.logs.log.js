/* eslint-disable */

'use strict'

// const App = require ( '../../node_modules/node-app-couchdb-client/index' )
const App = require('node-app-socket.io-client/index')

// import { throttle } from 'quasar'
import * as Debug from 'debug'

const debug = Debug('mngr-ui:libs:input:io.logs.log')
  // debug_internals = Debug('mngr-ui:libs:input:io.logs.log:Internals'),
  // debug_events = Debug('mngr-ui:libs:input:io.logs.log:Events')

import LogsIO from '@etc/logs.io'

export default new Class({
  Extends: App,

  registered: false,

  options: {

    // path: '/logs',
    scheme: undefined,
    log: undefined,
    port: undefined,

    status: undefined,

    stat_log: null,

  	requests: {
      range: [
    		{
          // sort_by_path: throttle(function(req, next, app){
          sort_by_path: function (req, next, app) {
            // console.log('SORT_BY_PATH RANGE', req, new Date(req.opt.range.start), new Date(req.opt.range.end))
            debug('SORT_BY_PATH RANGE', req)

            if (!Array.isArray(req.opt.range)) { req.opt.range = [req.opt.range] }

            let tabulars_events_paths = []
            let tabulars_events_biggest_range = { start: 0, end: 0 }
            let stats_events_paths = []
            let stats_events_biggest_range = { start: 0, end: 0 }

            // if(app.options.stat_log && this.status == 'ok'){
            if (app.options.stat_log) {
              Array.each(req.opt.range, function (range, index) {
                let event = req[index]

                if (!app.options.paths_blacklist || app.options.paths_blacklist.test(event.path) == false) {
                  if (event.tabular == true) {
                    tabulars_events_paths.push(event.path)
                    tabulars_events_biggest_range.start = (tabulars_events_biggest_range.start > range.start) ? tabulars_events_biggest_range.start : range.start
                    tabulars_events_biggest_range.end = (tabulars_events_biggest_range.end > range.end) ? tabulars_events_biggest_range.end : range.end
                  } else {
                    stats_events_paths.push(event.path)
                    stats_events_biggest_range.start = (stats_events_biggest_range.start > range.start) ? stats_events_biggest_range.start : range.start
                    stats_events_biggest_range.end = (stats_events_biggest_range.end > range.end) ? stats_events_biggest_range.end : range.end
                  }
                  // this.io.emit('stats', {
                  //   log: app.options.stat_log,
                  //   stat: event.path,
                  //   format: (event.tabular == true) ? 'tabular' : undefined,
                  //   // range: req.opt.range
                  //   range: event.Range
      						// })
                } else if (!event.path) {
                  this.io.emit('/', {
                    log: app.options.stat_log,
                    prop: 'data',
                    format: (event.tabular == true) ? 'tabular' : 'stat',
                    range: event.Range
                  })

                  // this.io.emit('stats', {
                  //   log: app.options.stat_log,
                  //   format: (event.tabular == true) ? 'tabular' : undefined,
                  //   range: event.Range
      						// })
                }

                if (index == req.opt.range.length - 1) {
                  debug('SORT_BY_PATH RANGE', JSON.stringify(tabulars_events_paths), JSON.stringify(stats_events_paths))

                  if (tabulars_events_paths.length > 0) {
                    this.io.emit('/', {
                      log: app.options.stat_log,
                      prop: 'data',
                      format: 'tabular',
                      paths: JSON.stringify(tabulars_events_paths),
                      // range: event.Range
                      range: 'posix ' + tabulars_events_biggest_range.start + '-' + tabulars_events_biggest_range.end + '/*'
                    })
                  }

                  // this.io.emit('stats', {
                  //   log: app.options.stat_log,
                  //   stat: JSON.stringify(tabulars_events_paths),
                  //   format: 'tabular',
                  //   // range: req.opt.range
                  //   range: "posix "+tabulars_events_biggest_range.start+"-"+tabulars_events_biggest_range.end+"/*"
                  // })

                  if (stats_events_paths.length > 0) {
                    this.io.emit('/', {
                      log: app.options.stat_log,
                      prop: 'data',
                      format: 'stat',
                      paths: JSON.stringify(stats_events_paths),
                      // range: event.Range
                      range: 'posix ' + stats_events_biggest_range.start + '-' + stats_events_biggest_range.end + '/*'
                    })
                  }
                  // this.io.emit('stats', {
                  //   log: app.options.stat_log,
                  //   stat: JSON.stringify(stats_events_paths),
                  //   format: undefined,
                  //   // range: req.opt.range
                  //   range: "posix "+stats_events_biggest_range.start+"-"+stats_events_biggest_range.end+"/*"
                  // })
                }
              }.bind(this))
            }

            // }, 500)
          }

        }

      ],
      once: [
        // {
        // 	charts: function(req, next, app){
        //
        //     if(app.options.stat_log){
        //
        //       this.io.emit('charts', app.options.stat_log)
        //
        //     }
        //
        // 	}
        // },
        // {
        // 	instances: function(req, next, app){
        //
        //     if(app.options.stat_log){
        //
        //       this.io.emit('instances', app.options.stat_log)
        //
        //     }
        //
        // 	}
        // },
        // {
        // 	stats: function(req, next, app){
        //
        //     if(app.options.stat_log){
        //
        //       this.io.emit('stats', {
        //         log: app.options.stat_log
        //       })
        //
        //     }
        //
        // 	}
        // },
        // {
        // 	tabulars: function(req, next, app){
        //
        //     if(app.options.stat_log){
        //
        //       this.io.emit('stats', {
        //         log: app.options.stat_log,
        //         format: 'tabular',
        //       })
        //
        //     }
        //
        // 	}
        // },

      ],
      periodical: [
        // {
        // 	sort_by_log: function(req, next, app){
        //
        //     if(app.options.stat_log){
        //
        //       this.io.emit('periodical', {
        //         log: app.options.stat_log,
        //       })
        //
        //     }
        //
        // 	}
        // }
      ]

    },

    io: {
      // middlewares: [], //namespace.use(fn)
      // rooms: ['root'], //atomatically join connected sockets to this rooms
      routes: {
        // 'data': [{
        // 	// path: ':param',
        // 	// once: true, //socket.once
        // 	callbacks: ['data'],
        // 	// middlewares: [], //socket.use(fn)
        // }],
        'stat': [{
          // path: ':param',
          // once: true, //socket.once
          callbacks: ['data']
          // middlewares: [], //socket.use(fn)
        }],
        'tabular': [{
          // path: ':param',
          // once: true, //socket.once
          callbacks: ['data']
          // middlewares: [], //socket.use(fn)
        }],
        'instances': [{
          // path: ':param',
          // once: true, //socket.once
          callbacks: ['instances']
          // middlewares: [], //socket.use(fn)
        }],
        'paths': [{
          // path: ':param',
          // once: true, //socket.once
          callbacks: ['paths']
          // middlewares: [], //socket.use(fn)
        }],
        'data_range': [{
          // path: ':param',
          // once: true, //socket.once
          callbacks: ['data_range']
          // middlewares: [], //socket.use(fn)
        }],
        'on': [{
          // path: ':param',
          // once: true, //socket.once
          callbacks: ['register']
          // middlewares: [], //socket.use(fn)
        }],
        'off': [{
          // path: ':param',
          // once: true, //socket.once
          callbacks: ['unregistered']
          // middlewares: [], //socket.use(fn)
        }]
        // // 'charts':[{
        // //   callbacks: ['charts']
        // // }],
        // 'charts': [{
        // 	// path: ':param',
        // 	// once: true, //socket.once
        // 	callbacks: ['charts'],
        // 	// middlewares: [], //socket.use(fn)
        // }],
        // 'instances': [{
        // 	// path: ':param',
        // 	// once: true, //socket.once
        // 	callbacks: ['instances'],
        // 	// middlewares: [], //socket.use(fn)
        // }],
        // 'stats': [{
        // 	// path: ':param',
        // 	// once: true, //socket.once
        // 	callbacks: ['stats'],
        // 	// middlewares: [], //socket.use(fn)
        // }],
        // // '*': [{// catch all
        // // 	path: '',
        // // 	callbacks: ['not_found_message'],
        // // 	middlewares: [], //socket.use(fn)
        // // }]
      }
    }

  },
  register: function (socket, next, result) {
    debug('register %o', result)
  },
  unregistered: function (socket, next, result) {
    debug('unregistered %o', result)
  },
  data_range: function (socket, next, doc) {
    debug('data_range %o', doc)

    if (doc.data_range && doc.data_range !== null) {
      this.fireEvent('onDoc', [doc, { type: 'doc', input_type: this, app: null }])
      if (this.registered === false) {
        this.registered = true
        // this.io.emit('on', [
        //   // {log: this.options.stat_log, prop: 'paths', format: 'stat'},
        //   {log: this.options.stat_log, prop: 'data', format: 'stat'},
        //   {log: this.options.stat_log, prop: 'data', format: 'tabular'},
        //   // {log: this.options.stat_log, prop: 'data_range'}
        // ])
      }
    }
    // store.commit('logs/clear')
    // store.commit('logs/set', logs)
  },

  paths: function (socket, next, doc) {
    debug('paths %o', doc)

    if (doc.paths && doc.paths !== null) { this.fireEvent('onDoc', [doc, { type: 'doc', input_type: this, app: null }]) }
    // store.commit('logs/clear')
    // store.commit('logs/set', logs)
  },

  // charts: function(socket, next){
  //   let {log, status, charts} = arguments[2]
  //   console.log('io.logs.log charts', log, status, charts)
  //   this.status = status
  //
  //   this.fireEvent('onDoc', [Object.merge({type: 'charts'}, arguments[2]), {type: 'doc', input_type: this, app: null}]);
  //
  //   // this.charts(socket, next, {log: log, charts: charts})
  //   // this.fireEvent('onDoc', [{type: 'charts', charts: charts}, {type: 'doc', input_type: this, app: null}]);
  //   //
  //   // if(status == 'ok')
  //   //   this.io.emit('range', )
  // },
  instances: function (socket, next, doc) {
    // let {log, status, instances} = arguments[2]
    debug('instances', doc)
    // this.status = status

    // this.fireEvent('onDoc', [Object.merge({type: 'instances'}, arguments[2]), {type: 'doc', input_type: this, app: null}]);
    if (doc.instances && doc.instances !== null) {
      this.fireEvent('onDoc', [doc, { type: 'doc', input_type: this, app: null }])

      // if (this.registered === false) {
      //   this.registered = true
      //   this.io.emit('on', [
      //     // {log: this.options.stat_log, prop: 'paths', format: 'stat'},
      //     // {log: this.options.stat_log, prop: 'data', format: 'stat'},
      //     // {log: this.options.stat_log, prop: 'data', format: 'tabular'},
      //     // {log: this.options.stat_log, prop: 'data_range'}
      //   ])
      // }
    }
    // this.charts(socket, next, {log: log, charts: charts})
    // this.fireEvent('onDoc', [{type: 'charts', charts: charts}, {type: 'doc', input_type: this, app: null}]);
    //
    // if(status == 'ok')
    //   this.io.emit('range', )
  },
  data: function (socket, next, doc) {
    debug('data %o', doc)
    // let {type, doc, tabular} = stats
    // stats.key = stats.log
    // let stats = {
    //   key: doc.log,
    // }

    // if(stats.type == 'range')
    //   console.log('io.logs.log stats', arguments[2])

    // if(tabular != true)
    this.fireEvent((doc.range) ? 'onRangeDoc' : 'onPeriodicalDoc', [
      Object.merge(
        doc,
        { key: doc.log, type: (doc.stat) ? 'stat' : 'tabular' }
      ),
      { type: (doc.stat) ? 'stat' : 'tabular', input_type: this, app: null }
    ])

    // if(doc.tabular){
    //   // this.io.emit('/', {log: this.options.stat_log, prop: 'instances'})
    //   this.io.emit('instances', {log: this.options.stat_log, prop: 'instances'})
    // }

    // //////console.log('app_doc...', socket, arguments[2])
    // arguments[1]()
    // this.io.to('root').emit('response', 'a new user has joined the room saying '+arguments[2]);
    // next(socket)
  },

  initialize: function (options) {
    this.parent(options)// override default options

    this.profile('root_init')// start profiling

    this.add_io(LogsIO)

    // this.addEvent('onConnect', function(){
    debug('initialize socket.onConnect', this.io.id)

    this.io.emit('on', [
      // {log: this.options.stat_log, prop: 'data_range'},
      // { log: this.options.stat_log, prop: 'instances' },
      // { log: this.options.stat_log, prop: 'paths', format: 'stat' },
      { log: this.options.stat_log, prop: 'data', format: 'stat' },
      { log: this.options.stat_log, prop: 'data', format: 'tabular' }
    ])

    // this.io.emit('/', { log: this.options.stat_log, prop: 'instances' })
    // this.io.emit('/', { log: this.options.stat_log, prop: 'data_range' })
    // this.io.emit('/', { log: this.options.stat_log, prop: 'paths', format: 'stat' })


    this.addEvent('onExit', function () {
      debug('onExit')

      this.registered = false
      this.io.emit('off', [
        { log: this.options.stat_log, prop: 'instances' },
        { log: this.options.stat_log, prop: 'paths', format: 'stat' },
        { log: this.options.stat_log, prop: 'data', format: 'stat' },
        { log: this.options.stat_log, prop: 'data', format: 'tabular' },
        { log: this.options.stat_log, prop: 'data_range' }
      ])

      this.remove_io_routes()
      // this.io = undefined
      // if(this.io.disconnected == false)
      //   this.io.close()
    }.bind(this))
    // //////console.log('this.io', this.io)
    // this.io.emit('log', this.options.stat_log)

    this.profile('root_init')// end profiling

    this.log('root', 'info', 'root started')
  }

})
