<template>
  <div class="overlay-component">
    <div class="overlay-box">
    <h1 class="permission-denied" v-show="permissionState === 'denied'">Geolocation Denied By User</h1>
    <h1 class="permission-prompt" v-show="permissionState === 'prompt'">Waiting for Geolocation permission prompt</h1>
    </div>
    <div class="overlay-box" v-show="permissionState === 'prompt'">
      <button v-on:click="requestTracking">Prompt</button>
    </div>
  </div>
</template>

<script>
// EXTERNAL IMPORTS
import PubSub from 'pubsub-js'
// LOCAL IMPORTS
import { renewCurrentPosition } from 'geolocation/geolocation'

const Overlay = {
  name: 'Overlay',
  props: [
    'permissionState',
  ],
  methods: {
    requestTracking () {
      renewCurrentPosition().then(() => PubSub.publish('onCenterMap'))
    },
  },
  updated: function() {
    console.debug(Overlay.name, 'updated')
  },
  beforeDestroy: function() {
    console.debug(Overlay.name, 'beforeDestroy')
  },
}
export default Overlay
</script>

<style>
  .overlay-component {
    position: absolute;
    background-color: rgba(255,255,255,0.7);
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-align-content: stretch;
    -ms-flex-line-pack: stretch;
    align-content: stretch;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
  }

  .overlay-box {
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

  .permission-denied {
    color: red;
  }

  .permission-prompt {
    color: black;
  }
</style>
