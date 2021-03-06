import state from './state'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'

import events from '../events'

import source from '../source'

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
  modules: {
    events,
    stat_sources: source,
    tabular_sources: source
  }
}
