import { requestLogger } from 'the-browser-logger'
import { isString, isUndefined } from 'the-type-validator'
import values from 'lodash/values'

/**
 * BroadcastBase class for sending emits among different modules
 * @return {Object}
 */
class BroadcastBase {
  constructor() {
    this._id = 'Broadcast'
    this.emits = {}
    this.broadcastCallbacks = {}
    this.publishing = {
      emit: null,
      callbacks: null,
    }
  }

  /**
   * Logger method
   * @returns {String}
   */
  _getLogger() {
    return requestLogger(this._id)
  }

  /**
   * @param {*} callbacks
   * @param {*} callback
   * @param {*} arg
   * @returns {*}
   */
  _indexOfCallback(callbacks, callback, arg) {
    let ret = -1
    for (let i = 0, len = callbacks.length; i < len; i++) {
      if (callbacks[ i ].callback === callback &&
          (!arg || !callbacks[ i ].arg || callbacks[ i ].arg === arg)) {
        ret = i
        break
      }
    }
    return ret
  }

  /**
   * Remove an item from the callbacks array
   * @param {Array} callbacks
   * @param {Function} callback
   * @param {Object?} arg
   */
  _removeFromCallbacks(callbacks, callback, arg) {
    if (callbacks) {
      const index = this._indexOfCallback(callbacks, callback, arg)
      if (index >= 0) {
        callbacks.splice(index, 1)
      }
    }
  }

  /**
   * @param {*} param0
   * @param {*} data
   * @param {*} emit
   * @param {*} source
   */
  _executeCallback({ arg, callback }, data, emit, source) {
    try {
      if (arg) {
        callback.call(arg, data, {
          emitName: emit,
          source: source,
        })
      } else {
        callback(data, {
          emitName: emit,
          source: source,
        })
      }
    } catch (e) {
      DEBUG && this._getLogger().error('_executeCallback()', emit, e)
    }
  }

  /**
   * @param {Array} callbacks
   * @param {Object} data
   * @param {String} emit
   * @param {String} source
   */
  _executeCallbacks(callbacks, data, emit, source) {
    for (let i = 0; i < callbacks.length; i++) {
      if (callbacks[ i ]) {
        this._executeCallback(callbacks[ i ], data, emit, source)
      }
    }
  }

  /**
   * Creates an id based on two strings
   * @param {String} emitName
   * @param {String} sourceName
   * @return {String}
   */
  _getCallbackId(emitName, sourceName) {
    let ret = emitName
    if (sourceName) {
      ret += '-' + sourceName
    }
    return ret
  }

  /**
   * @param {*} arg
   * @param {*} emit
   * @param {*} callback
   * @param {*} source
   * @returns {*}
   */
  _subscribe(arg, emit, callback, source) {
    if (!this.emits[ emit ]) {
      this.emits[ emit ] = {
        AllSources: [],
      }
    }
    if (!this.emits[ emit ][ source ]) {
      this.emits[ emit ][ source ] = []
    }
    if (this._indexOfCallback(this.emits[ emit ].AllSources, callback, arg) === -1 &&
      this._indexOfCallback(this.emits[ emit ][ source ], callback, arg) === -1) {
      this.emits[ emit ][ source ].push({
        arg,
        callback,
      })
    }
    return emit
  }

  /**
   * Subscribe to emit
   * @param {Object=} arg
   * @param {String} emit
   * @param {Function} callback
   * @param {String=} source
   * @returns {String} emit
   */
  subscribe(...args) {
    let arg,
      emit,
      callback,
      source

    if (isString(args[ 0 ])) {
      [emit, callback, source] = args
    } else {
      [arg, emit, callback, source] = args
    }
    arg = arg || null
    source = source || 'AllSources'

    if (isString(emit)) {
      DEBUG && this._getLogger().debug('subscribe()', emit, source, arg ? arg.UID : '')
      this._subscribe(arg, emit, callback, source)
    } else {
      DEBUG && this._getLogger().error('subscribe() wrong parameters', args)
    }
    return emit
  }

  /**
   * Unsubscribe from emit
   * @param {Object=} arg
   * @param {String} emit
   * @param {Function} callback
   */
  unsubscribe(...args) {
    let arg,
      emit,
      callback

    if (isString(args[ 0 ])) {
      [emit, callback] = args
    } else {
      [arg, emit, callback] = args
    }
    DEBUG && this._getLogger().debug('unsubscribe()', emit, arg ? arg.UID : '')
    if (this.emits[ emit ]) {
      for (const callbacks of values(this.emits[ emit ])) {
        this._removeFromCallbacks(callbacks, callback, arg)
      }
    }
    if (this.publishing.emit === emit && this.publishing.callbacks) {
      const i = this._indexOfCallback(this.publishing.callbacks, callback, arg)
      if (i >= 0) {
        this.publishing.callbacks[ i ] = null
      }
    }
  }

  /**
   * @param {String} emit
   * @return {Boolean}
   */
  hasSubscribers(emit) {
    return isUndefined(this.emits[ emit ])
  }

  /**
   * @param {String} emit
   * @param {Object} data
   * @param {String} source
   */
  publish(emit, data, source) {
    if (this.emits[ emit ]) {
      let callbacks
      const sources = ['AllSources']

      if (source) {
        sources.push(source)
      }
      DEBUG && this._getLogger().debug('publish()', emit, data, source)

      this.publishing.emit = emit
      for (let i = 0, srcLen = sources.length; i < srcLen; i++) {
        callbacks = this.emits[ emit ][ sources [ i ] ]
        if (callbacks && callbacks.length) {
          // Clone the array of callbacks, in case one subscriber is removed
          // during this operation, avoid other subscribers to get notified
          this.publishing.callbacks = callbacks.slice(0)
          this._executeCallbacks(this.publishing.callbacks, data, emit, source)
        }
      }
      this.publishing.emit = null
      this.publishing.callbacks = null
    } else if (DEBUG) {
      this._getLogger().debug('publish() Not publish, because there isn\'t any subscribers to', emit)
    }
  }

  /**
   * Resets local objects
   */
  __reset() {
    DEBUG && this._getLogger().debug('__reset()')
    this.emits = {}
    this.broadcastCallbacks = {}
    this.publishing = {
      emit: null,
      callbacks: null,
    }
  }
}

export default BroadcastBase
