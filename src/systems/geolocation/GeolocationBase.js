import { getInstance as getLoggerInstance } from 'helpers/logger'
import { isNull } from 'helpers/utilTypes'
import { getFromStore } from 'systems/store'
import GeolocationEvents from 'geolocation/GeolocationEvents'
import {
  STORE_NAME,
  setTrackingWatcher,
  setInitialPosition,
  setCurrentPosition,
  setBeforeCurrentPosition
} from 'geolocation/storeGeo'
import broadcast from 'broadcast/broadcast'

/**
 * GeolocationBase class to define geolocation functionality
 * @return {Object}
 */
class GeolocationBase {
  constructor() {
    this.ID = 'Geolocation'
    DEBUG && this._getLogger().debug('initialized')
  }

  _getLogger() {
    return getLoggerInstance(this.ID)
  }

  /**
   * @returns {boolean}
   */
  _isSupported() {
    let isSupported = !!navigator.geolocation
    DEBUG && this._getLogger().debug('_isSupported()', isSupported)
    return isSupported
  }

  /**
   * @param {Position} position
   */
  _successTracking(position) {
    const initialPosition = getFromStore(`${STORE_NAME}.initialPosition`)
    const currentPosition = getFromStore(`${STORE_NAME}.currentPosition`)

    !initialPosition && setInitialPosition(position)
    !!currentPosition && setBeforeCurrentPosition(currentPosition)
    setCurrentPosition(position)

    // DEBUG && this._getLogger().debug('_successTracking()', position)
    broadcast.publish(GeolocationEvents.ON_GEOLOCATION_CURRENT_POSITION_UPDATE, position)
  }

  /**
   * @param {PositionError} error
   */
  _errorTracking(error) {
    DEBUG && this._getLogger().error('_errorTracking()', error)
    !!error.PERMISSION_DENIED && broadcast.publish(GeolocationEvents.ON_GEOLOCATION_PERMISSION_DENIED, error)
    !!error.POSITION_UNAVAILABLE && broadcast.publish(GeolocationEvents.ON_GEOLOCATION_POSITION_UNAVAILABLE, error)
    !!error.TIMEOUT && broadcast.publish(GeolocationEvents.ON_GEOLOCATION_TIMEOUT, error)
  }

  // TODO async
  /**
   * @param {PositionOptions} options
   */
  getCurrentPosition(options = null) {
    DEBUG && this._getLogger().debug('getCurrentPosition() options ', options)
    navigator.geolocation.getCurrentPosition(this._successTracking, this._errorTracking, options)
  }

  /**
   * @param {PositionOptions} options
   */
  startTracking(options = null) {
    let trackingWatcher = getFromStore(`${STORE_NAME}.trackingWatcher`)
    if ( this._isSupported() && isNull(trackingWatcher)) {
      trackingWatcher = navigator.geolocation.watchPosition(this._successTracking, this._errorTracking, options)
      setTrackingWatcher(trackingWatcher)
      broadcast.publish(GeolocationEvents.ON_GEOLOCATION_TRACKING_STARTED, trackingWatcher)
    }
    DEBUG && this._getLogger().debug('startTracking()', options, trackingWatcher)
  }

  stopTracking() {
    const trackingWatcher = getFromStore(`${STORE_NAME}.trackingWatcher`)
    if ( this._isSupported() && !isNull(trackingWatcher) ) {
      navigator.geolocation.clearWatch(trackingWatcher)
      setTrackingWatcher(null)
      broadcast.publish(GeolocationEvents.ON_GEOLOCATION_TRACKING_STOPPED, trackingWatcher)
    }
    DEBUG && this._getLogger().debug('stopTracking()', trackingWatcher)
  }
}

export default GeolocationBase
