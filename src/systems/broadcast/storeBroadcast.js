import { requestLogger } from 'the-browser-logger'
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
    return requestLogger('StoreBroadcast')
  }
}

const storeBroadcast = new StoreBroadcast()

export default storeBroadcast
