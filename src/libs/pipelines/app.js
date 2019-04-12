'use strict'

// import InputIOApp from '@libs/input/poller/io.app'
import InputIOHosts from '@libs/input/poller/io.hosts'

// import DefaultConn from '@etc/default.io'

// const App = require ( 'node-app-socket.io-client/index' )
// let app_io = new App(DefaultConn)

let buffer = {}

export default  {
	input: [
		{
			poll: {
				id: "input.app",
				conn: [

          Object.merge(
            // Object.clone(DefaultConn),
            {
              id: 'input.hosts',
							module: InputIOHosts

            }
          )

				],
				// conn: [
        //     {
        //       id: 'input.hosts',
				// 			module: InputIOHosts,
        //     }
				// ],
				// connect_retry_count: 5,
				// connect_retry_periodical: 1000,
				requests: {
					periodical: 1000,
				},
			},
		},

	],
	// filters: [
	// 	function(doc, opts, next){
  //
	// 		// //console.log('search_pipeline ', doc)
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
		// function(doc){
		// 	console.log('app/doc output', doc)
		// 	if(doc && doc.type){
		// 		doc[doc.type] = doc
		// 		// store.commit('app/doc', doc)
		// 	}
		// 	Object.each(doc, function(doc){
		// 		if(doc && doc.type){
		// 			store.commit('app/doc', doc)
		// 		}
		// 	})
    //
		// }
	]
}
