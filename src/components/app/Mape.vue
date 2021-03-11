<template>
  <div id="map" v-bind:style="[ mapStyles ]">
    <l-map :zoom="zoom" :center="coordinates" @click="createOrMovePopup" v-if="rendered">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker :lat-lng="coordinates" />
    </l-map>
  </div>
</template>

<script>
import { latLng } from 'leaflet'
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'

const Mape = {
  name: 'Mape',
  components: { LMap, LTileLayer, LMarker },
  data: function() {
    return {
      popupCoordinates: null,
      popupContent: '',
      // leaflet data
      zoom: 17,
      coordinates: null,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: `&copy <a href="https://www.openstreetmap.org/" target="_blank">OpenStreetMap</a>
        Powered by <a href="https://deepertech.com" target="_blank">Deepertech</a>`,
      // ************
    }
  },
  props: [
    'position',
    'rendered',
  ],
  methods: {
    createOrMovePopup (event) {
      this.popupCoordinates = {
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      }
      console.debug(Mape.name, 'createOrMovePopup()', this.popupCoordinates)
    },
  },
  watch: {
    position: function(newPosition, oldPosition) {
      this.coordinates = latLng(newPosition.coords.latitude, newPosition.coords.longitude)
      this.popupContent = this.popupCoordinates ? 'Coordinates: ' + this.popupCoordinates.toString() : ''
    },
  },
  beforeCreate: function() {
    console.debug(Mape.name, 'beforeCreate')

    this.mapStyles = {
      height: window.innerHeight - 20 + 'px',
      width: window.innerWidth - 20 + 'px',
    }
  },
}

export default Mape
</script>

<style>
  @import "~leaflet/dist/leaflet.css";
</style>
