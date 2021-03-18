// EXTERNAL IMPORTS
import { isNull } from 'the-type-validator'
import PubSub from 'pubsub-js'
// LOCAL IMPORTS
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

const ID = 'geolocation'

/**
 * @param {Position} position
 */
const _successPositionUpdate = (position) => {
  console.debug(ID, '_successPositionUpdate() position', position)
  position && updateGeolocationStore(position)
  position && PubSub.publish(GeolocationEvent.ON_GEOLOCATION_CURRENT_POSITION_UPDATE, position)
}

const _successTrackingStarted = () => {
  const trackingWatcher = getStoredTrackingWatcher()
  console.debug(ID, `_successTrackingStarted() trackingWatcher ${trackingWatcher}`)
  PubSub.publish(GeolocationEvent.ON_GEOLOCATION_TRACKING_STARTED, trackingWatcher)
}

/**
 * @param {PositionError} error
 */
const _errorGeolocation = (error) => {
  console.error(ID, '_errorGeolocation()', error)

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

const _handleError = (message, data) => {
  console.error(ID, '_handleError()', message)
  console.error(ID, '_handleError()', data)

  switch (data.code) {
  case GeolocationError.PERMISSION_DENIED:
    PubSub.publish(PermissionEvent.ON_PERMISSION_DENIED, { resource: ID, state: PermissionState.DENIED })
    stopTracking()
    break
  case GeolocationError.POSITION_UNAVAILABLE:
    //
    break
  case GeolocationError.TIMEOUT:
    //
    break
  default:
    stopTracking()
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
      console.debug(ID, 'renewCurrentPosition() options', options)
      try {
        navigator.geolocation.getCurrentPosition(_successPositionUpdate, _errorGeolocation, options)
        resolve()
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
    _successPositionUpdate(result)
  }).catch((err) => {
    _errorGeolocation(err)
  })
}

/**
 * @param {PositionOptions} options
 */
const startTracking = (options = null) => {
  console.debug(ID, 'startTracking() options', options)
  return new Promise((resolve, reject) => {
    let trackingWatcher = getStoredTrackingWatcher()
    if (_isSupported) {
      if (isNull(trackingWatcher)) {
        try {
          trackingWatcher = navigator.geolocation.watchPosition(_successPositionUpdate, _errorGeolocation, options)
          setTrackingWatcher(trackingWatcher)
          resolve()
        } catch (err) {
          console.error(ID, 'startTracking()', err)
          reject(err)
        }
      } else {
        const message = `trackingWatcher found ${trackingWatcher}`
        const err = new Error(message)
        console.error(ID, 'startTracking()', err)
        reject(err)
      }
    } else {
      const err = new Error(WebAPIError.GEOLOCATION_NOT_SPPORTED)
      console.error(ID, 'startTracking()', err)
      reject(err)
    }
  }).then(() => {
    _successTrackingStarted()
  }).catch((error) => {
    _errorGeolocation(error)
  })
}

/**
 */
const stopTracking = () => {
  if (_isSupported) {
    const trackingWatcher = getStoredTrackingWatcher()
    if (!isNull(trackingWatcher)) {
      console.debug(ID, `stopTracking() trackingWatcher ${trackingWatcher}`)
      navigator.geolocation.clearWatch(trackingWatcher)
      setTrackingWatcher(null)
      PubSub.publish(GeolocationEvent.ON_GEOLOCATION_TRACKING_STOPPED, trackingWatcher)
    } else {
      const message = 'no trackingWatcher found'
      console.error(ID, 'stopTracking()', message)
    }
  } else {
    const err = new Error(WebAPIError.GEOLOCATION_NOT_SPPORTED)
    console.error(ID, 'stopTracking()', err)
  }
}

const _isSupported = isGeolocationSupported()

// Error Handling
PubSub.subscribe(GeolocationEvent.ON_GEOLOCATION_PERMISSION_DENIED, _handleError)
PubSub.subscribe(GeolocationEvent.ON_GEOLOCATION_UNKNOWN_ERROR, _handleError)

export {
  isGeolocationSupported,
  isGeolocationDenied,
  initGeoService,
  renewCurrentPosition,
  startTracking,
  stopTracking,
}
