/* eslint-disable */

'use strict'

// const App = require ( '../../node_modules/node-app-couchdb-client/index' )
const App = require ( 'node-app-socket.io-client/index' )

import * as Debug from "debug"

const debug = Debug("mngr-ui:libs:input:io.logs")
// debug_internals = Debug("mngr-ui:libs:input:io.logs:Internals"),
// debug_events = Debug("mngr-ui:libs:input:io.logs:Events");

// import store from 'src/store'

// import DefaultConn from '@etc/default.io'
import LogsIO from '@etc/logs.io'

export default new Class({
  Extends: App,

  // types: ['count', 'logs', 'paths'],
  // recived: [],

  options: {
    // path: '/logs',

    scheme: undefined,
    log: undefined,
    port: undefined,


  	requests : {
      once: [


			],
			periodical: [


			],

		},

    io: {
			middlewares: [], //namespace.use(fn)
			// rooms: ['logs'], //atomatically join connected sockets to this rooms
			routes: {
				// 'app.doc': [{
				// 	// path: ':param',
				// 	// once: true, //socket.once
				// 	callbacks: ['app_doc'],
				// 	// middlewares: [], //socket.use(fn)
				// }],
        'logs': [{
					// path: ':param',
					// once: true, //socket.once
					callbacks: ['logs'],
					// middlewares: [], //socket.use(fn)
				}],
        'on': [{
					// path: ':param',
					// once: true, //socket.once
					callbacks: ['register'],
					// middlewares: [], //socket.use(fn)
				}],
				// '*': [{// catch all
				// 	path: '',
				// 	callbacks: ['not_found_message'],
				// 	middlewares: [], //socket.use(fn)
				// }]
			}
		}


  },
  register: function(socket, next, result){
    debug('register %o', result)

  },
  logs: function(socket, next, doc){
    debug('logs %o', doc)
    let {type} = doc

    this.fireEvent('onDoc', [doc, { type: type, input_type: this, app: null }])

    // store.commit('logs/clear')
    // store.commit('logs/set', doc[type])
  },
  // app_doc: function(socket, next){
  //   if(this.recived.length < this.types.length){
  //     let docs = arguments[2]
  //     console.log('app_doc...', docs)
  //     if(docs && docs.type){
  //       docs = [docs]
  //       // store.commit('app/doc', doc)
  //     }
  //     Array.each(docs, function(doc){
  //       if(doc && doc.type){
  //         this.fireEvent('onPeriodicalDoc', [doc, {type: 'periodical', input_type: this, app: null}]);
  //         if(this.types.contains(doc.type) && !this.recived.contains(doc.type))
  //           this.recived.push(doc.type)
  //
  //         store.commit('app/doc', doc)
  //       }
  //     }.bind(this))
  //   }
  //
  //
  //   // if(this.recived.length == this.types.length)
  //   //   this.io.close()
  //
	// 	// arguments[1]()
	// 	// this.io.to('root').emit('response', 'a new user has joined the room saying '+arguments[2]);
	// 	// next(socket)
	// },

  initialize: function(options){
    debug('initialize')

		this.parent(options);//override default options

    // let _io = new App(DefaultConn)
    this.add_io(LogsIO)

		this.profile('root_init');//start profiling


    this.addEvent('onConnect', function(){
      debug('initialize socket.onConnect', this.io.id)
      // this.io.emit('on', 'logs')
      // this.io.emit('on', 'changes', {
      //   params: { prop: undefined },
      //   // query: {
      //   //   "register": "changes",
      //   // },
      //   // body: {
      //   // 	"q": [
      //   // 		{"data": ["body_bytes_sent", "remote_addr", {"user_agent": {"os": ["family"]}}]},
      //   // 		{"metadata": ["host"]}
      //   // 	]
      //   //
      //   // }
      //   // body: {
      //   // 	"aggregation": "count"
      //   // }
      // })

      // this.io.emit('on', 'periodical', {
      //   params: { prop: undefined },
      //   // query: {
      //   //   // "register": "changes",
      //   //   "interval": 10000,
      //   // },
      //   // body: {
      //   // 	"q": [
      //   // 		{"data": ["body_bytes_sent", "remote_addr", {"user_agent": {"os": ["family"]}}]},
      //   // 		{"metadata": ["host"]}
      //   // 	]
      //   //
      //   // }
      //
      //   body: {
      //     "interval": 10000,
      //     // "q": [
      //   	// 	{"metadata": ["path"]}
      //   	// ],
      //   	"aggregation": "count"
      //   }
      // })

      this.io.emit('on', 'periodical', {
        params: { prop: undefined },

        body: {
          // "interval": 5000,
        	"aggregation": "count"
        }
      })

      this.io.emit('on', 'periodical', {
        params: { prop: undefined },

        body: {
          // "interval": 5000,
        	"q": [
        		{"data": ["status"]},
        	],
        	"filter": "('data')('status').eq(200)",
          "aggregation": "count"
        }
      })

      // this.io.emit('on', 'periodical', {
      //   body: {
      //     "interval": 5000,
      //   }
      // })

      this.io.emit('/')

    })

    this.addEvent('onExit', function(){
      debug('onExit')

      this.io.on('off', 'logs')

      this.remove_io_routes()

      // if(this.io.disconnected == false)
      //   this.io.close()
    })

		this.profile('root_init');//end profiling

		this.log('root', 'info', 'root started');
  },

});
