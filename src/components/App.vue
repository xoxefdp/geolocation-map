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
      :geoDisabled="geoDisabled"
      v-on:onmaprenderchange="_onMapRenderChange"
    />
  </div>
</template>

<script>
import { isNull } from 'the-type-validator'
import PubSub from 'pubsub-js'
import { GeolocationEvent, PermissionEvent } from 'systems/Events'
import { isGeolocationDenied } from 'geolocation/geolocation'
import { STORE_NAME as GeoStore, getStoredCurrentPosition } from 'geolocation/store'
import { getStoredCurrentState } from 'permissions/store'
import Mape from 'components/app/Mape'
import Controls from 'components/app/Controls'

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
      geoDisabled: isGeolocationDenied(),
    }
  },
  methods: {
    // METHODS
    _setPosition (position) {
      console.debug(App.name, '_setPosition()', position)
      this.position = position
    },

    _setGeoDisabled () {
      const permission = getStoredCurrentState(GeoStore)
      console.debug(App.name, '_setGeoDisabled()', permission)
      this.geoDisabled = isGeolocationDenied()
    },

    // EVENTS
    _onCurrentPositionUpdate () {
      const positionUpdate = getStoredCurrentPosition()
      console.debug(App.name, '_onCurrentPositionUpdate()', positionUpdate)
      if (!isNull(positionUpdate)) {
        this._setPosition(positionUpdate)
      }
    },

    _onMapRenderChange (value) {
      console.debug(App.name, '_onMapRenderChange()', value)
      this.rendered = value
    },
  },
  mounted: function() {
    console.debug(App.name, 'mounted')

    PubSub.subscribe(GeolocationEvent.ON_GEOLOCATION_CURRENT_POSITION_UPDATE,
      this._onCurrentPositionUpdate
    )

    PubSub.subscribe(PermissionEvent.ON_PERMISSION_GRANTED, this._setGeoDisabled)
    PubSub.subscribe(PermissionEvent.ON_PERMISSION_PROMPT, this._setGeoDisabled)
    PubSub.subscribe(PermissionEvent.ON_PERMISSION_DENIED, this._setGeoDisabled)
  },
  beforeDestroy: function() {
    console.debug(App.name, 'beforeDestroy')

    PubSub.unsubscribe(GeolocationEvent.ON_GEOLOCATION_CURRENT_POSITION_UPDATE)
  },
}

export default App
</script>
