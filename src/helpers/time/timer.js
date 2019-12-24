import { requestLogger } from 'the-browser-logger'
import { Time, Type } from 'helpers/time/TimeConstants'

/**
 * Max value for a timer (one week, it cannot be larger than 24 days (32 bit integer representation)).
 * @type {Number}
 */
const MAX_TIMER_VALUE = Time.WEEK

const _getLogger = () => {
  return requestLogger('timer')
}

/**
 * Timer that wrappers setInterval, clearInterval, setTimeout and clearTimeout
 * and stores automatically the handles generated
 * @param {String} timerType
 * @returns {Object}
 */
function Timer(timerType) {
  let hash = {},
    hashSourceTimers = {}
  const type = timerType

  /**
   * Returns the uniqueId generated from sourceName and timerName
   * @private
   * @param {String} sourceName of the module
   * @param {String} timerName of the interval or timeout
   * @returns {String}
   */
  function _getUniqueId(sourceName, timerName) {
    return sourceName + '-' + timerName
  }

  /**
   * @private
   * Clears the interval
   * @param {String} value
   */
  function _clear(value) {
    if (type === Type.INTERVAL) {
      clearInterval(hash[ value ])
    } else {
      clearTimeout(hash[ value ])
    }

    hash[ value ] = null
  }
  /**
   * Clears the interval
   * @param {String} sourceName
   * @param {String} timerName
   */
  function clear(sourceName, timerName) {
    const uniqueId = _getUniqueId(sourceName, timerName)
    if (hash[ uniqueId ]) {
      _clear(uniqueId)

      const timers = hashSourceTimers[ sourceName ]
      timers.splice(timers.indexOf(uniqueId), 1)
      if (!timers.length) {
        hashSourceTimers[ sourceName ] = null
      }
    }
  }

  /**
   * Sets a new interval
   * @param {String} sourceName
   * @param {String} timerName
   * @param {Function} callback
   * @param {Number} time
   */
  function set(sourceName, timerName, callback, time) {
    if (typeof time === 'number' && !isNaN(time)) {
      const uniqueId = _getUniqueId(sourceName, timerName)
      _clear(uniqueId)
      if (time > MAX_TIMER_VALUE) {
        DEBUG && _getLogger().error('Cannot set a timer bigger than', MAX_TIMER_VALUE)
        time = MAX_TIMER_VALUE
      }
      if (type === Type.INTERVAL) {
        if (time === 0) {
          DEBUG && _getLogger().error('Cannot set an interval with time 0.', sourceName, timerName)
        } else {
          hash[ uniqueId ] = setInterval(callback, time)
        }
      } else {
        hash[ uniqueId ] = setTimeout(() => {
          _clear(uniqueId)
          callback()
        }, time)
      }
      hashSourceTimers[ sourceName ] = hashSourceTimers[ sourceName ] || []
      hashSourceTimers[ sourceName ].push(uniqueId)
    } else {
      DEBUG && _getLogger().error('Cannot set timer without a valid time.', type, sourceName, timerName, time)
    }
  }

  /**
   * Returns if the interval exists
   * @param {String} sourceName
   * @param {String} timerName
   * @returns {Boolean}
   */
  function has(sourceName, timerName) {
    return !!hash[ _getUniqueId(sourceName, timerName) ]
  }

  /**
   * Clears timers for an specific source
   * @param {any} sourceName
   */
  function clearSource(sourceName) {
    if (hashSourceTimers[ sourceName ]) {
      hashSourceTimers[ sourceName ].forEach((key) => {
        _clear(key)
      })
      hashSourceTimers[ sourceName ] = null
    }
  }

  /**
   * Clears all the hash
   */
  function clearAll() {
    Object.keys(hash).forEach((key) => {
      _clear(key)
    })
    hash = {}
    hashSourceTimers = {}
  }

  return {
    set,
    has,
    clear,
    clearAll,
    clearSource,
  }
}

const timeout = new Timer(Type.TIMEOUT),
  interval = new Timer(Type.INTERVAL)

/**
 * Resets all the timeouts and hash
 */
function __reset() {
  timeout.clearAll()
  interval.clearAll()
}

export {
  timeout,
  interval,
  __reset,
}
