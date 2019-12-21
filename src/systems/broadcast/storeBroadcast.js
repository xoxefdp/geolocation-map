import { getInstance as getLoggerInstance } from 'helpers/logger'
import BroadcastBase from 'broadcast/BroadcastBase'

/**
 * Class to handle notifications from the Store
 *
 * @class StoreBroadcast
 * @extends {BroadcastBase}
 */
class StoreBroadcast extends BroadcastBase {
  constructor() {
    super()
  }

  /**
   * @override
   */
  _getLogger() {
    return getLoggerInstance('StoreBroadcast')
  }
}

const storeBroadcast = new StoreBroadcast()

export default storeBroadcast
