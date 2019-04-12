'use strict'

import cron from 'node-cron'

import DefaultConn from '@etc/default.conn'

import InputPollerCouchDBOS from '@libs/input/poller/couchdb.os'

import decompress from 'node-mngr-worker/etc/snippets/filter.zlib.decompress'

import store from 'src/store'

import sizeof from 'object-sizeof'

let os = {
	mounts: {
		type: /ext.*/ //filter mounts
	}
}

export default {
	input: [
		{
			poll: {
				suspended: true,//start suspended
				id: "input.os",
				conn: [
          Object.merge(
            Object.clone(DefaultConn),
            {
              path_key: 'os',
              module: InputPollerCouchDBOS,
            }
          )
				],
				connect_retry_count: 5,
				connect_retry_periodical: 1000,
				// requests: {
				// 	periodical: 1000,
				// },
				requests: {
    			periodical: function(dispatch){
						// ////console.log('host periodical running')
    				return cron.schedule('* * * * * *', dispatch);//every second
    			}
    		},
			},
		}
	],
	filters: [
		// decompress,
		function(doc, opts, next){
			console.log('sizeof', sizeof(doc))
			console.log('host.template.filter', doc)

			let paths = /^os.*/

			// if(doc != null
			// 	&& ( (opts.type == 'periodical' && doc.metadata.path == 'os')
			// 	|| ( opts.type == 'range' && doc[0] && doc[0].doc.metadata.path == 'os') )
			// )
			if(doc != null
				&& ( (opts.type == 'periodical' && paths.test(doc.metadata.path) )
				|| ( opts.type == 'range' && doc[0] && paths.test(doc[0].doc.metadata.path) ))
			)
			{
				/**
				* filter os.mounts to reduce mem consumption
				*/
				if(
					(opts.type == 'periodical' && doc.metadata.path == 'os.mounts')
					|| ( opts.type == 'range' && doc[0] && doc[0].doc.metadata.path == 'os.mounts')
				){

					if(opts.type == 'periodical'){
						let data = Array.clone(doc.data)
						doc.data = data.filter(function(item, index){

					    return os.mounts.type.test(item.type);
						});
					}
					else{
						Array.each(doc, function(row, index){
							let data = Array.clone(row.doc.data)
							row.doc.data = data.filter(function(item, index){

						    return os.mounts.type.test(item.type);
							});
						})
					}

				}
				/**
				* filter os.blockdevices to reduce mem consumption
				*/
				else if(
					(opts.type == 'periodical' && doc.metadata.path == 'os.blockdevices')
					|| ( opts.type == 'range' && doc[0] && doc[0].doc.metadata.path == 'os.blockdevices')
				){
					if(opts.type == 'periodical'){

						Object.each(doc.data, function(value, item){
							delete doc.data[item].partitions
						})
					}
					else{
						Array.each(doc, function(row, index){
							Object.each(row.doc.data, function(value, item){
								delete row.doc.data[item].partitions
							})

						})
					}
				}
				/**
				* filter os (networkInterfaces) to reduce mem consumption
				*/
				else if(
					(opts.type == 'periodical' && doc.metadata.path == 'os')
					|| ( opts.type == 'range' && doc[0] && doc[0].doc.metadata.path == 'os')
				){

					if(opts.type == 'periodical'){
						Object.each(doc.data.networkInterfaces, function(value, item){
							delete doc.data.networkInterfaces[item].if
						})
					}
					else{
						Array.each(doc, function(row, index){
							Object.each(row.doc.data.networkInterfaces, function(value, item){
								delete row.doc.data.networkInterfaces[item].if
							})

						})
					}

				}



				next(doc)
			}

		},
	],
	output: [
		function(doc){
			console.log('sizeof', sizeof(doc))

      // doc = JSON.decode(doc)
			// store.commit('app/doc', {type: 'os', 'value': doc})

			// ////console.log('InputPollerCouchDBOS output', doc)

      // let type = doc.type
      // EventBus.$emit(type, doc)
			EventBus.$emit('os', doc)
		}
	]
}
