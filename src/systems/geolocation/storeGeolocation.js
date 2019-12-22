import { requestLogger } from 'the-browser-logger'
import { getFromStore, setToStore } from 'systems/store'

const ID = 'StoreGeolocation'
const STORE_NAME = 'geolocation'

const state = {
  trackingWatcher: null,
  initialPosition: null,
  currentPosition: null,
  beforeCurrentPosition: null,
}

const _getLogger = () => {
  return requestLogger(ID)
}

DEBUG && _getLogger().debug('initializeStore()')
setToStore(STORE_NAME, state)

/**
 * @param {number} trackingWatcher
 */
const setTrackingWatcher = (trackingWatcher) => {
  DEBUG && _getLogger().debug('setTrackingWatcher()', trackingWatcher)
  setToStore(`${STORE_NAME}.trackingWatcher`, trackingWatcher)
}

/**
 * @returns {number}
 */
const getStoredTrackingWatcher = () => {
  DEBUG && _getLogger().debug('getStoredTrackingWatcher()')
  return getFromStore(`${STORE_NAME}.trackingWatcher`)
}

/**
 * @param {Position} position
 */
const setInitialPosition = (position) => {
  DEBUG && _getLogger().debug('setInitialPosition()', position)
  setToStore(`${STORE_NAME}.initialPosition`, position)
}

/**
 * @returns {Position}
 */
const getStoredInitialPosition = () => {
  DEBUG && _getLogger().debug('getStoredInitialPosition()')
  return getFromStore(`${STORE_NAME}.initialPosition`)
}

/**
 * @param {Position} position
 */
const setCurrentPosition = (position) => {
  DEBUG && _getLogger().debug('setCurrentPosition()', position)
  setToStore(`${STORE_NAME}.currentPosition`, position)
}

/**
 * @returns {Position}
 */
const getStoredCurrentPosition = () => {
  DEBUG && _getLogger().debug('getStoredCurrentPosition()')
  return getFromStore(`${STORE_NAME}.currentPosition`)
}

/**
 * @param {Position} position
 */
const setBeforeCurrentPosition = (position) => {
  DEBUG && _getLogger().debug('setBeforeCurrentPosition()', position)
  setToStore(`${STORE_NAME}.beforeCurrentPosition`, position)
}

/**
 * @returns {Position}
 */
const getStoredBeforeCurrentPosition = () => {
  DEBUG && _getLogger().debug('getStoredBeforeCurrentPosition()')
  return getFromStore(`${STORE_NAME}.beforeCurrentPosition`)
}

export {
  STORE_NAME,
  setTrackingWatcher,
  setInitialPosition,
  setCurrentPosition,
  setBeforeCurrentPosition,
  getStoredTrackingWatcher,
  getStoredInitialPosition,
  getStoredCurrentPosition,
  getStoredBeforeCurrentPosition,
}
