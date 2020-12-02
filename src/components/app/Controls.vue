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
        <button v-on:click="toggleTracking">
          <span>{{ trackingText }}</span>
        </button>
      </div>
      <div style="display:inline-block">
        <button v-bind:class="{ btnShow: tracking, btnHide: !tracking }" v-on:click="toggleMap">
          <span>{{ mapButtonText }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Level, setTimestampFormat, setLoggerLevel, requestLogger } from 'the-browser-logger'
import { isNull } from 'the-type-validator'
import broadcast from 'broadcast/broadcast'
import GeolocationEvent from 'geolocation/GeolocationEvents'
import geolocation from 'geolocation/geolocation'
import { getStoredCurrentPosition } from 'geolocation/storeGeolocation'
import { createInterval, destroyInterval, TimeUnit } from 'timer-creator'

setTimestampFormat(true)
DEBUG && setLoggerLevel(Level.DEBUG)

const _getLogger = (component) => {
  return requestLogger(component.name)
}

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
  ],
  methods: {
    // GEOLOCATION METHODS
    _getCurrentPosition() {
      const currentPosition = getStoredCurrentPosition()
      _getLogger(Controls).debug('_getCurrentPosition()', currentPosition)
      return currentPosition
    },

    _updateControlsData(newPosition) {
      this.latitude = newPosition.coords.latitude
      this.longitude = newPosition.coords.longitude
      this.altitude = newPosition.coords.altitude
      this.accuracy = newPosition.coords.accuracy
      this.altitudeAccuracy = newPosition.coords.altitudeAccuracy
      this.heading = newPosition.coords.heading
      this.speed = newPosition.coords.speed
      this.timestamp = newPosition.timestamp
    },

    _setPosition(newPosition) {
      this.coordsUpdatedTimes++
      this._updateControlsData( newPosition )
    },

    // GEOLOCATION EVENTS
    _onCurrentPositionUpdate(positionUpdate) {
      _getLogger(Controls).debug('_onCurrentPositionUpdate()')
      if ( !isNull(positionUpdate) ) {
        this._setPosition(positionUpdate)
      }
    },
    // ********************************************************

    // MAP METHODS
    renderMap() {
      this._onMapRender()
    },

    destroyMap() {
      this._onMapDestroy()
    },

    toggleMap() {
      _getLogger(Controls).debug('toggleMap() map rendered', this.rendered)
      if (this.rendered) {
        this.destroyMap()
      } else {
        const position = this._getCurrentPosition()
        _getLogger(Controls).debug('toggleMap() position', position)
        !!position && this.renderMap()
      }
    },

    // MAP EVENTS
    _onMapRender() {
      _getLogger(Controls).debug('_onMapRender()')
      this.$emit('onmaprenderchange', true)
      this.mapButtonText = 'Map: Off'
    },

    _onMapDestroy() {
      _getLogger(Controls).debug('_onMapDestroy()')
      this.$emit('onmaprenderchange', false)
      this.mapButtonText = 'Map: On'
    },
    // ********************************************************

    // TRACKING METHODS
    startTracking() {
      geolocation.startTracking()
    },

    stopTracking() {
      geolocation.stopTracking()
    },

    toggleTracking() {
      this.tracking ? this.stopTracking() : this.startTracking()
    },

    // TRACKING EVENTS
    _onTrackingStarted() {
      _getLogger(Controls).debug('_onTrackingStarted()')

      this.tracking = true
      this.trackingText = 'Track: Off'
    },

    _onTrackingStopped() {
      _getLogger(Controls).debug('_onTrackingStopped()')

      this.rendered && this.destroyMap()

      this.tracking = false
      this.trackingText = 'Track: On'
    },
    // ********************************************************
  },
  beforeCreate: function() {
    _getLogger(Controls).debug('beforeCreate')
  },
  created: function() {
    _getLogger(Controls).debug('created')
  },
  beforeMount: function() {
    _getLogger(Controls).debug('beforeMount')
  },
  mounted: function() {
    _getLogger(Controls).debug('mounted')

    broadcast.subscribe(GeolocationEvent.ON_GEOLOCATION_CURRENT_POSITION_UPDATE, this._onCurrentPositionUpdate)
    broadcast.subscribe(GeolocationEvent.ON_GEOLOCATION_TRACKING_STARTED, this._onTrackingStarted)
    broadcast.subscribe(GeolocationEvent.ON_GEOLOCATION_TRACKING_STOPPED, this._onTrackingStopped)

    createInterval(this.STATUS_INTERVAL_ID, this.STATUS_INTERVAL_TIMER, () => {
      this.statusUpdate = Date.now()
      _getLogger(Controls).debug('Status updated at ', this.statusUpdate)
    })
  },
  beforeUpdate: function() {
    _getLogger(Controls).debug('beforeUpdate')
  },
  updated: function() {
    _getLogger(Controls).debug('updated')
  },
  beforeDestroy: function() {
    _getLogger(Controls).debug('beforeDestroy')
  },
  destroyed: function() {
    _getLogger(Controls).debug('destroyed')

    broadcast.unsubscribe(GeolocationEvent.ON_GEOLOCATION_CURRENT_POSITION_UPDATE)
    broadcast.unsubscribe(GeolocationEvent.ON_GEOLOCATION_TRACKING_STARTED)
    broadcast.unsubscribe(GeolocationEvent.ON_GEOLOCATION_TRACKING_STOPPED)

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
