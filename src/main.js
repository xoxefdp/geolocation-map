import { Level, setTimestampFormat, setLoggerLevel, requestLogger } from 'the-browser-logger'
import initAsync from './initAsync'
import { createUI } from 'systems/bootUI'

setTimestampFormat(true)
DEBUG && setLoggerLevel(Level.DEBUG)

const ID = 'main'
const _getLogger = () => {
  return requestLogger(ID)
}

initAsync().finally(
  () => {
    _getLogger().debug('initAsync()')
    createUI()
  }
)
