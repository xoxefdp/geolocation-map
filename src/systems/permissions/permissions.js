import { isNull } from 'the-type-validator'
import {
  setInitialState,
  setCurrentState,
  setBeforeCurrentState,
  getStoredInitialState,
  getStoredCurrentState,
} from 'permissions/store'
import { PermissionEvent } from 'systems/Events'
import PubSub from 'pubsub-js'

const ID = 'permissions'

const PermissionState = {
  GRANTED: 'granted',
  PROMPT: 'prompt',
  DENIED: 'denied',
}

/**
 * @returns {boolean}
 */
const isPermissionsSupported = () => {
  const support = !!navigator.permissions
  console.debug(ID, 'isPermissionsSupported()', support)
  return support
}

const isPermissionGranted = (resource) => {
  console.debug(ID, 'isPermissionGranted()')
  return PermissionState.GRANTED === getStoredCurrentState(resource)
}

const isPermissionPrompt = (resource) => {
  console.debug(ID, 'isPermissionPrompt()')
  return PermissionState.PROMPT === getStoredCurrentState(resource)
}

const isPermissionDenied = (resource) => {
  console.debug(ID, 'isPermissionDenied()')
  return PermissionState.DENIED === getStoredCurrentState(resource)
}

const queryPermissionStatus = (resource) => {
  return isSupported
    ? new Promise((resolve, reject) => {
      navigator.permissions.query({ name: resource })
        .then((permissionStatus) => {
          const state = permissionStatus.state
          const initialState = getStoredInitialState(resource)
          const currentState = getStoredCurrentState(resource)

          isNull(initialState) && setInitialState(resource, state)
          !isNull(currentState) && setBeforeCurrentState(resource, currentState)

          setCurrentState(resource, state)

          console.debug(ID, `queryPermissionStatus() ${resource} ${state}`)

          isPermissionGranted(resource) && PubSub.publish(PermissionEvent.ON_PERMISSION_GRANTED, state)
          isPermissionPrompt(resource) && PubSub.publish(PermissionEvent.ON_PERMISSION_PROMPT, state)
          isPermissionDenied(resource) && PubSub.publish(PermissionEvent.ON_PERMISSION_DENIED, state)

          resolve(permissionStatus)
        })
        .catch((error) => {
          console.error(ID, `queryPermissionStatus() ${resource} ${error}`)
          reject(error)
        })
    })
    : new Promise((resolve, reject) => {
      reject(new Error('Permission API not supported'))
    })
}

const queryPermissionState = (resource) => {
  console.debug(ID, 'queryPermissionState()', resource)
  return new Promise((resolve, reject) => {
    queryPermissionStatus(resource)
      .then((permissionStatus) => {
        resolve(permissionStatus.state)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

const queryPermissionHandler = (resource) => {
  console.debug(ID, 'queryPermissionHandler()', resource)
  return new Promise((resolve, reject) => {
    queryPermissionStatus(resource)
      .then((permissionStatus) => {
        resolve(permissionStatus.onchange)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

const setPermissionHandler = (resource, handler) => {
  console.debug(ID, 'setPermissionHandler()', resource)
  return new Promise((resolve, reject) => {
    queryPermissionStatus(resource)
      .then((permissionStatus) => {
        permissionStatus.onchange = handler
        resolve()
      })
      .catch((err) => {
        reject(err)
      })
  })
}

const isSupported = isPermissionsSupported()

export {
  isPermissionsSupported,
  isPermissionGranted,
  isPermissionPrompt,
  isPermissionDenied,
  queryPermissionStatus,
  queryPermissionState,
  queryPermissionHandler,
  setPermissionHandler,
}
