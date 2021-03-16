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
import { isNull } from 'the-type-validator'
import { GeolocationEvent } from 'systems/Events'
import { getStoredCurrentPosition } from 'geolocation/store'
import PubSub from 'pubsub-js'
import * as L from 'leaflet'
import { LMap, LTileLayer, LMarker, LControlScale, LControlZoom } from 'vue2-leaflet'

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
      // leaflet config
      zoom: 17,
      center: L.latLng(10.471654, -68.020949),
      coordinates: null,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: `&copy <a href="https://www.openstreetmap.org/" target="_blank">OpenStreetMap</a>
        Powered by <a href="https://deepertech.com" target="_blank">Deepertech</a>`,
    }
  },
  props: [
    'overlay',
  ],
  methods: {
    setCenter (coords) {
      this.center = coords
    },
    setCoordinates (coordinates) {
      this.coordinates = coordinates
    },
    getCoordinates () {
      return this.coordinates
    },
    setCenterCoordinates () {
      this.setCenter(this.coordinates)
      this.mape.setView(this.coordinates) // sets map view to coordinates
    },
    onCurrentPositionUpdate () {
      const positionUpdate = getStoredCurrentPosition()
      console.debug(Mape.name, 'onCurrentPositionUpdate()', positionUpdate)
      if (!isNull(positionUpdate)) {
        const coords = L.latLng(positionUpdate.coords.latitude, positionUpdate.coords.longitude)
        this.setCoordinates(coords)
      }
    },
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
    PubSub.subscribe('onTrackMap', this.setCenterCoordinates)
    PubSub.subscribe('onCenterMap', this.setCenterCoordinates)
  },
  updated: function() {
    console.debug(Mape.name, 'updated')
  },
  beforeDestroy: function() {
    console.debug(Mape.name, 'beforeDestroy')

    PubSub.unsubscribe(GeolocationEvent.ON_GEOLOCATION_CURRENT_POSITION_UPDATE)
    PubSub.unsubscribe('onTrackMap')
    PubSub.unsubscribe('onCenterMap')
  },
}

export default Mape
</script>

<style>
  @import "~leaflet/dist/leaflet.css";
</style>
