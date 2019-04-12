'use strict'

// const App = require ( '../../node_modules/node-app-couchdb-client/index' )
const App = require ( 'node-app-socket.io-client/index' )


import store from 'src/store'

export default new Class({
  Extends: App,

  types: ['count', 'hosts', 'paths'],
  recived: [],

  options: {

  	requests : {
      once: [
        // {
				// 	search_hosts: function(req, next, app){
        //     ////console.log('search_hosts', next)
        //
				// 		// next(
        //     app.view({
				// 			uri: app.options.db,
        //       args: [
        //         'search',
        //         'hosts',
        //         {
        //           //limit: 1,
        //           reduce: true, //avoid geting duplicate host
        //           group: true,
        //
  			// 				}
        //       ]
				// 		})
        //     // )
				// 	}
				// },
        // {
				// 	search_paths: function(req, next, app){
        //     ////console.log('search_hosts', next)
        //
				// 		// next(
        //     app.view({
				// 			uri: app.options.db,
        //       args: [
        //         'search',
        //         'paths',
        //         {
        //           //limit: 1,
        //           reduce: true, //avoid geting duplicate host
        //           group: true,
        //
  			// 				}
        //       ]
				// 		})
        //     // )
				// 	}
				// },

			],
			periodical: [
        // {
				// 	search_hosts: function(req, next, app){
        //     ////console.log('search_hosts', next)
        //
				// 		// next(
        //     app.view({
				// 			uri: app.options.db,
        //       args: [
        //         'search',
        //         'hosts',
        //         {
        //           //limit: 1,
        //           reduce: true, //avoid geting duplicate host
        //           group: true,
        //
  			// 				}
        //       ]
				// 		})
        //     // )
				// 	}
				// },
        // {
				// 	search_paths: function(req, next, app){
        //     ////console.log('search_hosts', next)
        //
				// 		// next(
        //     app.view({
				// 			uri: app.options.db,
        //       args: [
        //         'search',
        //         'paths',
        //         {
        //           //limit: 1,
        //           reduce: true, //avoid geting duplicate host
        //           group: true,
        //
  			// 				}
        //       ]
				// 		})
        //     // )
				// 	}
				// },

			],

		},

    io: {
			middlewares: [], //namespace.use(fn)
			// rooms: ['root'], //atomatically join connected sockets to this rooms
			routes: {
				'app.doc': [{
					// path: ':param',
					// once: true, //socket.once
					callbacks: ['app_doc'],
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

  app_doc: function(socket, next){
    if(this.recived.length < this.types.length){
      let docs = arguments[2]
      console.log('app_doc...', docs)
      if(docs && docs.type){
        docs = [docs]
        // store.commit('app/doc', doc)
      }
      Array.each(docs, function(doc){
        if(doc && doc.type){
          this.fireEvent('onPeriodicalDoc', [doc, {type: 'periodical', input_type: this, app: null}]);
          if(this.types.contains(doc.type) && !this.recived.contains(doc.type))
            this.recived.push(doc.type)

          store.commit('app/doc', doc)
        }
      }.bind(this))
    }


    // if(this.recived.length == this.types.length)
    //   this.io.close()

		// arguments[1]()
		// this.io.to('root').emit('response', 'a new user has joined the room saying '+arguments[2]);
		// next(socket)
	},

  // socket: function(socket){
  //   console.log('node-app-socker.io-client/socket')
  //   this.parent(socket)
  //
  //   socket.emit('get')
  // },
  initialize: function(options){
		this.parent(options);//override default options

		this.profile('root_init');//start profiling


    this.addEvent('onConnect', function(){
      console.log('node-app-socker.io-client/socket')
      this.io.emit('get')
    })

    this.addEvent('onExit', function(){
      //console.log('EXITING...')

      if(this.io.disconnected == false)
        this.io.close()
    })

		this.profile('root_init');//end profiling

		this.log('root', 'info', 'root started');
  },
  // initialize: function(options){
  //   console.log('Input/Poller/App %o');
  //
  //   this.addEvent(this.ON_CONNECT, function(socket){
	// 		console.log('this.ON_CONNECT');
	// 		first_connect(socket);
	// 	});
  //
	// 	this.addEvent(this.ON_CONNECT, function(){this.removeEvent(this.ON_CONNECT, first_connect)});
  //
  //
	// 	this.parent(options);//override default options
  //
	// 	this.profile('socket.io_init');//start profiling
  //
	// 	var first_connect = function(socket){
	// 		console.log('first_connect %o', this.io);
  //
	// 		//console.log('Socket.ioPoll.ON_CONNECT');
	// 		//console.log(result);
  //
	// 		/**
	// 		 * test for a P|CouchDB
	// 		 *
	// 		 * */
	// 		//var db = new RegExp(/(p|c)ouchdb/g);
	// 		//if(db.test(result.body)){
	// 			//options.id = JSON.decode(result.body).uuid;
	// 			//return new Socket.ioPoll(options);
	// 		//}
	// 		///**
	// 		 //* test for a P|CouchDB
	// 		 //*
	// 		 //* */
	// 		//else{
	// 			//this.options.id = JSON.decode(result).uuid;//set ID
	// 			// this.options.id = result.response.uuid;
  //       //
	// 			// if(Array.isArray(this.options.load)){
	// 			// 	Array.each(this.options.load, function(app){
	// 			// 		this.load(path.join(process.cwd(), app));
	// 			// 	}.bind(this));
	// 			// }
	// 			// else if(this.options.load){
	// 			// 	this.load(path.join(process.cwd(), this.options.load));
	// 			// }
  //
	// 			//this.addEvent(this.ON_USE_APP, function(mount, app){
	// 				//debug_events('this.ON_USE_APP %o', app);
  //
	// 				//app.addEvent(app.ON_CONNECT_ERROR, function(err){
  //
	// 					//debug_events('app.ON_CONNECT_ERROR %o', err);
  //
	// 					//this.fireEvent(this.ON_CONNECT_ERROR, err);
	// 				//}.bind(this))
	// 			//}.bind(this))
  //
	// 			//this.load(path.join(__dirname, '../../../../../apps'));
	// 		//}
  //
	// 	}.bind(this);
  //
  //
	// 	//this.addEvent('onRange', function(req){
	// 		////console.log('crale client->onRange');
	// 	//});
  //
	// 	this.profile('socket.io_init');//end profiling
  //
	// 	this.log('socket.io', 'info', 'socket.io started');
  // },

  // connect: function(){
	// 	// // ////////console.log('this.connect');
  //   //
	// 	// try{
	// 	// 	//this.os.api.get({uri: 'hostname'});
	// 	// 	//this.get({uri: '/'}, this._first_connect.bind(this));
	// 	// 	this.request(
  //   //     {
  //   //       opts: {
  //   //         path: '/'
  //   //       }
  //   //     },
  //   //     this._first_connect.bind(this)
  //   //   );
  //   //
	// 	// }
	// 	// catch(e){
	// 	// 	////////console.log(e);
	// 	// }
	// },
	// _first_connect: function(err, result, body, opts){
	// 	// // //////console.log('first_connect %o', result.uuid);
	// 	// this.options.id = 'hosts-'+result.uuid;//set ID
  //   //
  //   // // this.fireEvent('ON_RANGE', {})
	// }

});
