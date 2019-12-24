// import '@babel/polyfill'
import { requestLogger } from 'the-browser-logger'
import initAsync from './initAsync'
import { createUI } from 'systems/bootUI'

initAsync().finally(
  () => {
    DEBUG && requestLogger().debug('initAsync()')
    createUI()
  }
)
