// import '@babel/polyfill'
import { requestLogger } from 'the-browser-logger'
import initAsync from './initAsync'
import { createUI } from 'systems/bootUI'

const ID = 'main'
const _getLogger = () => {
  return requestLogger(ID)
}

initAsync().finally(
  () => {
    DEBUG && _getLogger().debug('initAsync()')
    createUI()
  }
)
