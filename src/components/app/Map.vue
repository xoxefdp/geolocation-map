<template>
  <div id="map" v-bind:style="[ mapStyles ]">
    <l-map :zoom="zoom" :center.sync="coordinates" @click="createOrMovePopup" v-if="rendered">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker :lat-lng.sync="coordinates" />
      <l-popup :content="popupContent" />
    </l-map>
  </div>
</template>

<script>
import { requestLogger } from 'the-browser-logger'
import { latLng } from 'leaflet'
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'

const _getLogger = () => {
  // eslint-disable-next-line no-use-before-define
  return requestLogger(Map.name)
}

const Map = {
  name: 'Map',
  components: { LMap, LTileLayer, LMarker, LPopup },
  data: function() {
    return {
      popupCoordinates: null,
      popupContent: '',

      // leaflet data
      zoom: 17,
      coordinates: null,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy <a href="https://www.openstreetmap.org/" target="_blank">OpenStreetMap</a>, ' +
        'Powered by <a href="https://deepertech.com" target="_blank">Deepertech</a>',
      // ************
    }
  },
  props: [
    'position',
    'rendered',
  ],
  methods: {
    createOrMovePopup(event) {
      this.popupCoordinates = {
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      }
      DEBUG && _getLogger().debug('createOrMovePopup()', this.popupCoordinates)
    },
  },
  watch: {
    position: function(newPosition, oldPosition) {
      this.coordinates = latLng(newPosition.coords.latitude, newPosition.coords.longitude)
      this.popupContent = !!this.popupCoordinates ? 'Coordinates: ' + this.popupCoordinates.toString() : ''
    },
  },
  beforeCreate: function() {
    DEBUG && _getLogger().debug('beforeCreate')

    this.mapStyles = {
      height: window.innerHeight - 20 + 'px',
      width: window.innerWidth - 20 + 'px',
    }
  },
  created: function() {
    DEBUG && _getLogger().debug('created')
  },
  beforeMount: function() {
    DEBUG && _getLogger().debug('beforeMount')
  },
  mounted: function() {
    DEBUG && _getLogger().debug('mounted')
  },
  beforeUpdate: function() {
    DEBUG && _getLogger().debug('beforeUpdate')
  },
  updated: function() {
    DEBUG && _getLogger().debug('updated')
  },
  beforeDestroy: function() {
    DEBUG && _getLogger().debug('beforeDestroy')
  },
  destroyed: function() {
    DEBUG && _getLogger().debug('destroyed')
  },
}

export default Map
</script>

<style>
  @import "~leaflet/dist/leaflet.css";
</style>
