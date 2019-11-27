import { getInstance as getLogger } from 'helpers/logger'
import storeBroadcast from 'broadcast/storeBroadcast'
import set from 'lodash/set'
import get from 'lodash/get'
import unset from 'lodash/unset'

const ID = 'store'
let store = {
  transitionName: ''
}

function getFromStore(path) {
  return get(store, path)
}

function setToStore(path, newValue, force) {
  let oldValue = getFromStore(path)
  if (DEBUG && path.indexOf('undefined') === 0) {
    getLogger(ID).error('setToStore()::Error, wrong store path. Check how the path was created. path=', path)
  }
  if (force || oldValue !== newValue) {
    set(store, path, newValue)
    storeBroadcast.publish(path, {
      newValue,
      oldValue
    })
  }
  return newValue
}

/**
 * Sets several values in the store
 * @param {String} pathPrefix
 * @param {Object} values
 */
function setValuesToStore(pathPrefix, values) {
  for (let key in values) {
    // eslint-disable-next-line no-prototype-builtins
    if (values.hasOwnProperty(key)) {
      setToStore(`${pathPrefix}.${key}`, values[key])
    }
  }
}

function unsetStoreValue(path) {
  return unset(path)
}

function subscribeToStoreValue(...args) {
  return getFromStore(storeBroadcast.subscribe(...args))
}

function unsubscribeToStoreValue(...args) {
  storeBroadcast.unsubscribe(...args)
}

function setTransitionName(name) {
  setToStore('transitionName', name)
}

/**
 * Resets a store
 * @param {String} storeName
 * @param {Object} storeValue
 * @param {Boolean} silently Indicates if it has to reset the store without syncing the data with the components.
 */
function resetStore(storeName, storeValue, silently = false) {
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
  setTransitionName,
  resetStore
}
