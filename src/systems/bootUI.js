import { requestLogger } from 'the-browser-logger'
import { isNull } from 'helpers/utilTypes'
import broadcast from 'broadcast/broadcast'
import { BootEvent } from 'systems/Events'
import * as L from 'leaflet'
import Vue from 'vue'
import App from 'components/App'

const ID = 'bootUI',
  bodyElement = document.getElementsByTagName('body')[ 0 ]
let ui = null

const _getLogger = () => {
  return requestLogger(ID)
}

const _uiExist = () => {
  const rootElement = bodyElement.children[ 0 ]
  return !isNull(ui) && !isNull(rootElement)
}

const createUI = () => {
  DEBUG && _getLogger().debug('createUI()')
  Vue.use(L)

  ui = new Vue({
    el: '#root',
    components: { App },
    template: '<App />',
  })

  broadcast.publish(BootEvent.ON_APP_INITIATED)
}

const _destroyRootElement = () => {
  const oldRootElement = bodyElement.children[ 0 ]
  bodyElement.removeChild(oldRootElement)
}

const _createAppendRootElement = () => {
  const newRootElement = document.createElement('div')
  newRootElement.setAttribute('id', 'root')
  bodyElement.prepend(newRootElement)
}

const destroyUI = () => {
  DEBUG && _getLogger().debug('destroyUI()')
  ui = null

  _destroyRootElement()
  _createAppendRootElement()

  broadcast.publish(BootEvent.ON_APP_DESTROYED)
}

const rebootUI = () => {
  DEBUG && _getLogger().debug('rebootUI()')
  _uiExist() && destroyUI()
  createUI()
  broadcast.publish(BootEvent.ON_APP_REBOOTED)
}

const getUI = () => {
  return ui
}

export {
  createUI,
  destroyUI,
  rebootUI,
  getUI,
}
