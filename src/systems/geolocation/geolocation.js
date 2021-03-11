import { isNull } from 'the-type-validator'
import { GeolocationEvent, PermissionEvent } from 'systems/Events'
import {
  setTrackingWatcher,
  setInitialPosition,
  setCurrentPosition,
  setBeforeCurrentPosition,
  getStoredTrackingWatcher,
  getStoredInitialPosition,
  getStoredCurrentPosition,
} from 'geolocation/store'
import {
  queryPermissionStatus,
  isPermissionGranted,
  isPermissionPrompt,
  isPermissionDenied,
} from 'permissions/permissions'
import {
  getStoredInitialState,
  getStoredCurrentState,
  setInitialState,
  setBeforeCurrentState,
  setCurrentState,
} from 'permissions/store'
import PubSub from 'pubsub-js'

const ID = 'geolocation'

/**
 * @param {Position} position
 */
const _successTracking = (position) => {
  const initialPosition = getStoredInitialPosition()
  const currentPosition = getStoredCurrentPosition()
  isNull(initialPosition) && setInitialPosition(position)
  !isNull(currentPosition) && setBeforeCurrentPosition(currentPosition)

  setCurrentPosition(position)

  console.debug(ID, '_successTracking() position', position)
  PubSub.publish(GeolocationEvent.ON_GEOLOCATION_CURRENT_POSITION_UPDATE, position)
}

/**
 * @param {PositionError} error
 */
const _errorTracking = (error) => {
  console.error(ID, '_errorTracking()', error)
  !!error.PERMISSION_DENIED && PubSub.publish(GeolocationEvent.ON_GEOLOCATION_PERMISSION_DENIED, error)
  !!error.POSITION_UNAVAILABLE && PubSub.publish(GeolocationEvent.ON_GEOLOCATION_POSITION_UNAVAILABLE, error)
  !!error.TIMEOUT && PubSub.publish(GeolocationEvent.ON_GEOLOCATION_TIMEOUT, error)
}

/**
 * @returns {boolean}
 */
const isGeolocationSupported = () => {
  const support = !!navigator.geolocation
  console.debug(ID, 'isGeolocationSupported()', support)
  return support
}

const isGeolocationDenied = () => {
  return isPermissionDenied(ID)
}

const handleGeolocationPermission = (event) => {
  const permissionStatus = event.target
  const state = permissionStatus.state
  const initialState = getStoredInitialState(ID)
  const currentState = getStoredCurrentState(ID)

  isNull(initialState) && setInitialState(ID, state)
  !isNull(currentState) && setBeforeCurrentState(ID, currentState)

  setCurrentState(ID, state)

  console.debug(ID, `queryPermissionStatus() ${ID} ${state}`)

  isPermissionGranted(ID) && PubSub.publish(PermissionEvent.ON_PERMISSION_GRANTED, state)
  isPermissionPrompt(ID) && PubSub.publish(PermissionEvent.ON_PERMISSION_PROMPT, state)
  isPermissionDenied(ID) && PubSub.publish(PermissionEvent.ON_PERMISSION_DENIED, state)
}

const initGeoService = () => {
  return isSupported
    ? new Promise((resolve, reject) => {
      queryPermissionStatus(ID)
        .then((permissionStatus) => {
          permissionStatus.onchange = handleGeolocationPermission
          resolve(permissionStatus)
        })
        .catch((error) => {
          reject(error)
        })
    })
    : new Promise((resolve, reject) => {
      reject(new Error('Geolocation API not supported'))
    })
}

/**
 * @param {PositionOptions} options
 */
const renewCurrentPosition = (options = null) => {
  if (isSupported) {
    console.debug(ID, 'renewCurrentPosition() options', options)
    navigator.geolocation.getCurrentPosition(_successTracking, _errorTracking, options)
  } else {
    console.debug(ID, 'renewCurrentPosition()', 'Geolocation API not supported')
  }
}

/**
 * @param {PositionOptions} options
 */
const startTracking = (options = null) => {
  if (isSupported) {
    let trackingWatcher = getStoredTrackingWatcher()
    if (isNull(trackingWatcher)) {
      trackingWatcher = navigator.geolocation.watchPosition(_successTracking, _errorTracking, options)
      setTrackingWatcher(trackingWatcher)
      PubSub.publish(GeolocationEvent.ON_GEOLOCATION_TRACKING_STARTED, trackingWatcher)
    }
    console.debug(ID, 'startTracking()', options, trackingWatcher)
  } else {
    console.error(ID, 'startTracking()', 'Geolocation API not supported')
  }
}

/**
 */
const stopTracking = () => {
  if (isSupported) {
    const trackingWatcher = getStoredTrackingWatcher()
    if (!isNull(trackingWatcher)) {
      navigator.geolocation.clearWatch(trackingWatcher)
      setTrackingWatcher(null)
      PubSub.publish(GeolocationEvent.ON_GEOLOCATION_TRACKING_STOPPED, trackingWatcher)
    }
    console.debug(ID, 'stopTracking()', trackingWatcher)
  } else {
    console.error(ID, 'stopTracking()', 'Geolocation API not supported')
  }
}

const isSupported = isGeolocationSupported()

export {
  isGeolocationSupported,
  isGeolocationDenied,
  initGeoService,
  renewCurrentPosition,
  startTracking,
  stopTracking,
}
