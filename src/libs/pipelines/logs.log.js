'use strict'

import { EventBus } from 'boot/eventbus'
import InputIOLog from '@libs/input/poller/io.logs.log'

// import DefaultConn from '@etc/default.io'

import store from 'src/store'

// let buffer = {}

import * as Debug from 'debug'

const debug = Debug('mngr-ui:libs:pipelines:logs.log')
// debug_internals = Debug('mngr-ui:libs:pipelines:logs.log:Internals'),
// debug_events = Debug('mngr-ui:libs:pipelines:logs.log:Events')

let buffer = {
  data: [],
  expire: 0
}

const BUFFER_EXPIRE_TIME = 1000

export default {
  input: [
    {
      poll: {
        suspended: true,
        id: 'input.os',
        conn: [
          Object.merge(
            // Object.clone(DefaultConn),
            {
              id: 'os',
              module: InputIOLog
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
  filters: [
    function (doc, opts, next, pipeline) {
      let { type, input, input_type, app } = opts

      if (buffer.expire === 0 || buffer.expire > Date.now() - BUFFER_EXPIRE_TIME) {
        buffer.data.push(doc)

        if (buffer.expire === 0) { buffer.expire = Date.now() }
      } else {
        // Array.each(Array.clone(buffer.data), function (doc) {
        //   next(doc, opts, next, pipeline)
        // })
        next(Array.clone(buffer.data), opts, next, pipeline)
        buffer.data = []
        buffer.expire = Date.now()
      }
    }

  ],
  output: [
    function (payload) {
      debug('OUTPUT', payload)

      // if (!payload.err) { EventBus.$emit(payload.type, payload) }

      if (!payload.err) { EventBus.$emit('logs.log', payload) }
    }
  ]
}
