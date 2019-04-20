'use strict'

import { EventBus } from 'boot/eventbus'
import InputIOHost from '@libs/input/poller/io.host'

// import DefaultConn from '@etc/default.io'

import store from 'src/store'

// let buffer = {}

import * as Debug from 'debug'

const debug = Debug('mngr-ui:libs:pipelines:host')
// debug_internals = Debug('mngr-ui:libs:pipelines:host:Internals'),
// debug_events = Debug('mngr-ui:libs:pipelines:host:Events')

let buffer = {
  data: [],
  expire: 0
}

const BUFFER_EXPIRE_TIME = 1000

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

      if (!payload.err) { EventBus.$emit('host', payload) }
    }
  ]
}
