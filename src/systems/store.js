import PubSub from 'pubsub-js'
import set from 'lodash.set'
import get from 'lodash.get'
import unset from 'lodash.unset'

const ID = '_store'
const _store = {}

const getFromStore = (path) => {
  return get(_store, path)
}

const setToStore = (path, newValue, force) => {
  const oldValue = getFromStore(path)
  if (path.indexOf('undefined') === 0) {
    console.error(ID, 'setToStore()::Error, wrong _store path. Check how the path was created. path=', path)
  }
  if (force || oldValue !== newValue) {
    set(_store, path, newValue)
    PubSub.publish(path, {
      newValue,
      oldValue,
    })
  }
  return newValue
}

/**
 * Sets several values in the _store
 *
 * @param {string} pathPrefix
 * @param {object} values
 */
const setValuesToStore = (pathPrefix, values) => {
  for (const key in values) {
    // eslint-disable-next-line no-prototype-builtins
    if (values.hasOwnProperty(key)) {
      setToStore(`${pathPrefix}.${key}`, values[key])
    }
  }
}

const unsetStoreValue = (path) => {
  return unset(path)
}

const subscribeToStoreValue = (...args) => {
  return getFromStore(PubSub.subscribe(...args))
}

const unsubscribeToStoreValue = (...args) => {
  PubSub.unsubscribe(...args)
}

/**
 * Resets a _store
 *
 * @param {string} storeName
 * @param {object} storeValue
 * @param {boolean} silently Indicates if it has to reset the _store without syncing the data with the components.
 */
const resetStore = (storeName, storeValue, silently = false) => {
  if (silently) {
    setToStore(storeName, Object.assign({}, storeValue))
  } else {
    setValuesToStore(storeName, storeValue)
  }
}

export {
  _store,
  setToStore,
  setValuesToStore,
  getFromStore,
  unsetStoreValue,
  subscribeToStoreValue,
  unsubscribeToStoreValue,
  resetStore,
}
