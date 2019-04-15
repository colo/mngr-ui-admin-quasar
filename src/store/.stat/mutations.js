// import Vue from 'vue'

export const id = function (state, id) { // generic mutation
  state.root = id.split('.')[0]
  state.path = id.split('.')[1]
  state.key = id.split('.')[2]
  state.id = id
}

export const type = function (state, type) { // generic mutation
  state.type = type
}

export const db = function (state, db) { // generic mutation
  state.db = db
}

export const queue = function (state, queue) { // generic mutation
  state.queue = queue
}
//
// export const root = function(state, root) {//generic mutation
//   state.root = root
// }
//
// export const path = function(state, path) {//generic mutation
//   state.path = path
// }
// export const key = function(state, key) {//generic mutation
//   state.type = key
// }

// export const add = function(state, payload) {//generic mutation
//   //console.log('MUTATIONS add', payload)
//
//   let {host, path, key, data, tabular} = payload
//
//   let type = (tabular == true) ? 'tabular' : 'stat'
//
//   if(!state[host])
//     Vue.set(state, host, {})
//
//   if(!state[host][type])
//     Vue.set(state[host], type, {})
//
//
//   if(!state[host][type][path])
//     Vue.set(state[host][type], path, {})
//
//   if(!state[host][type][path][key])
//     Vue.set(state[host][type][path], key, undefined)
//
//
//   let value = undefined
//   if(Array.isArray(data)){
//     // Vue.set(state[host][path], key, value)
//
//     //get doc with highest timestamp
//     value = Math.max.apply(Math, data.map(function(o) { return o.timestamp; }))
//   }
//   else{
//     value = data
//   }
//   // else {
//   //   if(!state[host][path][key])
//   //     Vue.set(state[host][path], key, [])
//   //
//   //
//   // }
//
//   // Vue.set(state[host][path], key, value)
//   state[host][type][path][key] = value
// }

// export const clear = (state, payload) => {
//   let {host, path, key, tabular} = payload
//
//   let type = (tabular == true) ? 'tabular' : 'stat'
//   //////console.log('clear mutation')
//
//   if(!state[host])
//     Vue.set(state, host, {})
//
//   if(!state[host][type])
//     Vue.set(state[host], type, {})
//
//
//   if(!state[host][type][path])
//     Vue.set(state[host][type], path, {})
//
//   if(!state[host][type][path][key])
//     Vue.set(state[host][type][path], key, undefined)
//
// }
// //
// // export const splice = (state, payload) => {
// //
// //   if(state[payload.host]
// //     && state[payload.host][payload.path]
// //     && state[payload.host][payload.path][payload.key]
// //   ){
// //     let length = state[payload.host][payload.path][payload.key].length
// //     state[payload.host][payload.path][payload.key].splice(
// //       -payload.length -1,
// //       length - payload.length
// //     )
// //   }
// // }
