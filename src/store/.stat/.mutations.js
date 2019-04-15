import Vue from 'vue'

export const add = function(state, payload) {//generic mutation
  if(!state[payload.host])
    Vue.set(state, payload.host, {})

  if(!state[payload.host][payload.path])
    Vue.set(state[payload.host], payload.path, {})

  if(Array.isArray(payload.value)){
    Vue.set(state[payload.host][payload.path], payload.key, payload.value)
  }
  else {
    if(!state[payload.host][payload.path][payload.key])
      Vue.set(state[payload.host][payload.path], payload.key, [])

    state[payload.host][payload.path][payload.key].push(payload.value)
  }
}

export const clear = (state, payload) => {
  console.log('clear mutation')

  if(!state[payload.host])
    Vue.set(state, payload.host, {})

  if(!state[payload.host][payload.path])
    Vue.set(state[payload.host], payload.path, {})

  if(!state[payload.host][payload.path][payload.key])
    Vue.set(state[payload.host][payload.path], payload.key, [])


}

export const splice = (state, payload) => {

  if(state[payload.host]
    && state[payload.host][payload.path]
    && state[payload.host][payload.path][payload.key]
  ){
    let length = state[payload.host][payload.path][payload.key].length
    state[payload.host][payload.path][payload.key].splice(
      -payload.length -1,
      length - payload.length
    )
  }
}
