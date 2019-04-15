import Vue from 'vue'
import Vuex from 'vuex'

import VuexPersistence from 'vuex-persist'

import app from './app'
import hosts from './hosts'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  // reducer: state => ({
  //   app: state.app, hosts : state.hosts, stats: state.stats
  // }), //only save app module
  modules: ['app']
})

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    plugins: [vuexLocal.plugin],
    modules: {
      app,
      hosts
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
