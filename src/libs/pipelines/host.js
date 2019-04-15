'use strict'

import { EventBus } from 'boot/eventbus'
import InputIOHost from '@libs/input/poller/io.host'

// import DefaultConn from '@etc/default.io'

import store from 'src/store'

let buffer = {}

import * as Debug from 'debug'

const debug = Debug('mngr-ui:libs:pipelines:host'),
  debug_internals = Debug('mngr-ui:libs:pipelines:host:Internals'),
  debug_events = Debug('mngr-ui:libs:pipelines:host:Events')

export default {
  input: [
    {
      poll: {
        id: 'input.os',
        conn: [
          Object.merge(
            // Object.clone(DefaultConn),
            {
              id: 'os',
              module: InputIOHost
            }
          )

        ],
        // connect_retry_count: 5,
        // connect_retry_periodical: 1000,
        requests: {
          periodical: 1000
        }
      }
    }

  ],

  output: [
    function (payload) {
      debug_internals('OUTPUT', payload)

      if (!payload.err) { EventBus.$emit(payload.type, payload) }
    }
  ]
}
