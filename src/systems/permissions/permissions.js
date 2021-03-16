import {
  getStoredCurrentState,
  updatePermissionStore,
} from 'permissions/store'
import { PermissionEvent } from 'systems/Events'
import { PermissionState, WebAPIError } from 'systems/Constants'
import PubSub from 'pubsub-js'

const ID = 'permissions'

/**
 * @returns {boolean}
 */
const isPermissionsSupported = () => {
  const support = !!navigator.permissions
  console.debug(ID, 'isPermissionsSupported()', support)
  return support
}

const isPermissionGranted = (resource) => {
  const state = PermissionState.GRANTED === getStoredCurrentState(resource)
  console.debug(ID, `isPermissionGranted() ${resource} ${state}`)
  return state
}

const isPermissionPrompt = (resource) => {
  const state = PermissionState.PROMPT === getStoredCurrentState(resource)
  console.debug(ID, `isPermissionPrompt() ${resource} ${state}`)
  return state
}

const isPermissionDenied = (resource) => {
  const state = PermissionState.DENIED === getStoredCurrentState(resource)
  console.debug(ID, `isPermissionDenied() ${resource} ${state}`)
  return state
}

const queryPermissionStatus = (resource) => {
  console.debug(ID, `queryPermissionStatus() ${resource}`)
  return _isSupported
    ? new Promise((resolve, reject) => {
      navigator.permissions.query({ name: resource })
        .then((permissionStatus) => {
          const state = permissionStatus.state
          console.debug(ID, `queryPermissionStatus() resolve ${resource} ${state}`)

          updatePermissionStore(resource, state)

          isPermissionGranted(resource) && PubSub.publish(PermissionEvent.ON_PERMISSION_GRANTED, { resource, state })
          isPermissionPrompt(resource) && PubSub.publish(PermissionEvent.ON_PERMISSION_PROMPT, { resource, state })
          isPermissionDenied(resource) && PubSub.publish(PermissionEvent.ON_PERMISSION_DENIED, { resource, state })

          resolve(permissionStatus)
        })
        .catch((err) => {
          console.error(ID, `queryPermissionStatus() reject ${resource} ${err}`)
          reject(err)
        })
    })
    : Promise.reject(new Error(WebAPIError.PERMISSIONS_NOT_SUPPORTED))
}

const _isSupported = isPermissionsSupported()

export {
  isPermissionsSupported,
  isPermissionGranted,
  isPermissionPrompt,
  isPermissionDenied,
  queryPermissionStatus,
}
