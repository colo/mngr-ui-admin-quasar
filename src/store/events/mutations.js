
import Vue from 'vue'

export const add = function (state, payload) {
  let { id, type, opts } = payload
  let found = false
  Array.each(state.list, function (e, index) {
    if (e.id === id && e.type === type) {
      Vue.set(state.list, index, payload)
      found = true
    }
  })

  if (found === false) { state.list.push(payload) }
}

export const remove = function (state, payload) {
  // let {id, type, opts} = payload
  let found = false

  if (!Array.isArray(payload)) { payload = [payload] }

  let list = Array.clone(state.list)
  Array.each(state.list, function (e, index) {
    Array.each(payload, function (p, p_index) {
      let { id, type, opts } = p
      if (e.id === id && e.type === type) {
        // Vue.set(state.list, index, payload)
        // if(found === false) found = []
        //
        // found.push(index)
        list[index] = undefined
      }
    })
  })
  list = list.clean()
  Vue.set(state, 'list', list)
  // console.log('dashboard/events/remove', state.list)

  // if(found !=== false){
  //   let list = Array.clone(state.list)
  //   list[found] = undefined
  //   list = list.clean()
  //   console.log('dashboard/events/remove', found, list)
  //   Vue.set(state, 'list', list)
  // }
}

export const clean = function (state) {
  Vue.set(state, 'list', [])
}
