import { setTimestampFormat, setLoggerLevel, Level, requestLogger } from 'the-browser-logger'
import storeBroadcast from 'broadcast/storeBroadcast'
import { get, set } from 'helpers/utilOperations'
import unset from 'lodash.unset'

setTimestampFormat(true)
DEBUG && setLoggerLevel(Level.DEBUG)

const ID = 'store'
const store = {}

const getFromStore = (path) => {
  return get(store, path)
}

const setToStore = (path, newValue, force) => {
  const oldValue = getFromStore(path)
  if (path.indexOf('undefined') === 0) {
    requestLogger(ID).error('setToStore()::Error, wrong store path. Check how the path was created. path=', path)
  }
  if (force || oldValue !== newValue) {
    set(store, path, newValue)
    storeBroadcast.publish(path, {
      newValue,
      oldValue,
    })
  }
  return newValue
}

/**
 * Sets several values in the store
 * @param {String} pathPrefix
 * @param {Object} values
 */
const setValuesToStore = (pathPrefix, values) => {
  for (const key in values) {
    // eslint-disable-next-line no-prototype-builtins
    if (values.hasOwnProperty(key)) {
      setToStore(`${pathPrefix}.${key}`, values[ key ])
    }
  }
}

const unsetStoreValue = (path) => {
  return unset(path)
}

const subscribeToStoreValue = (...args) => {
  return getFromStore(storeBroadcast.subscribe(...args))
}

const unsubscribeToStoreValue = (...args) => {
  storeBroadcast.unsubscribe(...args)
}

/**
 * Resets a store
 * @param {String} storeName
 * @param {Object} storeValue
 * @param {Boolean} silently Indicates if it has to reset the store without syncing the data with the components.
 */
const resetStore = (storeName, storeValue, silently = false) => {
  if (silently) {
    setToStore(storeName, Object.assign({}, storeValue))
  } else {
    setValuesToStore(storeName, storeValue)
  }
}

export {
  setToStore,
  setValuesToStore,
  getFromStore,
  unsetStoreValue,
  subscribeToStoreValue,
  unsubscribeToStoreValue,
  resetStore,
}
