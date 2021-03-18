// EXTERNAL IMPORTS
import { isNull } from 'the-type-validator'
// LOCAL IMPORTS
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
 * @param {Position} position
 */
const setInitialPosition = (position) => {
  console.debug(ID, 'setInitialPosition()', position)
  setToStore(`${STORE_NAME}.initialPosition`, position)
}

/**
 * @param {Position} position
 */
const setCurrentPosition = (position) => {
  console.debug(ID, 'setCurrentPosition()', position)
  setToStore(`${STORE_NAME}.currentPosition`, position)
}

/**
 * @param {Position} position
 */
const setBeforeCurrentPosition = (position) => {
  console.debug(ID, 'setBeforeCurrentPosition()', position)
  setToStore(`${STORE_NAME}.beforeCurrentPosition`, position)
}

/**
 * @returns {number}
 */
const getStoredTrackingWatcher = () => {
  const trackingWatcher = getFromStore(`${STORE_NAME}.trackingWatcher`)
  console.debug(ID, 'getStoredTrackingWatcher()', trackingWatcher)
  return trackingWatcher
}

/**
 * @returns {Position}
 */
const getStoredInitialPosition = () => {
  const initialPosition = getFromStore(`${STORE_NAME}.initialPosition`)
  console.debug(ID, 'getStoredInitialPosition()', initialPosition)
  return initialPosition
}

/**
 * @returns {Position}
 */
const getStoredCurrentPosition = () => {
  const currentPosition = getFromStore(`${STORE_NAME}.currentPosition`)
  console.debug(ID, 'getStoredCurrentPosition()', currentPosition)
  return currentPosition
}

/**
 * @returns {Position}
 */
const getStoredBeforeCurrentPosition = () => {
  const beforeCurrentPosition = getFromStore(`${STORE_NAME}.beforeCurrentPosition`)
  console.debug(ID, 'getStoredBeforeCurrentPosition()', beforeCurrentPosition)
  return beforeCurrentPosition
}

const updateGeolocationStore = (position) => {
  console.debug(ID, 'updateGeolocationStore()', position)

  const initialPosition = getStoredInitialPosition()
  const currentPosition = getStoredCurrentPosition()
  isNull(initialPosition) && setInitialPosition(position)
  !isNull(currentPosition) && setBeforeCurrentPosition(currentPosition)

  setCurrentPosition(position)
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
  updateGeolocationStore,
}
