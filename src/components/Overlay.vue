<template>
  <div class="overlay-component">
    <div class="overlay-box">
      <!-- <h1 class="permission-denied" v-show="permissionState === 'denied'">Geolocation Denied By User</h1>
    <h1 class="permission-prompt" v-show="permissionState === 'prompt'">Waiting for Geolocation permission prompt</h1> -->
      <h1 class="permission-prompt" v-show="isLoading">Loading...</h1>
    </div>
    <!-- <div class="overlay-box" v-show="permissionState === 'prompt'">
      <button @click="requestTracking">Authorize</button>
    </div> -->
  </div>
</template>

<style scoped>
.overlay-component {
  position: absolute;
  background-color: var(--color-translucid-black);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: -ms-flexbox;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-content: stretch;
  align-items: center;
}

.overlay-box {
  order: 0;
  flex: 0 1 auto;
  align-self: auto;
}

.permission-denied {
  color: red;
}

.permission-prompt {
  color: var(--color-black);
}
</style>

<script>
// EXTERNAL IMPORTS
import PubSub from 'pubsub-js'
// LOCAL IMPORTS
import '../styles/colors.css'
import { renewCurrentPosition } from 'geolocation/geolocation'

const Overlay = {
  name: 'Overlay',
  props: [
    'permissionState',
    'isLoading',
  ],
  methods: {
    requestTracking() {
      renewCurrentPosition().then(() => PubSub.publish('onCenterMap'))
    },
  },
}
export default Overlay
</script>
