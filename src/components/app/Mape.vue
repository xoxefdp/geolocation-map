<template>
  <div v-bind:style="[ mapStyles ]">
    <l-map ref="mape" :options="{zoomControl: false}" :zoom="zoom" :center="center">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-circle-marker v-if="tracking || showCircleMarker" :lat-lng="center" :radius="10" :color="'red'" />
      <div v-if="!overlay">
        <l-marker v-for="item in items" :key="item.id" :lat-lng="_parseToMapCoords({coords: {latitude: item.latitude, longitude: item.longitude}})" />
      </div>
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
import { LMap, LTileLayer, LMarker, LCircleMarker, LControlScale, LControlZoom } from 'vue2-leaflet'
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

const SHOW_POSITION_TME = 2000

const Mape = {
  name: 'Mape',
  components: { LMap, LTileLayer, LMarker, LCircleMarker, LControlScale, LControlZoom },
  data: function() {
    return {
      showCircleMarker: false,
      items: [],
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
    _parseToMapCoords (position) {
      DEBUG && console.debug(Mape.name, '_parseToMapCoords() position', position)
      let mapCoords = null
      if (position instanceof L.LatLng) {
        mapCoords = position
      } else if (position instanceof window.GeolocationPosition || (position.coords && position.coords.longitude && position.coords.latitude)) {
        mapCoords = L.latLng(position.coords.latitude, position.coords.longitude)
      }
      return mapCoords
    },
    setCenter (position) {
      DEBUG && console.debug(Mape.name, 'setCenter() position', position)
      this.center = this._parseToMapCoords(position)
    },
    setInitialMapPosition () {
      const initialPosition = getStoredInitialPosition()
      DEBUG && console.debug(Mape.name, initialPosition)
      if (!isNull(initialPosition)) {
        this.zoom = 6
        this.setCoordinates(initialPosition)
        this.setCenter(initialPosition)
      }
    },
    setCoordinates (position) {
      DEBUG && console.debug(Mape.name, 'setCoordinates() position', position)
      this.coordinates = this._parseToMapCoords(position)
    },
    setCenterCoordinates () {
      DEBUG && console.debug(Mape.name, 'setCenterCoordinates() coordinates', this.coordinates)
      this.coordinates && this.setCenter(this.coordinates)
      this.coordinates && this.mape.setView(this.coordinates) // sets map view to coordinates
    },
    onCurrentPositionUpdate (message, data) {
      const currentPosition = getStoredCurrentPosition()
      DEBUG && console.debug(Mape.name, 'onCurrentPositionUpdate() message', message)
      DEBUG && console.debug(Mape.name, 'onCurrentPositionUpdate() data', data)
      DEBUG && console.debug(Mape.name, 'onCurrentPositionUpdate() currentPosition', currentPosition)

      if (!isNull(currentPosition)) {
        if (this.zoom < 7) {
          this.zoom = 12
        }
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
      this.showCircleMarker = true

      setTimeout(() => {
        this.showCircleMarker = false
      }, SHOW_POSITION_TME)
    },
    onLocatePosition (message, data) {
      DEBUG && console.debug(Mape.name, `onLocatePosition() message: ${message}, data: ${data} zoom: ${this.zoom}`)
      if (this.zoom < 7) {
        this.zoom = 12
      }
      this.setCoordinates(data)
      this.setCenterCoordinates()
    },
    onSearchLocation (message, data) {
      DEBUG && console.debug(Mape.name, `onSearchLocation() message: ${message}, data: ${data}`)
      this.items = data
    },
  },
  created: function() {
    DEBUG && console.debug(Mape.name, 'created')
    this.setInitialMapPosition()
  },
  beforeMount: function() {
    DEBUG && console.debug(Mape.name, 'beforeMount')

    let height = window.innerHeight

    if (window.innerWidth <= 600) {
      height = height - 63
    }

    this.mapStyles = {
      height: height + 'px',
      width: window.innerWidth + 'px',
    }
  },
  mounted: function() {
    DEBUG && console.debug(Mape.name, 'mounted')

    // reference to leaflet map
    this.$nextTick(() => {
      this.mape = this.$refs.mape.mapObject
    })

    PubSub.subscribe(GeolocationEvent.ON_GEOLOCATION_CURRENT_POSITION_UPDATE, this.onCurrentPositionUpdate)
    PubSub.subscribe('onCenterMap', this.onCenterMap)
    PubSub.subscribe('locatePosition', this.onLocatePosition)
    PubSub.subscribe('searchLocation', this.onSearchLocation)
  },
  beforeDestroy: function() {
    DEBUG && console.debug(Mape.name, 'beforeDestroy')

    PubSub.unsubscribe(GeolocationEvent.ON_GEOLOCATION_CURRENT_POSITION_UPDATE)
    PubSub.unsubscribe('onCenterMap')
    PubSub.unsubscribe('locatePosition')
    PubSub.unsubscribe('searchLocation')
  },
}

export default Mape
</script>

<style>
  @import "~leaflet/dist/leaflet.css";
</style>
