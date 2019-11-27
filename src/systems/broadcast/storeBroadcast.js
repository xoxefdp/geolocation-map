import { getInstance as getLoggerInstance } from 'helpers/logger'
import BroadcastBase from 'broadcast/BroadcastBase'

/**
 * Class to handle notifications from the Store
 *
 * @class StoreBroadcast
 * @extends {BroadcastBase}
 */
class StoreBroadcast extends BroadcastBase {
  _getLogger() {
    return getLoggerInstance('StoreBroadcast')
  }
}

const storeBroadcast = new StoreBroadcast()

export default storeBroadcast
