import { isNull } from 'the-type-validator'
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
  const initialState = getFromStore(`${STORE_NAME}.${resource}.initialState`)
  console.debug(ID, `getStoredInitialState() ${initialState}`)
  return initialState
}

const getStoredCurrentState = (resource) => {
  const currentState = getFromStore(`${STORE_NAME}.${resource}.currentState`)
  console.debug(ID, `getStoredCurrentState() ${currentState}`)
  return currentState
}

const getStoredBeforeCurrentState = (resource) => {
  const beforeCurrentState = getFromStore(`${STORE_NAME}.${resource}.beforeCurrentState`)
  console.debug(ID, `getStoredBeforeCurrentState() ${beforeCurrentState}`)
  return beforeCurrentState
}

const updatePermissionStore = (resource, state) => {
  console.debug(ID, `updatePermissionStore() ${resource} ${state}`)
  const initialState = getStoredInitialState(resource)
  const currentState = getStoredCurrentState(resource)

  isNull(initialState) && setInitialState(resource, state)
  !isNull(currentState) && setBeforeCurrentState(resource, currentState)

  setCurrentState(resource, state)
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
  updatePermissionStore,
}
