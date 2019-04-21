'use strict'

// import InputIOApp from '@libs/input/poller/io.app'
import { EventBus } from 'boot/eventbus'

import InputIOHosts from '@libs/input/poller/io.hosts'

// import DefaultConn from '@etc/default.io'

// const App = require ( 'node-app-socket.io-client/index' )
// let app_io = new App(DefaultConn)

let buffer = {}

import * as Debug from 'debug'

const debug = Debug('mngr-ui:libs:pipelines:hosts')

export default {
  input: [
    {
      poll: {
        id: 'input.hosts',
        conn: [

          Object.merge(
            // Object.clone(DefaultConn),
            {
              id: 'input.hosts',
              module: InputIOHosts

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

      // if (!payload.err) { EventBus.$emit('host', payload) }
    }
  ]
}
