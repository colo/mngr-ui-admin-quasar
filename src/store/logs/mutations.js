import Vue from 'vue'

export const current = (state, log) => {
  state.current = log
}

/**
* @start all logs
**/
export const add = (state, log) => {
  state.all.push(log)
}

export const set = (state, logs) => {
  Array.each(logs, function (log) {
    if (!state.all.contains(log)) { state.all.push(log) }
  })
  Array.each(state.all, function (log) {
    if (!logs.contains(log)) { state.all.erase(log) }
  })
  // Vue.set(state, 'all', logs)
}

export const erase = (state, log) => {
  if (state.all.contains(log)) {
    let tmp_array = Array.clone(state.all)
    tmp_array.erase(log)
    Vue.set(state, 'all', tmp_array)
  }
}

export const clear = (state) => {
  Vue.set(state, 'all', [])
}
/**
* @end all logs
**/

export const clear_modules_blacklist = (state) => {
  Vue.set(state, 'modules_blacklist', {})
}

export const clear_modules_whitelist = (state) => {
  Vue.set(state, 'modules_whitelist', {})
}

export const erase_blacklist_module = (state, path) => {
  // Vue.set(state.modules_blacklist, payload.path, payload.list)
  delete state.modules_blacklist[path]
}

export const erase_whitelist_module = (state, payload) => {
  // Vue.set(state.modules_blacklist, payload.path, payload.list)
  // delete state.modules_blacklist[path]
  if (
    state.modules_whitelist[payload.path] &&
    state.modules_whitelist[payload.path].contains(payload.list)
  ) {
    let tmp_array = Array.clone(state.modules_whitelist[payload.path])
    tmp_array.erase(payload.list)
    Vue.set(state.modules_whitelist, payload.path, tmp_array)
  }
}

export const blacklist_module = (state, payload) => {
  Vue.set(state.modules_blacklist, payload.path, payload.list)
}

export const whitelist_module = (state, payload) => {
  if (!state.modules_whitelist[payload.path]) { Vue.set(state.modules_whitelist, payload.path, []) }

  state.modules_whitelist[payload.path].push(payload.list)
}
