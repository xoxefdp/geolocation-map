import { isArray, isObject } from 'helpers/utilTypes'
import isPlainObject from 'lodash/isPlainObject'
import invert from 'lodash/invert'

const MAX_LINES_LOG_STRINGIFY = 20,
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warn',
  ERROR = 'error'

const Level = {
  DEBUG: 1,
  INFO: 2,
  WARNING: 3,
  ERROR: 4,
  BOT: 5,
  NONE: 6,
}

let hasToStringifyObjects = true

/**
 * Do a JSON.Stringify avoiding circular references
 *   obj = {a: 1, b: obj}
 *     => {a: 1}
 * @param {Object} value
 * @return {String}
 */
function stringifyFixingCycles(value) {
  const cache = new Map()
  return JSON.stringify(value, (k, v) => {
    if (typeof v === 'object' && v !== null) {
      if (cache.get(v)) {
        return // circular found, discard
      }
      cache.set(v, true)
    }
    return v
  }, 2)
}

function logStringify(method, value) {
  const lines = value.split('\n')
  for (let i = 0, len = Math.min(lines.length, MAX_LINES_LOG_STRINGIFY); i < len; i++) {
    console[ method ]('    ' + lines[ i ])
  }
  if (lines.length > MAX_LINES_LOG_STRINGIFY) {
    console[ method ]('    ...')
  }
}

function stringifyObjects(method, values) {
  let count = 0
  for (let i = 0, length = values.length; i < length; i++) {
    const value = values[ i ]
    if (isObject(value)) {
      if (isPlainObject(value) || isArray(value)) {
        const str = stringifyFixingCycles(value)
        console[ method ]('  [#' + count + ']:')
        logStringify(method, str)
      } else if (value.UID) {
        console[ method ]('  [#' + count + ']: <' + value.UID + '>')
      } else if (value._id) {
        console[ method ]('  [#' + count + ']: <' + value._id + '>')
      } else {
        console[ method ]('  [#' + count + ']: ' + value)
      }
      ++count
    }
  }
}

function getLogSummary(values) {
  const ret = []
  if (values) {
    let count = 0
    for (let i = 0, len = values.length; i < len; i++) {
      if (isObject(values[ i ])) {
        ret.push('[#' + count + ']')
        ++count
      } else {
        ret.push(values[ i ])
      }
    }
  }
  return ret.join(' ')
}

/**
 * Log Class that allows to write logs
 * This class allows three levels of logs:
 * - debug
 * - info
 * - warning
 * - error
 */
class Log {
  /**
   * Creates an instance of Log.
   * @param {any} id
   * @param {number} [level=0]
   * @memberOf Log
   */
  constructor(id, level = 0) {
    this._id = id
    this._level = level
  }

  /**
   * Sets the verbosity level
   * @param {Level} level
   * @memberOf Log
   */
  setLevel(level) {
    this._level = level
  }

  /**
   * Gets the verbosity level
   * @return {Level}
   * @memberOf Log
   */
  getLevel() {
    return this._level
  }

  /**
   * Writes debug log
   * @memberOf Log
   */
  log(...values) {
    this._writeLog(DEBUG, Level.DEBUG, values)
  }

  /**
   * Writes debug log
   * @memberOf Log
   */
  debug(...values) {
    this._writeLog(DEBUG, Level.DEBUG, values)
  }

  /**
   * Writes info log
   * @memberOf Log
   */
  info(...values) {
    this._writeLog(INFO, Level.INFO, values)
  }

  /**
   * Writes warning log
   * @memberOf Log
   */
  warning(...values) {
    this._writeLog(WARNING, Level.WARNING, values)
  }

  /**
   * Writes error log
   * @memberOf Log
   */
  error(...values) {
    this._writeLog(ERROR, Level.ERROR, values)
  }

  /**
   * Writes bot log for automated key robot
   * @memberof Log
   */
  bot(...values) {
    this._writeLog(INFO, Level.BOT, values)
  }

  _writeLogStringifyingObjects(method, type, values) {
    console[ method ](type.toUpperCase() + ' ' + this._id + ' ' + getLogSummary(values))
    if (values) {
      stringifyObjects(method, values)
    }
  }

  /**
   * Writes custom log
   * @param {String} type
   * @param {Level} level
   * @param {Array} values
   * @memberOf Log
   */
  _writeLog(type, level, values) {
    try {
      if (console && level >= this.getLevel()) {
        const method = console[ type ] ? type : 'log'
        if (hasToStringifyObjects) {
          this._writeLogStringifyingObjects(method, type, values)
        } else {
          console[ method ](type.toUpperCase(), this._id, ...values)
        }
      }
    } catch (err) {
      console.error('_writeLog() Error=' + err.message)
    }
  }
}

const instances = {}
let level = 0

/**
 * Sets log verbosity
 * @param {Level} newLevel
 */
function setLevel(newLevel) {
  if (newLevel !== level) {
    console.log(`Logger level changed to ${invert(Level)[ newLevel ]}`)
    level = newLevel
    for (const instance of Object.values(instances)) {
      instance.setLevel(level)
    }
  }
}

/**
 * Gets log verbosity
 * @return {Level}
 */
function getLevel() {
  return level
}

/**
 * Gets log instance
 * @param {String} id
 * @return {Log}
 */
function getInstance(id = 'System') {
  instances[ id ] = instances[ id ] || new Log(id, getLevel())
  return instances[ id ]
}

function destroyLogger(id = '') {
  delete instances[ id ]
}

function setHasToStringifyObjectsInLog(value) {
  hasToStringifyObjects = value
}

export {
  Level,
  getInstance,
  destroyLogger,
  setLevel,
  getLevel,
  setHasToStringifyObjectsInLog,
}
