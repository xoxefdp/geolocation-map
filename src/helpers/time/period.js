import { getInstance as getLoggerInstance } from 'helpers/logger'
import { isFunction, isInteger } from 'helpers/utilTypes'

const ID = 'period'
let intervals = [],
  timeouts = []

/**
 * Logger method
 * @returns {String}
 */
const _getLogger = () => {
  return getLoggerInstance(ID)
}

const _appendId = (array, element) => {
  const index = array.indexOf(element)
  index === -1 && array.push(element)
}

const _removeId = (array, element) => {
  const index = array.indexOf(element)
  index !== -1 && array.splice(index, 1)
}

const createInterval = (callback, intervalDelay) => {
  let intervalId = null
  if ( isFunction(callback) && isInteger(intervalDelay) ) {
    intervalId = setInterval(callback, intervalDelay)
    _appendId(intervals, intervalId)
  }
  DEBUG && _getLogger().debug('createInterval()', intervalId)
  return intervalId
}

const destroyInterval = (intervalId) => {
  DEBUG && _getLogger().debug('destroyInterval()', intervalId)
  clearInterval(intervalId)
  _removeId(intervals, intervalId)
  return null
}

const createTimeout = (callback, timeoutDelay) => {
  let timeoutId = null
  if ( isFunction(callback) && isInteger(timeoutDelay) ) {
    timeoutId = setTimeout(callback, timeoutDelay)
    _appendId(timeouts, timeoutId)
  }
  DEBUG && _getLogger().debug('createTimeout()', timeoutId)
  return timeoutId
}

const destroyTimeout = (timeoutId) => {
  DEBUG && _getLogger().debug('destroyTimeout()', timeoutId)
  clearTimeout(timeoutId)
  _removeId(timeouts, timeoutId)
  return null
}

const getIntervals = () => {
  return intervals
}

const resetIntervals = () => {
  DEBUG && _getLogger().debug('resetIntervals()')
  for (let index = 0; index < intervals.length; index++) {
    const intervalId = intervals[ index ]
    clearInterval(intervalId)
  }
  intervals = []
}

const getTimeouts = () => {
  return timeouts
}

const resetTimeouts = () => {
  DEBUG && _getLogger().debug('resetTimeouts()')
  for (let index = 0; index < timeouts.length; index++) {
    const timeoutId = timeouts[ index ]
    clearTimeout(timeoutId)
  }
  timeouts = []
}

export {
  // UTIL
  createInterval,
  destroyInterval,
  createTimeout,
  destroyTimeout,
  // MANAGE
  getIntervals,
  resetIntervals,
  getTimeouts,
  resetTimeouts,
}
