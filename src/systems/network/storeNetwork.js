import { getInstance as getLoggerInstance } from 'helpers/logger'
import { getFromStore, setToStore } from 'systems/store'

const ID = 'StoreNetwork'
const STORE_NAME = 'network'

const state = {
  networkState: null,
  isInternetConnected: false,
}

/**
 * Logger
 * @returns {String}
 */
const _getLogger = () => {
  return getLoggerInstance(ID)
}

// eslint-disable-next-line no-use-before-define
DEBUG && _getLogger().debug('initializeStore()')
setToStore(STORE_NAME, state)

/**
 * @param {String} networkState
 */
const setNetworkState = (networkState) => {
  DEBUG && _getLogger().debug('setNetworkState()', networkState)
  setToStore(`${STORE_NAME}.networkState`, networkState)
}

/**
 * @returns {String}
 */
const getNetworkState = () => {
  const networkState = getFromStore(`${STORE_NAME}.networkState`)
  DEBUG && _getLogger().debug('getNetworkState()', networkState)
  return networkState
}

/**
 * @param {boolean} isInternetConnected
 */
const setIsInternetConnected = (isInternetConnected) => {
  DEBUG && _getLogger().debug('setIsInternetConnected()', isInternetConnected)
  setToStore(`${STORE_NAME}.isInternetConnected`, isInternetConnected)
}

/**
 * @returns {boolean}
 */
const getIsInternetConnected = () => {
  const isInternetConnected = getFromStore(`${STORE_NAME}.isInternetConnected`)
  DEBUG && _getLogger().debug('getIsInternetConnected()', isInternetConnected)
  return isInternetConnected
}

export {
  STORE_NAME,
  setNetworkState,
  getNetworkState,
  setIsInternetConnected,
  getIsInternetConnected,
}
