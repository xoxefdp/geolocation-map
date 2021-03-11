import { getFromStore, setToStore, setValuesToStore } from 'systems/store'

const ID = 'StorePermission'
const STORE_NAME = 'permissions'

const resourceStoreState = {
  initialState: null,
  currentState: null,
  beforeCurrentState: null,
}

console.debug(ID, 'initializeStore()')
setToStore(STORE_NAME, {})

const initializeResourceStore = (resource) => {
  console.debug(ID, resource, 'initializeResourceStore()')
  setToStore(STORE_NAME, resource)
  setValuesToStore(`${STORE_NAME}.${resource}`, resourceStoreState)
}

const setInitialState = (resource, state) => {
  console.debug(ID, 'setInitialState()', state)
  setToStore(`${STORE_NAME}.${resource}.initialState`, state)
}

const setCurrentState = (resource, state) => {
  console.debug(ID, 'setCurrentState()', state)
  setToStore(`${STORE_NAME}.${resource}.currentState`, state)
}

const setBeforeCurrentState = (resource, state) => {
  console.debug(ID, 'setBeforeCurrentState()', state)
  setToStore(`${STORE_NAME}.${resource}.beforeCurrentState`, state)
}

const getStoredInitialState = (resource) => {
  console.debug(ID, 'getStoredInitialState()')
  return getFromStore(`${STORE_NAME}.${resource}.initialState`)
}

const getStoredCurrentState = (resource) => {
  console.debug(ID, 'getStoredCurrentState()')
  return getFromStore(`${STORE_NAME}.${resource}.currentState`)
}

const getStoredBeforeCurrentState = (resource) => {
  console.debug(ID, 'getStoredBeforeCurrentState()')
  return getFromStore(`${STORE_NAME}.${resource}.beforeCurrentState`)
}

export {
  STORE_NAME,
  initializeResourceStore,
  setInitialState,
  setCurrentState,
  setBeforeCurrentState,
  getStoredInitialState,
  getStoredCurrentState,
  getStoredBeforeCurrentState,
}
