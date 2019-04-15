
// import PouchDB from 'pouchdb-browser'

import Deque from 'double-ended-queue'
import queue from 'async/queue'

let qBulkDocs = queue(function (task, callback) {
  task.db.bulkDocs(task.docs)
    .then(function (status) {
      callback(undefined, status)
    }).catch(function (err) {
      callback(err)
    })
}, 1)

// let qAdd = queue(function(task, callback) {
//   callback('add',task)
// }, 1)

const QUEUE_SIZE = 60 // os = 4 docs...1200 = 300 secs of docs

// let deque = undefined

// let db = undefined

let get_queue = function ({ state, commit }, arr) {
  if (arr) {
    commit('queue', new Deque(arr))
  } else if (!state.queue) {
    commit('queue', new Deque())
  }

  return state.queue

  // if(!deque && arr){
  //   deque = new Deque(arr)
  // }
  // else if(!deque){
  //   deque = new Deque()
  // }
  //
  //
  // return deque
}

// let get_db = function(payload){
//   let {root, path, key, type} = payload
//   if(!db)
//     db = new PouchDB(type+'_'+root+'_'+path+'_'+key)
//
//   console.log('get_db', type+'_'+root+'_'+path+'_'+key)
//   return db
//
// }

// let close_db = function(db, cb){
//   // let {root, path, key, type} = payload
//
//   if(db)
//     db.close(() => {db = undefined; cb()})
//
// }

let get_payload = function (payload, state) {
  payload = payload || {}
  payload.root = payload.root || state.root
  payload.path = payload.path || state.path
  payload.key = payload.key || state.key
  payload.type = payload.type || state.type

  return payload
}

export const get = ({ state, commit, dispatch }, payload) => {
  payload = get_payload(payload, state)
  // console.log('ACTIONS get', payload)

  // let db = get_db(payload)
  let deque = get_queue({ state: state, commit: commit })

  /// / ////////console.log('action get...')

  return new Promise((resolve, reject) => {
    let length = payload.length || deque.length
    let range = payload.range || []
    let docs = []

    if (deque.length > 0) {
      let arr = deque.toArray()
      /// ///// ////////console.log('fetching deque.length', deque.length, arr)
      // let reg = new RegExp(payload.path+'\/'+payload.host)
      while (length > 0 && arr.length > 0) {
        // //////// ////////console.log('fetching while...', length)
        let doc = arr.pop()
        // delete doc._rev
        if (doc._id.indexOf(payload.path + '/' + payload.key) > -1) {
          /// /// ////////console.log('DOC', doc, (doc.metadata.timestamp > range[0] && doc.metadata.timestamp < range[1]))
          if (
            payload.range && (doc.metadata.timestamp > range[0] && doc.metadata.timestamp < range[1]) ||
            !payload.range
          ) {
            // if(doc.metadata.timestamp > range[0])
            //   range[0] = doc.metadata.timestamp

            docs[length - 1] = doc
            length--
          }
        }
      }
    }

    /// /// ////////console.log('fetching doc', docs, range)

    if (length > 0 || payload.range) { // from db
      let _do_all_docs = function () {
        console.log('_do_all_docs')

        let options = {
          startkey: payload.path + '/' + payload.key + '\ufff0',
          endkey: payload.path + '/' + payload.key,
          inclusive_end: true,
          descending: true,
          include_docs: true
        }

        if (payload.length) {
          options.limit = length
        }

        if (payload.range) {
          // let range = payload.range
          options.startkey = payload.path + '/' + payload.key + '@' + range[1] + '\ufff0'
          options.endkey = payload.path + '/' + payload.key + '@' + range[0]
        }

        state.db.allDocs(options).then(function (res) {
          // console.log('OPTIONS', options, res, length)

          res.rows.reverse()
          while (length > 0 && res.rows.length > 0) {
            /// ///// ////////console.log('fetching while...', length)
            docs[length] = res.rows.pop().doc
            length--
          }

          docs.sort(function (a, b) {
            return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0)
          })
          // // ////////console.log('fetching from db', docs)
          resolve(Array.clean(docs))
        }).catch(function (err) {
          /// ///// ////////console.log('fetching from db err', err)
          docs.sort(function (a, b) {
            return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0)
          })
          resolve(Array.clean(docs))
        })
      }

      if (typeOf(state.db.find) == 'function') {
        state.db.getIndexes().then(function (result) {
          // handle result
          let found = false
          Array.each(result.indexes, function (index) {
            if (index.ddoc == '_design/mango_search' && index.name == 'timestamp') {
              found = true
            }
          })

          if (found == true) {
            let query = {
              selector: {
                // 'metadata.host': payload.root,
                'metadata.timestamp': { '$gte': range[0], '$lte': range[1] }
              },
              // sort: [{"metadata.timestamp": "asc"}],
              use_index: ['mango_search', 'timestamp']
            }
            console.log('db.find', query)

            state.db.find(query).then(function (res) {
              // console.log('db.find result', Array.clone(res.docs))
              res.docs.reverse()
              while (length > 0 && res.docs.length > 0) {
                /// ///// ////////console.log('fetching while...', length)
                docs[length] = res.docs.pop()
                length--
              }

              docs.sort(function (a, b) {
                return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0)
              })

              console.log('resolving docs', docs)

              resolve(Array.clean(docs))
            })
          } else {
            _do_all_docs()
          }
        }).catch(function (err) {
          console.log('getIndexes', err)
          _do_all_docs()
        })
      } else {
        _do_all_docs()
      }
    } else {
      if (docs.length > 0) {
        docs.sort(function (a, b) {
          return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0)
        })
      }
      resolve(docs)
      // docs.sort(function(a,b) {
      //   return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0)
      // })
      // resolve(docs)
    }

    // setTimeout(() => {
    //   // commit('someMutation')
    //   //////// ////////console.log('stats get')
    //   resolve()
    // }, 1000)
  })
}

export const add = ({ state, commit, dispatch }, payload) => {
  payload = get_payload(payload, state)
  // //console.log('ACTIONS add', payload)
  // let deque = get_queue(payload)
  let deque = get_queue({ state: state, commit: commit })

  if (Array.isArray(payload.data) && payload.data.length > 1) {
    // firts sort data by timestamp
    payload.data.sort(function (a, b) { return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0) })

    Array.each(payload.data, function (data, index) {
      let doc = new Object()
      doc._id = payload.path + '/' + payload.key + '@' + data.timestamp
      doc.data = data.value
      doc.metadata = new Object()
      doc.metadata.timestamp = data.timestamp
      doc.metadata.host = payload.root
      doc.metadata.path = payload.path + '/' + payload.key
      // doc.metadata.key = payload.key
      doc.metadata.type = 'periodical'
      // docs.push(doc)
      // if(deque.isEmpty() || deque.peekBack().metadata.timestamp < doc.metadata.timestamp)
      deque.push(doc)
    })

    // qAdd.push({
    //   tabular: payload.tabular,
    //   host: payload.host,
    //   path:payload.path,
    //   key:payload.key,
    //   data: {
    //     timestamp: deque.peekBack().metadata.timestamp,
    //     value: deque.peekBack()
    //   }
    // }, commit)

    // commit('add', {
    //   tabular: payload.tabular,
    //   host: payload.host,
    //   path:payload.path,
    //   key:payload.key,
    //   data: {
    //     timestamp: deque.peekBack().metadata.timestamp,
    //     value: deque.peekBack()
    //   }
    // })
  } else {
    if (Array.isArray(payload.data)) { payload.data = payload.data[0] }

    let doc = new Object()
    doc._id = payload.path + '/' + payload.key + '@' + payload.data.timestamp
    doc.data = payload.data.value
    doc.metadata = new Object()
    doc.metadata.timestamp = payload.data.timestamp
    doc.metadata.host = payload.root
    doc.metadata.path = payload.path + '/' + payload.key
    // doc.metadata.key = payload.key
    doc.metadata.type = 'periodical'

    // if(deque.isEmpty() || deque.peekBack().metadata.timestamp < doc.metadata.timestamp){
    deque.push(doc)

    // deque.push(doc)
    // qAdd.push({
    //   tabular: payload.tabular,
    //   host: payload.host,
    //   path:payload.path,
    //   key:payload.key,
    //   data: {
    //     timestamp: doc.metadata.timestamp,
    //     value: doc
    //   }
    // }, commit)

    // commit('add', {
    //   tabular: payload.tabular,
    //   host: payload.host,
    //   path:payload.path,
    //   key:payload.key,
    //   data: {
    //     timestamp: doc.metadata.timestamp,
    //     value: doc
    //   }
    // })
    //
    // }
  }

  if (deque.length >= QUEUE_SIZE) {
    /// /console.log('actions add FLUSH', deque.length)
    payload.remaing = 0 // QUEUE_SIZE
    dispatch('flush', payload)
  }
}

export const flush = ({ state, commit, dispatch }, payload) => {
  payload = get_payload(payload, state)

  // console.log('ACTIONS flush', payload)

  // payload.type = state.type
  // let db = get_db(payload)

  let length = payload.remaing
  // let deque = get_queue(payload)
  let deque = get_queue({ state: state, commit: commit })

  // ////////console.log('action flushing...', payload.host, payload.path, payload.key)

  if (deque.isEmpty() !== true) {
    let docs = Array.clone(deque.toArray())
    deque.clear()

    docs.sort(function (a, b) {
      return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0)
    })

    let deque_arr = []
    if (length && length > 0) {
      while (length > 0) {
        // let doc = docs.pop()
        deque_arr.unshift(docs.pop())
        length--
      }

      deque_arr = deque_arr.clean()
    }

    // deque = get_queue(payload, deque_arr)
    deque = get_queue({ state: state, commit: commit }, deque_arr)

    /// /////console.log('action flushing...', length, payload.host, payload.path, payload.key,docs, deque.toArray())

    // db.flushing = true

    // qBulkDocs.push({docs: docs, db: state.db}, function(err, status){
    //   // console.log('qBulkDocs', err, status)
    // })

    state.db.bulkDocs(docs)
      .then(function (status) {
      // console.log('flushed', status)
      // commit('clear', payload)
      // db.flushing = false
      }).catch(function (err) {
      /// /////console.log('flushed err', err)
      })
  }
}

export const splice = ({ commit, state }, payload) => {
  payload = get_payload(payload, state)

  // console.log('ACTIONS splice', payload)

  payload.type = state.type
  let db = get_db(payload)
  let length = payload.length
  // let deque = get_queue(payload)

  let options = {
    // startkey: payload.host+'/'+payload.path+'/'+payload.key+'\ufff0',
    // endkey: payload.host+'/'+payload.path+'/'+payload.key,
    // limit: length,
    inclusive_end: true,
    descending: true,
    include_docs: true
  }

  if (payload.length) {
    options.limit = length
  }

  if (payload.range) {
    let range = payload.range
    options.startkey = payload.root + '/' + payload.path + '/' + payload.key + '@' + range[1] + '\ufff0'
    options.endkey = payload.root + '/' + payload.path + '/' + payload.key + '@' + range[0]
  }

  /// /// ////////console.log('OPTIONS', options)

  db.allDocs(options).then(function (res) {
    // ////////console.log('splice fetching res', res)

    res.rows.reverse()

    db.destroy().then(function (status) {
      // ////////console.log('splice destroy res', status)
      // db.close()
      // db = new PouchDB('live_'+payload.host)
      close_db(db, () => {
        // db = get_db(payload.host)
        // payload.type = state.type
        db = get_db(payload)

        // ////////console.log('splice DOCS', res.rows)

        db.bulkDocs(res.rows)
          .then(function (status) {
          // ////////console.log('splice bulkDocs status', status)

          }).catch(function (err) {
          // ////////console.log('splice bulkDocs err', err)

          })
      })
    }).catch(function (err) {
      // ////////console.log('splice destroy err', err)
    })
    // while (length > 0 && res.rows.length > 0){
    //   //////// ////////console.log('fetching while...', length)
    //   docs[length] = res.rows.pop().doc
    //   length--
    // }
    //
    //
    //
    // docs.sort(function(a,b) {
    //   return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0)
    // })
    // // // ////////console.log('fetching from db', docs)
    // resolve(Array.clean(docs))
  }).catch(function (err) {
    // ////////console.log('splice fetching from db err', err)
    // docs.sort(function(a,b) {
    //   return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0)
    // })
    // resolve(Array.clean(docs))
  })
}

// export const splice = ({ commit, state }, payload) => {
//   //// ////////console.log('action splice', payload)
//   // let spliced = state[payload.host][payload.path][payload.key]
//   let _id = payload.host+'/'+payload.path+'/'+payload.key
//
//   //////// ////////console.log('splice', state[payload.host][payload.path][payload.key].length)
//
//   db.allDocs({
//     // startkey: spliced.split('@')[0],
//     // endkey: spliced.split('@')[0]+'\ufff0'
//     startkey: _id,
//     endkey: _id+'\ufff0'
//   }).then(function (result) {
//     //////// ////////console.log('allDocs result', result);
//     // // handle result
//
//     let deleted = []
//
//     Array.each(result.rows, function(row){
//       // //////// ////////console.log('result', row);
//       let doc = {}
//       if(!_id.contains(row.id)){
//         doc['_deleted'] = true
//         doc['_id'] = row.id
//         doc['_rev'] = row.value.rev
//         deleted.push(doc)
//       }
//
//     })
//
//     //////// ////////console.log('to delete', deleted)
//     if(deleted.length > 0){
//       db.bulkDocs(deleted).then(function (result) {
//         //// ////////console.log('action bulkDocs delete result', result);
//
//         if(compacted === false){
//           compacted = true
//           db.compact().then(function (result) {
//             //// ////////console.log('action compact result ',result);
//             compacted = false
//           }).catch(function (err) {
//             //// ////////console.log('action  compact err ',err);
//           });
//         }
//
//       }).catch(function (err) {
//         //// ////////console.log('action  bulkDocs delete err', err);
//       });
//     }
//   }).catch(function (err) {
//     //// ////////console.log('action allDocs', err);
//   });
//
// }
