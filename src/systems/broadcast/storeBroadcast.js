import { Level, setTimestampFormat, setLoggerLevel, requestLogger } from 'the-browser-logger'
import BroadcastBase from 'broadcast/BroadcastBase'

setTimestampFormat(true)
DEBUG && setLoggerLevel(Level.DEBUG)

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
