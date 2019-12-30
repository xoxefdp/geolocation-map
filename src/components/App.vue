<template>
  <div>
    <Map
      v-bind:rendered="rendered"
      v-bind:position="position"
      v-on:onmaprenderchange="_onMapRenderChange"
    ></Map>
    <Controls
      v-bind:rendered="rendered"
      v-bind:position="position"
      v-on:onmaprenderchange="_onMapRenderChange"
    ></Controls>
  </div>
</template>

<script>
  import { requestLogger } from 'the-browser-logger'
  import { isNull } from 'the-type-validator'
  import broadcast from 'broadcast/broadcast'
  import GeolocationEvent from 'geolocation/GeolocationEvents'
  import { getStoredCurrentPosition } from 'geolocation/storeGeolocation'
  import Map from 'components/app/Map'
  import Controls from 'components/app/Controls'

  const _getLogger = () => {
    return requestLogger(App.name);
  }

  const App = {
    name: 'App',
    components: { Map, Controls },
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
        DEBUG && _getLogger().debug('_setPosition()', position)
        this.position = position
      },

      // EVENTS
      _onCurrentPositionUpdate(positionUpdate) {
        DEBUG && _getLogger().debug('_onCurrentPositionUpdate()', positionUpdate)
        if ( !isNull(positionUpdate) ) {
          this._setPosition(positionUpdate)
        }
      },
      _onMapRenderChange(value) {
        DEBUG && _getLogger().debug('_onMapRenderChange()', value)
        this.rendered = value
      }
    },
    beforeCreate: function() {
      _getLogger().debug('beforeCreate')
    },
    created: function() {
      _getLogger().debug('created')
    },
    beforeMount: function() {
      _getLogger().debug('beforeMount')
    },
    mounted: function() {
      _getLogger().debug('mounted')

      broadcast.subscribe(GeolocationEvent.ON_GEOLOCATION_CURRENT_POSITION_UPDATE, this._onCurrentPositionUpdate)
    },
    beforeUpdate: function() {
      _getLogger().debug('beforeUpdate')
    },
    updated: function() {
      _getLogger().debug('updated')
    },
    beforeDestroy: function() {
      _getLogger().debug('beforeDestroy')

      broadcast.unsubscribe(GeolocationEvent.ON_GEOLOCATION_CURRENT_POSITION_UPDATE)
    },
    destroyed: function() {
      _getLogger().debug('destroyed')
    }
  }

  export default App
</script>
