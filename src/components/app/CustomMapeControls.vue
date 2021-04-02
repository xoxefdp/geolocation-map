<template>
  <div class="custom-mape-controls">
    <div class="btns-container">
      <div class="btn-box">
        <button class="btn-cursor" v-on:click="toggleTrackLocation" v-bind:class="tracking ? 'active' : ''">
          <div style="display:none;">Icons made by <a href="https://www.flaticon.com/authors/becris" title="Becris">Becris</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
          <img class="image-cursor" :src="cursorImage" alt="tracking position">
        </button>
      </div>
      <div class="btn-box">
        <button class="btn-gps" v-on:click="checkLocation">
          <div style="display:none;">Iconos diseñados por <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es</a></div>
          <img class="image-gps" :src="gpsImage" alt="current position">
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// EXTERNAL IMPORTS
import { isNull } from 'the-type-validator'
import PubSub from 'pubsub-js'
// LOCAL IMPORTS
import cursorImage from 'assets/img/cursor-24.png'
import gpsImage from 'assets/img/gps-24.png'
import { startTracking, renewCurrentPosition, stopTracking } from 'geolocation/geolocation'
import { getStoredTrackingWatcher } from 'geolocation/store'

const CustomMapeControls = {
  name: 'CustomMapeControls',
  data: function() {
    return {
      cursorImage: cursorImage,
      gpsImage: gpsImage,
    }
  },
  props: [
    'tracking',
  ],
  methods: {
    toggleTrackLocation () {
      const trackingWatcher = getStoredTrackingWatcher()
      if (isNull(trackingWatcher)) {
        startTracking()
      } else {
        stopTracking()
      }
    },
    checkLocation () {
      renewCurrentPosition().finally(() => {
        PubSub.publish('fillAddress')
        PubSub.publish('onCenterMap')
      })
    },
  },
  mounted: function() {
    console.debug(CustomMapeControls.name, 'mounted')
  },
  updated: function() {
    console.debug(CustomMapeControls.name, 'updated')
  },
  beforeDestroy: function() {
    console.debug(CustomMapeControls.name, 'beforeDestroy')
  },
}

export default CustomMapeControls
</script>

<style>
  .custom-mape-controls {
    position: absolute;
    bottom: 110px;
    right: 14px;
    z-index: 1000;
  }

  .btns-container {
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-flex-wrap: nowrap;
    -ms-flex-wrap: nowrap;
    flex-wrap: nowrap;
    -webkit-justify-content: flex-start;
    -ms-flex-pack: start;
    justify-content: flex-start;
    -webkit-align-content: center;
    -ms-flex-line-pack: center;
    align-content: center;
    -webkit-align-items: flex-start;
    -ms-flex-align: start;
    align-items: flex-start;
  }

  .btn-box {
    width: 30px;
    height: 30px;
    border: 2px solid rgba(0,0,0,0.2);
    border-radius: 4px;
    margin-top: 7px;
    -webkit-order: 0;
    -ms-flex-order: 0;
    order: 0;
    -webkit-flex: 0 1 auto;
    -ms-flex: 0 1 auto;
    flex: 0 1 auto;
    -webkit-align-self: auto;
    -ms-flex-item-align: auto;
    align-self: auto;
  }

  .btn-gps, .btn-cursor {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    border: none;
    background-color: white;
    cursor: pointer;
  }

  .image-gps, .image-cursor {
    vertical-align: middle;
  }

  .active {
    background-color: #90EE90;
  }
</style>
