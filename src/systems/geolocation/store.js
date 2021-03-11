import { getFromStore, setToStore } from 'systems/store'
import { initializeResourceStore } from 'permissions/store'

const ID = 'StoreGeolocation'
const STORE_NAME = 'geolocation'

const state = {
  trackingWatcher: null,
  initialPosition: null,
  currentPosition: null,
  beforeCurrentPosition: null,
}

console.debug(ID, 'initializeStore()')
setToStore(STORE_NAME, state)
initializeResourceStore(STORE_NAME)

/**
 * @param {number} trackingWatcher
 */
const setTrackingWatcher = (trackingWatcher) => {
  console.debug(ID, 'setTrackingWatcher()', trackingWatcher)
  setToStore(`${STORE_NAME}.trackingWatcher`, trackingWatcher)
}

/**
 * @returns {number}
 */
const getStoredTrackingWatcher = () => {
  console.debug(ID, 'getStoredTrackingWatcher()')
  return getFromStore(`${STORE_NAME}.trackingWatcher`)
}

/**
 * @param {Position} position
 */
const setInitialPosition = (position) => {
  console.debug(ID, 'setInitialPosition()', position)
  setToStore(`${STORE_NAME}.initialPosition`, position)
}

/**
 * @returns {Position}
 */
const getStoredInitialPosition = () => {
  console.debug(ID, 'getStoredInitialPosition()')
  return getFromStore(`${STORE_NAME}.initialPosition`)
}

/**
 * @param {Position} position
 */
const setCurrentPosition = (position) => {
  console.debug(ID, 'setCurrentPosition()', position)
  setToStore(`${STORE_NAME}.currentPosition`, position)
}

/**
 * @returns {Position}
 */
const getStoredCurrentPosition = () => {
  console.debug(ID, 'getStoredCurrentPosition()')
  return getFromStore(`${STORE_NAME}.currentPosition`)
}

/**
 * @param {Position} position
 */
const setBeforeCurrentPosition = (position) => {
  console.debug(ID, 'setBeforeCurrentPosition()', position)
  setToStore(`${STORE_NAME}.beforeCurrentPosition`, position)
}

/**
 * @returns {Position}
 */
const getStoredBeforeCurrentPosition = () => {
  console.debug(ID, 'getStoredBeforeCurrentPosition()')
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
