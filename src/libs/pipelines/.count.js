'use strict'

// import Vue from 'vue'
// const EventBus = new Vue()

import InputPollerCouchDBCount from '@libs/input/poller/couchdb.count'

import DefaultConn from '@etc/default.conn'

import store from 'src/store'

// let buffer = {}

export default  {
	input: [
		{
			poll: {
				id: "input.count.docs",
				conn: [
          Object.merge(
            Object.clone(DefaultConn),
            {
              id: 'input.count.docs',
              module: InputPollerCouchDBCount,
            }
          )

				],
				connect_retry_count: 5,
				connect_retry_periodical: 1000,
				requests: {
					periodical: 10000,
				},
			},
		},

	],
	// filters: [
	// 	function(doc, opts, next){
  //
	// 		// console.log('search_pipeline ', doc)
  //
	// 		buffer = Object.merge(buffer, doc.data)
  //
	// 		if(buffer.hosts && buffer.paths){
	// 			next(buffer)
	// 			buffer = {}
	// 		}
	// 	}
	// ],
	output: [
		function(doc){


			// doc = JSON.decode(doc)

			// console.log(doc)
			store.commit('app/doc', {type: 'count', 'value': doc.data})

			// if(typeof EventBus !== 'undefined')
			// 	EventBus.$emit('count', doc)


		}
	]
}
