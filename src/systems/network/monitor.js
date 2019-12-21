import { requestLogger } from 'the-browser-logger'
import { interval } from 'helpers/time/timer'
import broadcast from 'broadcast/broadcast'
import NetworkEvent from 'systems/network/NetworkEvents'
import { State, TIME_CHECK_INTERNET_DISCONNECTED, CHECK_CONNECTION_TIMER_ID } from 'helpers/network/NetworkConstants'
import { getNetworkState, setNetworkState, setIsInternetConnected } from 'systems/network/storeNetwork'
import internetChecker from 'systems/network/internetChecker'

/**
 * @class NetworkMonitor
 */
class NetworkMonitor {
  /**
   * @constructor
   */
  constructor() {
    this._id = 'NetworkMonitor'
    this.subscribeNetworkEvents()
  }

  _getLogger() {
    return requestLogger(this._id)
  }

  initializeMonitor() {
    DEBUG && this._getLogger().debug('initializeMonitor()')
    interval.set(this._id, CHECK_CONNECTION_TIMER_ID, () => {
      this._checkConnection()
    }, TIME_CHECK_INTERNET_DISCONNECTED)
  }

  _checkConnection() {
    DEBUG && this._getLogger().debug('_checkConnection()')
    broadcast.publish(NetworkEvent.ON_NETWORK_CHECKING)
  }

  /**
   * returns true if device is in connected state and has got the correct IP
   * @return {boolean}
   */
  get isConnected() {
    DEBUG && this._getLogger().debug('isConnected()')
    return getNetworkState() === State.CONNECTED
  }

  /**
   * Network events subscribes
   */
  subscribeNetworkEvents() {
    broadcast.subscribe(NetworkEvent.ON_CONNECTED, this._onNetworkEvent)
    broadcast.subscribe(NetworkEvent.ON_DISCONNECTED, this._onNetworkEvent)
    broadcast.subscribe(NetworkEvent.ON_INTERNET_CONNECTED, this._onNetworkEvent)
    broadcast.subscribe(NetworkEvent.ON_INTERNET_DISCONNECTED, this._onNetworkEvent)
    broadcast.subscribe(NetworkEvent.ON_NETWORK_CHECKING, this._onNetworkEvent)
  }

  /**
   * Resets the network events
   */
  reset() {
    broadcast.unsubscribe(NetworkEvent.ON_CONNECTED, this._onNetworkEvent)
    broadcast.unsubscribe(NetworkEvent.ON_DISCONNECTED, this._onNetworkEvent)
    broadcast.unsubscribe(NetworkEvent.ON_INTERNET_CONNECTED, this._onNetworkEvent)
    broadcast.unsubscribe(NetworkEvent.ON_INTERNET_DISCONNECTED, this._onNetworkEvent)
    broadcast.unsubscribe(NetworkEvent.ON_NETWORK_CHECKING, this._onNetworkEvent)
    internetChecker.stop()
  }

  /**
   * callback function when any of the network event is triggered
   * @param {Object} data
   * @param {Object} emit
   */
  _onNetworkEvent(data, emit) {
    const emitName = emit.emitName

    if (emitName === NetworkEvent.ON_CONNECTED) {
      setNetworkState(State.CONNECTED)
      internetChecker.restart(true)
    } else if (emitName === NetworkEvent.ON_DISCONNECTED) {
      setNetworkState(State.DISCONNECTED)
      internetChecker.stop()
    } else if (emitName === NetworkEvent.ON_INTERNET_CONNECTED) {
      setIsInternetConnected(true)
    } else if (emitName === NetworkEvent.ON_INTERNET_DISCONNECTED) {
      setIsInternetConnected(false)
    } else if (emitName === NetworkEvent.ON_NETWORK_CHECKING) {
      setNetworkState(State.CHECKING)
      internetChecker.checkConnectionAsync()
    }

    broadcast.publish(NetworkEvent.ON_NETWORK_CHANGED)
  }
}

const networkMonitor = new NetworkMonitor()
export default networkMonitor
