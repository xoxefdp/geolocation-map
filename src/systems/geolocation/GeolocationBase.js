import { requestLogger } from 'the-browser-logger'
import { isNull } from 'helpers/utilTypes'
import GeolocationEvent from 'geolocation/GeolocationEvents'
import {
  setTrackingWatcher,
  setInitialPosition,
  setCurrentPosition,
  setBeforeCurrentPosition,
  getStoredTrackingWatcher,
  getStoredInitialPosition,
  getStoredCurrentPosition,
} from 'geolocation/storeGeolocation'
import broadcast from 'broadcast/broadcast'

/**
 * GeolocationBase class to define geolocation functionality
 * @return {Object}
 */
class GeolocationBase {
  constructor() {
    this._id = 'Geolocation'
    // BIND TO CLASS
    this._isSupported = this._isSupported.bind(this)
    this._successTracking = this._successTracking.bind(this)
    this._errorTracking = this._errorTracking.bind(this)
    this.renewCurrentPosition = this.renewCurrentPosition.bind(this)
    this.startTracking = this.startTracking.bind(this)
    this.stopTracking = this.stopTracking.bind(this)
  }

  /**
   * Logger method
   * @returns {String}
   */
  _getLogger() {
    return requestLogger(this._id)
  }

  /**
   * @returns {boolean}
   */
  _isSupported() {
    const isSupported = !!navigator.geolocation
    DEBUG && this._getLogger().debug('_isSupported()', isSupported)
    return isSupported
  }

  /**
   * @param {Position} position
   */
  _successTracking(position) {
    const initialPosition = getStoredInitialPosition()
    const currentPosition = getStoredCurrentPosition()
    !initialPosition && setInitialPosition(position)
    !!currentPosition && setBeforeCurrentPosition(currentPosition)

    setCurrentPosition(position)

    DEBUG && this._getLogger().debug('_successTracking() position', position)
    broadcast.publish(GeolocationEvent.ON_GEOLOCATION_CURRENT_POSITION_UPDATE, position)
  }

  /**
   * @param {PositionError} error
   */
  _errorTracking(error) {
    DEBUG && this._getLogger().error('_errorTracking()', error)
    !!error.PERMISSION_DENIED && broadcast.publish(GeolocationEvent.ON_GEOLOCATION_PERMISSION_DENIED, error)
    !!error.POSITION_UNAVAILABLE && broadcast.publish(GeolocationEvent.ON_GEOLOCATION_POSITION_UNAVAILABLE, error)
    !!error.TIMEOUT && broadcast.publish(GeolocationEvent.ON_GEOLOCATION_TIMEOUT, error)
  }

  /**
   * @param {PositionOptions} options
   */
  renewCurrentPosition(options = null) {
    DEBUG && this._getLogger().debug('renewCurrentPosition() options ', options)
    navigator.geolocation.getCurrentPosition(this._successTracking, this._errorTracking, options)
  }

  /**
   * @param {PositionOptions} options
   */
  startTracking(options = null) {
    let trackingWatcher = getStoredTrackingWatcher()
    if ( this._isSupported() && isNull(trackingWatcher)) {
      trackingWatcher = navigator.geolocation.watchPosition(this._successTracking, this._errorTracking, options)
      setTrackingWatcher(trackingWatcher)
      broadcast.publish(GeolocationEvent.ON_GEOLOCATION_TRACKING_STARTED, trackingWatcher)
    }
    DEBUG && this._getLogger().debug('startTracking()', options, trackingWatcher)
  }

  /**
   */
  stopTracking() {
    const trackingWatcher = getStoredTrackingWatcher()
    if ( this._isSupported() && !isNull(trackingWatcher) ) {
      navigator.geolocation.clearWatch(trackingWatcher)
      setTrackingWatcher(null)
      broadcast.publish(GeolocationEvent.ON_GEOLOCATION_TRACKING_STOPPED, trackingWatcher)
    }
    DEBUG && this._getLogger().debug('stopTracking()', trackingWatcher)
  }
}

export default GeolocationBase
