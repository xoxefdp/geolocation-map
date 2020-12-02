<template>
  <div>
    <Mape
      :rendered="rendered"
      :position="position"
      v-on:onmaprenderchange="_onMapRenderChange"
    />
    <Controls
      :rendered="rendered"
      :position="position"
      v-on:onmaprenderchange="_onMapRenderChange"
    />
  </div>
</template>

<script>
import { Level, setTimestampFormat, setLoggerLevel, requestLogger } from 'the-browser-logger'
import { isNull } from 'the-type-validator'
import broadcast from 'broadcast/broadcast'
import GeolocationEvent from 'geolocation/GeolocationEvents'
import Mape from 'components/app/Mape'
import Controls from 'components/app/Controls'

setTimestampFormat(true)
DEBUG && setLoggerLevel(Level.DEBUG)

const _getLogger = (component) => {
  return requestLogger(component.name)
}

const App = {
  name: 'App',
  components: { Mape, Controls },
  data: function() {
    return {
      rendered: false,
      position: {
        latitude: null,
        longitude: null,
        altitude: null,
        accuracy: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
        timestamp: null,
      },
    }
  },
  methods: {
    // METHODS
    _setPosition(position) {
      _getLogger(App).debug('_setPosition()', position)
      this.position = position
    },

    // EVENTS
    _onCurrentPositionUpdate(positionUpdate) {
      _getLogger(App).debug('_onCurrentPositionUpdate()', positionUpdate)
      if ( !isNull(positionUpdate) ) {
        this._setPosition(positionUpdate)
      }
    },
    _onMapRenderChange(value) {
      _getLogger(App).debug('_onMapRenderChange()', value)
      this.rendered = value
    },
  },
  beforeCreate: function() {
    _getLogger(App).debug('beforeCreate')
  },
  created: function() {
    _getLogger(App).debug('created')
  },
  beforeMount: function() {
    _getLogger(App).debug('beforeMount')
  },
  mounted: function() {
    _getLogger(App).debug('mounted')

    broadcast.subscribe(GeolocationEvent.ON_GEOLOCATION_CURRENT_POSITION_UPDATE,
      this._onCurrentPositionUpdate
    )
  },
  beforeUpdate: function() {
    _getLogger(App).debug('beforeUpdate')
  },
  updated: function() {
    _getLogger(App).debug('updated')
  },
  beforeDestroy: function() {
    _getLogger(App).debug('beforeDestroy')

    broadcast.unsubscribe(GeolocationEvent.ON_GEOLOCATION_CURRENT_POSITION_UPDATE)
  },
  destroyed: function() {
    _getLogger(App).debug('destroyed')
  },
}

export default App
</script>
