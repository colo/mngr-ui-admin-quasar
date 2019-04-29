/* eslint-disable */

'use strict'

// const App = require ( '../../node_modules/node-app-couchdb-client/index' )
const App = require('node-app-socket.io-client/index')

import DefaultConn from '@etc/default.io'
const HttpRestClient = require('node-app-http-client/index')


// import { throttle } from 'quasar'
import * as Debug from 'debug'

const debug = Debug('mngr-ui:libs:input:io.host')
  // debug_internals = Debug('mngr-ui:libs:input:io.host:Internals'),
  // debug_events = Debug('mngr-ui:libs:input:io.host:Events')

let http_rest_client = new Class({
  Extends: HttpRestClient,

  ON_DATA: 'onData',

  options: {
    path: '/hosts',

    api:{
      routes: {

  			get: [
  				{
  					path: ':host/data/',
  					callbacks: ['data'],
  					//version: '',
  				},
  				// {
  				// 	path: '',
  				// 	callbacks: ['data'],
  				// 	//version: '',
  				// },
  			]
  		},
    },


  },

  data: function(req, res, data, opts){
    debug('rest client data %o %o', JSON.parse(data), opts)
    if(data)
      this.fireEvent(this.ON_DATA, JSON.parse(data))
  },
  initialize: function(options){
    this.parent(options)
    // this.fireEvent(this.ON_CONNECT)
    debug('initialize', this.options)
  },
})

import HostsIO from '@etc/hosts.io'

export default new Class({
  Extends: App,

  registered: false,
  http_rest_client: undefined,

  options: {

    // path: '/hosts',
    scheme: undefined,
    host: undefined,
    port: undefined,

    status: undefined,

    stat_host: null,


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

            // if(app.options.stat_host && this.status == 'ok'){
            if (app.options.stat_host) {
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

                } else if (!event.path) {
                  app.io.emit('/', {
                    host: app.options.stat_host,
                    prop: 'data',
                    format: (event.tabular == true) ? 'tabular' : 'stat',
                    range: event.Range
                  })


                }

                if (index == req.opt.range.length - 1) {


                  if (tabulars_events_paths.length > 0) {
                    debug('SORT_BY_PATH RANGE', JSON.stringify(tabulars_events_paths), JSON.stringify(stats_events_paths))
                    // app.io.emit('/', {
                    //   host: app.options.stat_host,
                    //   prop: 'data',
                    //   format: 'tabular',
                    //   paths: JSON.stringify(tabulars_events_paths),
                    //   // range: event.Range
                    //   range: 'posix ' + tabulars_events_biggest_range.start + '-' + tabulars_events_biggest_range.end + '/*'
                    // })
                    app.http_rest_client.api.get({
                      uri: app.options.stat_host+'/data/',
                      // uri: '',
                      headers: {
          							'Accept': 'application/json',
                        'Range': 'posix ' + tabulars_events_biggest_range.start + '-' + tabulars_events_biggest_range.end + '/*'
          						},
                      qs: {
                        format: 'tabular',
                        paths: tabulars_events_paths
          						}
                    })
                  }

                  if (stats_events_paths.length > 0) {
                    // app.io.emit('/', {
                    //   host: app.options.stat_host,
                    //   prop: 'data',
                    //   format: 'stat',
                    //   paths: JSON.stringify(stats_events_paths),
                    //   // range: event.Range
                    //   range: 'posix ' + stats_events_biggest_range.start + '-' + stats_events_biggest_range.end + '/*'
                    // })
                    app.http_rest_client.api.get({
                      uri: app.options.stat_host+'/data/',
                      // uri: '',
                      headers: {
          							'Accept': 'application/json',
                        'Range': 'posix ' + stats_events_biggest_range.start + '-' + stats_events_biggest_range.end + '/*'
          						},
                      qs: {
                        format: 'stat',
                        paths: stats_events_paths
          						}
                    })
                  }

                }
              }.bind(app))
            }

            // }, 500)
          }

        }

      ],
      once: [
        // {
        // 	charts: function(req, next, app){
        //
        //     if(app.options.stat_host){
        //
        //       this.io.emit('charts', app.options.stat_host)
        //
        //     }
        //
        // 	}
        // },
        // {
        // 	instances: function(req, next, app){
        //
        //     if(app.options.stat_host){
        //
        //       this.io.emit('instances', app.options.stat_host)
        //
        //     }
        //
        // 	}
        // },
        // {
        // 	stats: function(req, next, app){
        //
        //     if(app.options.stat_host){
        //
        //       this.io.emit('stats', {
        //         host: app.options.stat_host
        //       })
        //
        //     }
        //
        // 	}
        // },
        // {
        // 	tabulars: function(req, next, app){
        //
        //     if(app.options.stat_host){
        //
        //       this.io.emit('stats', {
        //         host: app.options.stat_host,
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
        // 	sort_by_host: function(req, next, app){
        //
        //     if(app.options.stat_host){
        //
        //       this.io.emit('periodical', {
        //         host: app.options.stat_host,
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
  // rest_get: function(rest_options){
  //   debug('rest_get', rest_options)
  //   // process.exit(1)
  //   this.http_rest_client.api.get(rest_options)
  // },
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
        //   // {host: this.options.stat_host, prop: 'paths', format: 'stat'},
        //   {host: this.options.stat_host, prop: 'data', format: 'stat'},
        //   {host: this.options.stat_host, prop: 'data', format: 'tabular'},
        //   // {host: this.options.stat_host, prop: 'data_range'}
        // ])
      }
    }
    // store.commit('hosts/clear')
    // store.commit('hosts/set', hosts)
  },

  paths: function (socket, next, doc) {
    debug('paths %o', doc)

    if (doc.paths && doc.paths !== null) { this.fireEvent('onDoc', [doc, { type: 'doc', input_type: this, app: null }]) }
    // store.commit('hosts/clear')
    // store.commit('hosts/set', hosts)
  },

  // charts: function(socket, next){
  //   let {host, status, charts} = arguments[2]
  //   console.log('IO.HOST charts', host, status, charts)
  //   this.status = status
  //
  //   this.fireEvent('onDoc', [Object.merge({type: 'charts'}, arguments[2]), {type: 'doc', input_type: this, app: null}]);
  //
  //   // this.charts(socket, next, {host: host, charts: charts})
  //   // this.fireEvent('onDoc', [{type: 'charts', charts: charts}, {type: 'doc', input_type: this, app: null}]);
  //   //
  //   // if(status == 'ok')
  //   //   this.io.emit('range', )
  // },
  instances: function (socket, next, doc) {
    // let {host, status, instances} = arguments[2]
    debug('instances', doc)
    // this.status = status

    // this.fireEvent('onDoc', [Object.merge({type: 'instances'}, arguments[2]), {type: 'doc', input_type: this, app: null}]);
    if (doc.instances && doc.instances !== null) {
      this.fireEvent('onDoc', [doc, { type: 'doc', input_type: this, app: null }])

      // if (this.registered === false) {
      //   this.registered = true
      //   this.io.emit('on', [
      //     // {host: this.options.stat_host, prop: 'paths', format: 'stat'},
      //     // {host: this.options.stat_host, prop: 'data', format: 'stat'},
      //     // {host: this.options.stat_host, prop: 'data', format: 'tabular'},
      //     // {host: this.options.stat_host, prop: 'data_range'}
      //   ])
      // }
    }
    // this.charts(socket, next, {host: host, charts: charts})
    // this.fireEvent('onDoc', [{type: 'charts', charts: charts}, {type: 'doc', input_type: this, app: null}]);
    //
    // if(status == 'ok')
    //   this.io.emit('range', )
  },
  data: function (socket, next, doc) {
    debug('data %o', doc)
    // let {type, doc, tabular} = stats
    // stats.key = stats.host
    // let stats = {
    //   key: doc.host,
    // }

    // if(stats.type == 'range')
    //   console.log('IO.HOST stats', arguments[2])

    // if(tabular != true)
    this.fireEvent((doc.range) ? 'onRangeDoc' : 'onPeriodicalDoc', [
      Object.merge(
        doc,
        { key: doc.host, type: (doc.stat) ? 'stat' : 'tabular' }
      ),
      { type: (doc.stat) ? 'stat' : 'tabular', input_type: this, app: null }
    ])

    // if(doc.tabular){
    //   // this.io.emit('/', {host: this.options.stat_host, prop: 'instances'})
    //   this.io.emit('instances', {host: this.options.stat_host, prop: 'instances'})
    // }

    // //////console.log('app_doc...', socket, arguments[2])
    // arguments[1]()
    // this.io.to('root').emit('response', 'a new user has joined the room saying '+arguments[2]);
    // next(socket)
  },

  initialize: function (options) {
    this.parent(options)// override default options


    this.profile('root_init')// start profiling

    this.add_io(HostsIO)

    this.http_rest_client = new http_rest_client(DefaultConn)
    this.http_rest_client.addEvent(this.http_rest_client.ON_DATA, function(data){
      this.data(undefined, undefined, data)
    }.bind(this))

    // this.addEvent('onConnect', function(){
    debug('initialize socket.onConnect', this.io.id)

    this.io.emit('on', [
      {host: this.options.stat_host, prop: 'data_range'},
      { host: this.options.stat_host, prop: 'instances' },
      { host: this.options.stat_host, prop: 'paths', format: 'stat' },
      { host: this.options.stat_host, prop: 'data', format: 'stat' },
      { host: this.options.stat_host, prop: 'data', format: 'tabular' }
    ])
    this.io.emit('/', { host: this.options.stat_host, prop: 'instances' })

    // // this.io.emit('on', {host: this.options.stat_host, prop: 'paths', format: 'stat'})
    //
    this.io.emit('/', { host: this.options.stat_host, prop: 'data_range' })
    //
    this.io.emit('/', { host: this.options.stat_host, prop: 'paths', format: 'stat' })
    //
    // // this.io.emit('on', {host: this.options.stat_host, prop: 'data', format: 'stat'})
    // this.io.emit('/', { host: this.options.stat_host, prop: 'data', format: 'stat' })
    //
    // // this.io.emit('on', {host: this.options.stat_host, prop: 'data', format: 'tabular'})
    // this.io.emit('/', { host: this.options.stat_host, prop: 'data', format: 'tabular' })

    // })

    this.addEvent('onExit', function () {
      debug('onExit')

      this.registered = false
      this.io.emit('off', [
        { host: this.options.stat_host, prop: 'instances' },
        { host: this.options.stat_host, prop: 'paths', format: 'stat' },
        { host: this.options.stat_host, prop: 'data', format: 'stat' },
        { host: this.options.stat_host, prop: 'data', format: 'tabular' },
        { host: this.options.stat_host, prop: 'data_range' }
      ])

      this.remove_io_routes()
      // this.io = undefined
      // if(this.io.disconnected == false)
      //   this.io.close()
    }.bind(this))
    // //////console.log('this.io', this.io)
    // this.io.emit('host', this.options.stat_host)

    this.profile('root_init')// end profiling

    this.log('root', 'info', 'root started')
  }

})
