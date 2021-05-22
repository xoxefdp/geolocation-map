<template>
  <div v-bind:style="[ mapStyles ]">
    <l-map ref="mape" :options="{zoomControl: false}" :zoom="zoom" :center="center">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker v-if="!overlay" :lat-lng="center" />
      <l-control-scale v-if="!overlay" position="topright" :imperial="true" :metric="true"></l-control-scale>
      <l-control-zoom v-if="!overlay" position="bottomright"></l-control-zoom>
    </l-map>
  </div>
</template>

<script>
// EXTERNAL IMPORTS
import { isNull } from 'the-type-validator'
import PubSub from 'pubsub-js'
import * as L from 'leaflet'
import { LMap, LTileLayer, LMarker, LControlScale, LControlZoom } from 'vue2-leaflet'
// LOCAL IMPORTS
import { GeolocationEvent } from 'systems/Events'
import { getStoredInitialPosition, getStoredCurrentPosition } from 'geolocation/store'

// Workaround for missing marker icon using leaflet with webapack
// https://github.com/vue-leaflet/Vue2Leaflet/issues/28#issuecomment-299042726
L.Icon.Default.imagePath = '/'
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

const Mape = {
  name: 'Mape',
  components: { LMap, LTileLayer, LMarker, LControlScale, LControlZoom },
  data: function() {
    return {
      mape: null,
      centerMap: false,
      // leaflet config
      zoom: null,
      center: null,
      coordinates: null,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: `&copy <a href="https://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> |
        Powered by <a href="https://xisco.dev" target="_blank">xiscodev</a>`,
    }
  },
  props: [
    'overlay',
    'tracking',
  ],
  methods: {
    setCenter (coords) {
      this.center = coords
    },
    setInitialMapPosition () {
      const initialPosition = getStoredInitialPosition()
      console.debug(Mape.name, initialPosition)
      if (!isNull(initialPosition)) {
        const initialCoords = L.latLng(initialPosition.coords.latitude, initialPosition.coords.longitude)
        this.zoom = 6
        this.setCoordinates(initialCoords)
        this.setCenter(initialCoords)
      }
    },
    setCoordinates (position) {
      const newCoords = L.latLng(position.coords.latitude, position.coords.longitude)
      if (this.zoom !== 16) {
        this.zoom = 16
      }
      this.coordinates = newCoords
    },
    setCenterCoordinates () {
      console.debug(Mape.name, 'setCenterCoordinates() coordinates', this.coordinates)
      this.coordinates && this.setCenter(this.coordinates)
      this.coordinates && this.mape.setView(this.coordinates) // sets map view to coordinates
    },
    onCurrentPositionUpdate (message, data) {
      const currentPosition = getStoredCurrentPosition()
      console.debug(Mape.name, 'onCurrentPositionUpdate() message', message)
      console.debug(Mape.name, 'onCurrentPositionUpdate() data', data)
      console.debug(Mape.name, 'onCurrentPositionUpdate() currentPosition', currentPosition)

      if (!isNull(currentPosition)) {
        this.setCoordinates(currentPosition)
        if (this.tracking) {
          this.setCenterCoordinates()
        } else if (this.centerMap) {
          this.setCenterCoordinates()
          this.centerMap = false
        }
      }
    },
    onCenterMap () {
      this.centerMap = true
    },
    onLocatePosition (message, data) {
      console.debug(Mape.name, `onLocatePosition() message: ${message}, data: ${data}`)
      this.setCoordinates(data)
      this.setCenterCoordinates()
    },
  },
  created: function() {
    console.debug(Mape.name, 'created')
    this.setInitialMapPosition()
  },
  beforeMount: function() {
    console.debug(Mape.name, 'beforeMount')

    this.mapStyles = {
      height: window.innerHeight - 20 + 'px',
      width: window.innerWidth - 20 + 'px',
    }
  },
  mounted: function() {
    console.debug(Mape.name, 'mounted')

    // reference to leaflet map
    this.$nextTick(() => {
      this.mape = this.$refs.mape.mapObject
    })

    PubSub.subscribe(GeolocationEvent.ON_GEOLOCATION_CURRENT_POSITION_UPDATE, this.onCurrentPositionUpdate)
    PubSub.subscribe('onCenterMap', this.onCenterMap)
    PubSub.subscribe('locatePosition', this.onLocatePosition)
  },
  updated: function() {
    console.debug(Mape.name, 'updated')
  },
  beforeDestroy: function() {
    console.debug(Mape.name, 'beforeDestroy')

    PubSub.unsubscribe(GeolocationEvent.ON_GEOLOCATION_CURRENT_POSITION_UPDATE)
    PubSub.unsubscribe('onCenterMap')
    PubSub.unsubscribe('locatePosition')
  },
}

export default Mape
</script>

<style>
  @import "~leaflet/dist/leaflet.css";
</style>
