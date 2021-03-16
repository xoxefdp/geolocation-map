import { isNull } from 'the-type-validator'
import { GeolocationEvent, PermissionEvent } from 'systems/Events'
import { GeolocationError, PermissionState, WebAPIError } from 'systems/Constants'
import {
  setTrackingWatcher,
  getStoredTrackingWatcher,
  updateGeolocationStore,
} from 'geolocation/store'
import {
  queryPermissionStatus,
  isPermissionGranted,
  isPermissionPrompt,
  isPermissionDenied,
} from 'permissions/permissions'
import {
  updatePermissionStore,
} from 'permissions/store'
import PubSub from 'pubsub-js'

const ID = 'geolocation'

/**
 * @param {Position} position
 */
const _successTracking = (position) => {
  console.debug(ID, '_successTracking() position', position)
  updateGeolocationStore(position)
  PubSub.publish(GeolocationEvent.ON_GEOLOCATION_CURRENT_POSITION_UPDATE, position)
}

/**
 * @param {PositionError} error
 */
const _errorTracking = (error) => {
  console.error(ID, '_errorTracking()', error)

  switch (error.code) {
  case GeolocationError.PERMISSION_DENIED:
    PubSub.publish(GeolocationEvent.ON_GEOLOCATION_PERMISSION_DENIED, error)
    break
  case GeolocationError.POSITION_UNAVAILABLE:
    PubSub.publish(GeolocationEvent.ON_GEOLOCATION_POSITION_UNAVAILABLE, error)
    break
  case GeolocationError.TIMEOUT:
    PubSub.publish(GeolocationEvent.ON_GEOLOCATION_TIMEOUT, error)
    break
  default:
    PubSub.publish(GeolocationEvent.ON_GEOLOCATION_UNKNOWN_ERROR, error)
    break
  }
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
  console.debug(ID, `handleGeolocationPermission() ${ID} ${event.currentTarget.state}`)
  const permissionStatus = event.currentTarget
  const state = permissionStatus.state

  updatePermissionStore(ID, state)

  isPermissionGranted(ID) && PubSub.publish(PermissionEvent.ON_PERMISSION_GRANTED, { resource: ID, state })
  isPermissionPrompt(ID) && PubSub.publish(PermissionEvent.ON_PERMISSION_PROMPT, { resource: ID, state })
  isPermissionDenied(ID) && PubSub.publish(PermissionEvent.ON_PERMISSION_DENIED, { resource: ID, state })
}

const initGeoService = () => {
  return _isSupported
    ? new Promise((resolve, reject) => {
      console.debug(ID, `initGeoService() started at ${Date.now()}`)
      queryPermissionStatus(ID)
        .then((permissionStatus) => {
          permissionStatus.onchange = handleGeolocationPermission
          // startPermissionsChecker(ID)
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
    : Promise.reject(new Error(WebAPIError.GEOLOCATION_NOT_SPPORTED))
}

/**
 * @param {PositionOptions} options
 */
const renewCurrentPosition = (options = null) => {
  return new Promise((resolve, reject) => {
    if (_isSupported) {
      console.debug(ID, `renewCurrentPosition() options ${options}`)
      try {
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
      } catch (err) {
        console.error(ID, 'renewCurrentPosition()', err)
        reject(err)
      }
    } else {
      const err = new Error(WebAPIError.GEOLOCATION_NOT_SPPORTED)
      console.error(ID, 'renewCurrentPosition()', err)
      reject(err)
    }
  }).then((result) => {
    if (isPermissionPrompt(ID) || isPermissionDenied(ID)) {
      PubSub.publish(PermissionEvent.ON_PERMISSION_GRANTED, { resource: ID, state: PermissionState.GRANTED })
    }
    _successTracking(result)
  }).catch((err) => {
    PubSub.publish(PermissionEvent.ON_PERMISSION_DENIED, { resource: ID, state: PermissionState.DENIED })
    _errorTracking(err)
  })
}

/**
 * @param {PositionOptions} options
 */
const startTracking = (options = null) => {
  console.debug(ID, `startTracking() options ${options}`)
  return new Promise((resolve, reject) => {
    if (_isSupported) {
      let trackingWatcher = getStoredTrackingWatcher()
      if (isNull(trackingWatcher)) {
        trackingWatcher = navigator.geolocation.watchPosition(resolve, reject, options)
        setTrackingWatcher(trackingWatcher)
        console.debug(ID, `startTracking() trackingWatcher ${trackingWatcher}`)
        PubSub.publish(GeolocationEvent.ON_GEOLOCATION_TRACKING_STARTED, trackingWatcher)
      } else {
        console.debug(ID, `startTracking() trackingWatcher found ${trackingWatcher}`)
      }
    } else {
      const err = new Error(WebAPIError.GEOLOCATION_NOT_SPPORTED)
      console.error(ID, 'startTracking()', err)
      reject(err)
    }
  }).then((result) => {
    if (isPermissionPrompt(ID) || isPermissionDenied(ID)) {
      PubSub.publish(PermissionEvent.ON_PERMISSION_GRANTED, { resource: ID, state: PermissionState.GRANTED })
    }
    _successTracking(result)
  }).catch((error) => {
    PubSub.publish(PermissionEvent.ON_PERMISSION_DENIED, { resource: ID, state: PermissionState.DENIED })
    _errorTracking(error)
  })
}

/**
 */
const stopTracking = () => {
  if (_isSupported) {
    const trackingWatcher = getStoredTrackingWatcher()
    if (!isNull(trackingWatcher)) {
      navigator.geolocation.clearWatch(trackingWatcher)
      setTrackingWatcher(null)
      console.debug(ID, `stopTracking() trackingWatcher ${trackingWatcher}`)
      PubSub.publish(GeolocationEvent.ON_GEOLOCATION_TRACKING_STOPPED, trackingWatcher)
    } else {
      console.debug(ID, `stopTracking() no trackingWatcher found`)
    }
  } else {
    const err = new Error(WebAPIError.GEOLOCATION_NOT_SPPORTED)
    console.error(ID, 'stopTracking()', err)
  }
}

const _isSupported = isGeolocationSupported()

// Error Handling
PubSub.subscribe(GeolocationEvent.ON_GEOLOCATION_PERMISSION_DENIED, stopTracking)
PubSub.subscribe(GeolocationEvent.ON_GEOLOCATION_POSITION_UNAVAILABLE, stopTracking)
PubSub.subscribe(GeolocationEvent.ON_GEOLOCATION_TIMEOUT, stopTracking)
PubSub.subscribe(GeolocationEvent.ON_GEOLOCATION_UNKNOWN_ERROR, stopTracking)

export {
  isGeolocationSupported,
  isGeolocationDenied,
  initGeoService,
  renewCurrentPosition,
  startTracking,
  stopTracking,
}
