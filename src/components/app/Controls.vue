<template>
  <div id="data-scheme">
    <p>latitude: <span id="latitude"> {{ latitude }} </span></p>
    <p>longitude: <span id="longitude"> {{ longitude }} </span></p>
    <p>altitude: <span id="altitude"> {{ altitude }} </span></p>
    <p>accuracy: <span id="accuracy"> {{ accuracy }} </span></p>
    <p>altitudeAccuracy: <span id="altitudeAccuracy"> {{ altitudeAccuracy }} </span></p>
    <p>heading: <span id="heading"> {{ heading }} </span></p>
    <p>speed: <span id="speed"> {{ speed }} </span></p>
    <p>timestamp: <span id="timestamp"> {{ timestamp }} </span></p>
    <p>coords updated times: <span id="coordsUpdatedTimes"> {{ coordsUpdatedTimes }} </span></p>
    <p>status update: <span id="statusUpdate"> {{ statusUpdate }} </span></p>
    <p>tracking status: <span id="tracking"> {{ tracking }} </span></p>
    <div style="display:inline-block">
      <div style="display:inline-block">
        <button v-on:click="toggleTracking" :disabled="geoDisabled">
          <span>{{ trackingText }}</span>
        </button>
      </div>
      <div style="display:inline-block">
        <button
          v-bind:class="{ btnShow: tracking, btnHide: !tracking }"
          v-on:click="toggleMap"
          :disabled="geoDisabled"
        >
          <span>{{ mapButtonText }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { isNull } from 'the-type-validator'
import PubSub from 'pubsub-js'
import { GeolocationEvent } from 'systems/Events'
import { startTracking, stopTracking } from 'geolocation/geolocation'
import { getStoredCurrentPosition } from 'geolocation/store'
import { createInterval, destroyInterval, TimeUnit } from 'timer-creator'

const Controls = {
  name: 'Controls',
  data: function() {
    return {
      // input values
      latitude: null,
      longitude: null,
      altitude: null,
      accuracy: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
      timestamp: null,
      statusUpdate: null,
      coordsUpdatedTimes: 0,

      // buttons data
      tracking: false,
      trackingText: 'Track: On',
      mapButtonText: 'Map: On',

      // status
      STATUS_INTERVAL_ID: 'statusInterval',
      STATUS_INTERVAL_TIMER: 10 * TimeUnit.SECOND,
    }
  },
  props: [
    'position',
    'rendered',
    'geoDisabled',
  ],
  methods: {
    // GEOLOCATION METHODS
    _getCurrentPosition () {
      const currentPosition = getStoredCurrentPosition()
      console.debug(Controls.name, '_getCurrentPosition()', currentPosition)
      return currentPosition
    },

    _updateControlsData (newPosition) {
      this.latitude = newPosition.coords.latitude
      this.longitude = newPosition.coords.longitude
      this.altitude = newPosition.coords.altitude
      this.accuracy = newPosition.coords.accuracy
      this.altitudeAccuracy = newPosition.coords.altitudeAccuracy
      this.heading = newPosition.coords.heading
      this.speed = newPosition.coords.speed
      this.timestamp = newPosition.timestamp
    },

    _setPosition (newPosition) {
      this.coordsUpdatedTimes++
      this._updateControlsData(newPosition)
    },

    // GEOLOCATION EVENTS
    _onCurrentPositionUpdate () {
      const positionUpdate = this._getCurrentPosition()
      console.debug(Controls.name, '_onCurrentPositionUpdate()')
      if (!isNull(positionUpdate)) {
        this._setPosition(positionUpdate)
      }
    },
    // ********************************************************

    // MAP METHODS
    renderMap () {
      this._onMapRender()
    },

    destroyMap () {
      this._onMapDestroy()
    },

    toggleMap () {
      console.debug(Controls.name, 'toggleMap() map rendered', this.rendered)
      if (this.rendered) {
        this.destroyMap()
      } else {
        const currentPosition = this._getCurrentPosition()
        console.debug(Controls.name, 'toggleMap() position', currentPosition)
        !!currentPosition && this.renderMap()
      }
    },

    // MAP EVENTS
    _onMapRender () {
      console.debug(Controls.name, '_onMapRender()')
      this.$emit('onmaprenderchange', true)
      this.mapButtonText = 'Map: Off'
    },

    _onMapDestroy () {
      console.debug(Controls.name, '_onMapDestroy()')
      this.$emit('onmaprenderchange', false)
      this.mapButtonText = 'Map: On'
    },
    // ********************************************************

    // TRACKING METHODS
    toggleTracking () {
      this.tracking
        ? stopTracking()
        : startTracking()
    },

    // TRACKING EVENTS
    _onTrackingStarted () {
      console.debug(Controls.name, '_onTrackingStarted()')

      // new Promise((resolve, reject) => {

      // })

      this.tracking = true
      this.trackingText = 'Track: Off'
    },

    _onTrackingStopped () {
      console.debug(Controls.name, '_onTrackingStopped()')

      this.rendered && this.destroyMap()

      // new Promise((resolve, reject) => {

      // })

      this.tracking = false
      this.trackingText = 'Track: On'
    },
    // ********************************************************
  },
  mounted: function() {
    console.debug(Controls.name, 'mounted')

    PubSub.subscribe(GeolocationEvent.ON_GEOLOCATION_CURRENT_POSITION_UPDATE, this._onCurrentPositionUpdate)
    PubSub.subscribe(GeolocationEvent.ON_GEOLOCATION_TRACKING_STARTED, this._onTrackingStarted)
    PubSub.subscribe(GeolocationEvent.ON_GEOLOCATION_TRACKING_STOPPED, this._onTrackingStopped)

    createInterval(this.STATUS_INTERVAL_ID, this.STATUS_INTERVAL_TIMER, () => {
      this.statusUpdate = Date.now()
      console.debug(Controls.name, 'Status updated at ', this.statusUpdate)
    })
  },
  beforeDestroy: function() {
    console.debug(Controls.name, 'beforeDestroy')

    PubSub.unsubscribe(GeolocationEvent.ON_GEOLOCATION_CURRENT_POSITION_UPDATE)
    PubSub.unsubscribe(GeolocationEvent.ON_GEOLOCATION_TRACKING_STARTED)
    PubSub.unsubscribe(GeolocationEvent.ON_GEOLOCATION_TRACKING_STOPPED)

    destroyInterval(this.STATUS_INTERVAL_ID)
  },
}

export default Controls
</script>

<style>
  #data-scheme {
    background-color:rgba(255,255,255,0.6);
    position: absolute;
    bottom: 30px;
    right: 10px;
    z-index: 1000;
    padding: 5px;
    line-height: 0;
  }
  p > span {
    color: red;
  }
  .btnShow {
    display: block;
  }
  .btnHide {
    display: none;
  }
</style>
