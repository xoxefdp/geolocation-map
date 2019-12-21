import { requestLogger } from 'the-browser-logger'
import { getParallelPromise } from 'helpers/promise/parallel'
import { anyPromise } from 'helpers/promise/promise'
import { interval, timeout } from 'helpers/time/timer'
import broadcast from 'broadcast/broadcast'
import NetworkEvent from 'systems/network/NetworkEvents'
import { TIME_CHECK_INTERNET_CONNECTED,
  TIME_CHECK_INTERNET_DISCONNECTED,
  CHECK_URL_TIMEOUT,
  CHECK_INTERNET_URLS,
  CHECK_CONNECTION_TIMER_ID } from 'helpers/network/NetworkConstants'
import { HttpMethod } from 'helpers/http/HttpConstants'
import { getCurrentInTimestamp } from 'helpers/utilTimes'
import { setIsInternetConnected, getIsInternetConnected } from 'systems/network/storeNetwork'

const ID = 'internetChecker',
  NUM_FAILS_TO_PASS_TO_DISCONNECTED = 2

// const headers = new Headers()
let _numFails = 0,
  _isStarted = false

const _getLogger = () => {
  return requestLogger(ID)
}

/**
 * restarts the internet connection check
 * @param {Boolean} force
 */
function restart(force) {
  DEBUG && _getLogger().debug('restart() force=', force)
  if (!_isStarted || force) {
    _isStarted = true
    /* eslint-disable no-use-before-define */
    checkConnectionAsync()
  }
  interval.set(ID, CHECK_CONNECTION_TIMER_ID, () => {
    DEBUG && _getLogger().debug('restart() Check internet is still connected, every ',
      TIME_CHECK_INTERNET_CONNECTED)
    checkConnectionAsync()
    /* eslint-enable no-use-before-define */
  }, TIME_CHECK_INTERNET_CONNECTED)
}

/**
 * Stops the interval for internet connection check
 */
function stop() {
  DEBUG && _getLogger().debug('stop()')
  _numFails = 0
  _isStarted = false
  setIsInternetConnected(false)
  interval.clear(ID, CHECK_CONNECTION_TIMER_ID)
}

/**
 * Checks if a url is available
 * @param {String} url
 * @param {String=} method
 * @param {Boolean=} avoidCache
 * @param {Boolean=} preventCORS
 * @return {Promise} promise
 */
function checkUrlAsync(url, method = HttpMethod.HEAD, avoidCache = true) {
  DEBUG && _getLogger().debug('checkUrlAsync()::url=', url, 'method=', method)
  return getParallelPromise(url, (resolve, reject) => {
    if (avoidCache) {
      url += '?t=' + getCurrentInTimestamp()
    }

    timeout.set(ID, url, () => {
      DEBUG && _getLogger().debug(`checkUrlAsync()::error url=${url}, timeout`)
      reject()
    }, CHECK_URL_TIMEOUT)

    fetch(url, {
      method,
      // headers,
      timeout: CHECK_URL_TIMEOUT,
      mode: 'no-cors',
    }).then(
      (response) => {
        DEBUG && _getLogger().debug(`checkUrlAsync()::ok url=${url}`)
        resolve()
      }
    ).catch(
      (error) => {
        DEBUG && _getLogger().debug(`checkUrlAsync()::error url=${url}, error=`, error)
        reject()
      }
    ).finally(
      () => {
        DEBUG && _getLogger().debug(`checkUrlAsync()::finally url=${url}`)
        timeout.clear(ID, url)
      }
    )
  })
}

/**
 * Checks whether connected to internet
 * @return {Promise}
 */
function checkConnectionAsync() {
  return getParallelPromise('ConnectionChecker.checkConnectionAsync', (resolve, reject) => {
    DEBUG && _getLogger().debug('checkConnectionAsync()')
    /* eslint-disable no-use-before-define */
    anyPromise(_checkUrlsAsync(CHECK_INTERNET_URLS))
      .then(() => {
        _onConnectionAttemptSuccess()
        resolve()
      })
      .catch(() => {
        _onConnectionAttemptFailed()
        reject()
      })
  })
}

/**
 * success callback  when connection to the interent is available
 */
function _onConnectionAttemptSuccess() {
  DEBUG && _getLogger().debug('_onConnectionAttemptSuccess() Connection to internet OK')
  if ( !getIsInternetConnected() ) {
    _numFails = 0
    broadcast.publish(NetworkEvent.ON_INTERNET_CONNECTED)
    // reset intervals and other variables
    restart()
  }

  broadcast.publish(NetworkEvent.ON_CONNECTED)
}

/**
 * failure callback when connection to the interent is not available.
 */
function _onConnectionAttemptFailed() {
  DEBUG && _getLogger().debug('_onConnectionAttemptFailed() Connection to internet FAIL')
  if ( getIsInternetConnected() ) {
    ++_numFails
    if (_numFails >= NUM_FAILS_TO_PASS_TO_DISCONNECTED) {
      broadcast.publish(NetworkEvent.ON_INTERNET_DISCONNECTED)
    } else {
      //Retry immediately
      setTimeout(checkConnectionAsync, 0)
    }
  }
  DEBUG && _getLogger().debug('_onConnectionAttemptFailed() Check internet connection, every ',
    TIME_CHECK_INTERNET_DISCONNECTED)
  interval.set(ID, CHECK_CONNECTION_TIMER_ID, checkConnectionAsync, TIME_CHECK_INTERNET_DISCONNECTED)

  broadcast.publish(NetworkEvent.ON_DISCONNECTED)
}

function _checkUrlsAsync(data) {
  const promises = []
  if (data && data.length) {
    for (let i = 0, len = data.length; i < len; i++) {
      promises.push(checkUrlAsync(data[ i ].url, data[ i ].method))
    }
  }
  return promises
}

export default {
  restart,
  stop,
  checkUrlAsync,
  checkConnectionAsync,
}
