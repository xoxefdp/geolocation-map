import { Level, setTimestampFormat, setLoggerLevel, requestLogger } from 'the-browser-logger'
import { isNull } from 'the-type-validator'
import broadcast from 'broadcast/broadcast'
import { BootEvent } from 'systems/Events'
import * as L from 'leaflet'
import Vue from 'vue'
import App from 'components/App'

// Workaround for missing marker icon using leaflet with webapack
// https://github.com/vue-leaflet/Vue2Leaflet/issues/28#issuecomment-299042726
L.Icon.Default.imagePath = '/'
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

setTimestampFormat(true)
DEBUG && setLoggerLevel(Level.DEBUG)

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
  _getLogger().debug('createUI()')
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
  _getLogger().debug('destroyUI()')
  ui = null

  _destroyRootElement()
  _createAppendRootElement()

  broadcast.publish(BootEvent.ON_APP_DESTROYED)
}

const rebootUI = () => {
  _getLogger().debug('rebootUI()')
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
