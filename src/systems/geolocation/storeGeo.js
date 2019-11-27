import { getInstance as getLoggerInstance } from 'helpers/logger'
import { setToStore, setValuesToStore } from 'systems/store'

const STORE_NAME = 'storeGeo';

let state = {
  trackingWatcher: null,
  initialPosition: null,
  currentPosition: null,
  beforeCurrentPosition: null
}

const _getLogger = () => {
  return getLoggerInstance(STORE_NAME)
}

/**
 * Store init
 */
setToStore(STORE_NAME, state);
DEBUG && _getLogger().debug('initialized', state)

/**
 * @param {number} value
 */
const setTrackingWatcher = (value) => {
  DEBUG && _getLogger().debug('setTrackingWatcher()', value)
  setToStore(`${STORE_NAME}.trackingWatcher`, value);
}

/**
 * @param {Position} position
 */
const setInitialPosition = (position) => {
  DEBUG && _getLogger().debug('setInitialPosition()', position)
  setValuesToStore(`${STORE_NAME}.initialPosition`, position);
}

/**
 * @param {Position} position
 */
const setCurrentPosition = (position) => {
  DEBUG && _getLogger().debug('setCurrentPosition()', position)
  setValuesToStore(`${STORE_NAME}.currentPosition`, position);
}

/**
 * @param {Position} position
 */
const setBeforeCurrentPosition = (position) => {
  DEBUG && _getLogger().debug('setBeforeCurrentPosition()', position)
  setValuesToStore(`${STORE_NAME}.beforeCurrentPosition`, position);
}

export {
  STORE_NAME,
  setTrackingWatcher,
  setInitialPosition,
  setCurrentPosition,
  setBeforeCurrentPosition
}
