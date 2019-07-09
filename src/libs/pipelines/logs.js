'use strict'

// import InputIOApp from '@libs/input/poller/io.app'
import { EventBus } from 'boot/eventbus'

import InputIOLogs from '@libs/input/poller/io.logs'

// import DefaultConn from '@etc/default.io'

// const App = require ( 'node-app-socket.io-client/index' )
// let app_io = new App(DefaultConn)

let buffer = {}

import * as Debug from 'debug'

const debug = Debug('mngr-ui:libs:pipelines:logs')

export default {
  input: [
    {
      poll: {
        id: 'input.logs',
        conn: [

          Object.merge(
            // Object.clone(DefaultConn),
            {
              id: 'input.logs',
              module: InputIOLogs

            }
          )

        ],
        connect_retry_count: -1,
        connect_retry_periodical: 1000,
        requests: {
          periodical: 1000
        }
      }
    }

  ],
  output: [
    function (payload) {
      debug('OUTPUT', payload)

      if (!payload.err) { EventBus.$emit(payload.type, payload) }

      // if (!payload.err) { EventBus.$emit('log', payload) }
    }
  ]
}
