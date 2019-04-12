
var mootools = require('mootools')

// let store = require( 'src/store' )
// let Vue = require( 'vue' )
import store from 'src/store'

import Vue from 'vue'

export default new Class({
	Implements: [Options, Events],

	ON_SUSPEND: 'onSuspend',
	ON_RESUME: 'onResume',
	ON_EXIT: 'onExit',

	ON_ONCE: 'onOnce',
	ON_RANGE: 'onRange',


	ON_CLIENT_CONNECT: 'onClientConnect',
	ON_CLIENT_CONNECT_ERROR: 'onClientConnectError',

	ON_DOC: 'onDoc',
	ON_DOC_ERROR: 'onDocError',

	ON_ONCE_DOC: 'onOnceDoc',
	ON_ONCE_DOC_ERROR: 'onOnceDocError',

	ON_PERIODICAL_DOC: 'onPeriodicalDoc',
	ON_PERIODICAL_DOC_ERROR: 'onPeriodicalDocError',

	ON_RANGE_DOC: 'onRangeDoc',
	ON_RANGE_DOC_ERROR: 'onRangeDocError',

	ON_PERIODICAL_REQUESTS_UPDATED: 'onPeriodicalRequestsUpdated',

	options: {

	},

	initialize: function(options){

		this.setOptions(options);

	},
	install: function (Vue, options) {
		console.log('installing....', Vue)

	},
	connect: function(){
		console.log('connect')
		// Vue.use(this)
		// Vue.$watch('$store.state.stats.colo.os.cpu', function(old, val){
		// 	console.log('$store.state.stats.colo.os.cpu', val)
		// })
		Vue.component('input-vue-watcher', {
		  data: function () {
		    return {
		      count: 0
		    }
		  },
			beforeCreate: function(){
				console.log('input-vue-watcher')
			},
		  template: '<div></div>'
		})
	},

	dispatch_range: function(req, app, app_req, type){

		return this.dispatch(req, app, app_req, type);
	},
	dispatch: function(req, app, app_req, type){

	},


})
