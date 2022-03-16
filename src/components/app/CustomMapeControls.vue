<template>
  <div class="custom-mape-controls">
    <div class="btns-container">
      <div class="btn-box">
        <button class="btn-cursor" v-on:click="toggleTrackLocation" v-bind:class="tracking ? 'active' : ''">
          <div style="display:none;">Icons made by <a href="https://www.flaticon.com/authors/becris" title="Becris">Becris</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
          <img class="image-cursor" v-bind:class="permissionState === 'denied' ? 'disabled' : ''" :src="cursorImage" alt="tracking position" :disabled="permissionState === 'denied'">
        </button>
      </div>
      <div class="btn-box">
        <button class="btn-gps" v-on:click="checkLocation">
          <div style="display:none;">Iconos diseñados por <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es</a></div>
          <img class="image-gps" v-bind:class="permissionState === 'denied' ? 'disabled' : ''" :src="gpsImage" alt="current position" :disabled="permissionState === 'denied'">
        </button>
      </div>
    </div>
  </div>
</template>

<style>
  .custom-mape-controls {
    position: absolute;
    bottom: 110px;
    right: 10px;
    z-index: 1000;
  }

  .btns-container {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-content: center;
    align-items: flex-start;
  }

  .btn-box {
    width: 30px;
    height: 30px;
    border: 2px solid rgba(0,0,0,0.2);
    border-radius: 4px;
    margin-top: 7px;
    order: 0;
    flex: 0 1 auto;
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

  .disabled {
    filter: opacity(0.3);
  }
</style>

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
    'permissionState',
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
        PubSub.publish('onCenterMap')
      })
    },
  },
}

export default CustomMapeControls
</script>
