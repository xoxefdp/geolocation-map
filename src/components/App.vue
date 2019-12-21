<template>
  <div>
    <div id="map"></div>
    <div id="data-scheme">
      <p>latitude: <span id="latitude"></span></p>
      <p>longitude: <span id="longitude"></span></p>
      <p>altitude: <span id="altitude"></span></p>
      <p>accuracy: <span id="accuracy"></span></p>
      <p>altitudeAccuracy: <span id="altitudeAccuracy"></span></p>
      <p>heading: <span id="heading"></span></p>
      <p>speed: <span id="speed"></span></p>
      <p>coords updated times: <span id="coordsUpdatedTimes"></span></p>
      <p>timestamp: <span id="timestamp"></span></p>
      <p>status update: <span id="statusUpdate"></span></p>
      <p>last coords update: <span id="lastCoordsUpdate"></span></p>
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
  </div>
</template>

<script>
  import { requestLogger } from 'the-browser-logger'
  import { isNull } from 'helpers/utilTypes'
  import geolocation from 'geolocation/geolocation'
  import { getStoredCurrentPosition } from 'geolocation/storeGeolocation'
  import GeolocationEvent from 'geolocation/GeolocationEvents'
  import broadcast from 'broadcast/broadcast'
  import { interval } from 'helpers/time/timer'

  // import Map from 'components/app/Map'
  // import Controls from 'components/app/Controls'

  const _getLogger = () => {
    return requestLogger(App.name);
  }

  const App = {
    name: 'App',
    // components: { Map, Controls },
    data: function() {
      return {
        currentPosition: null,
        geoPermissionStatus: null,
        countCoordsUpdate: 0,
        map: null,
        mapElement: null,
        popup: null,
        mapZoom: 17,

        mapMarker: null,
        latitude: null,
        longitude: null,
        altitude: null,
        accuracy: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
        timestamp: null,
        statusUpdate: null,
        coordsUpdatedTimes: null,
        lastCoordsUpdate: null,

        tracking: false,
        trackingText: 'Track: On',
        trackingInterval: 'trackingInterval',
        mapRendered: false,
        mapButtonText: 'Map: On'
      }
    },
    methods: {
      _getCurrentPosition() {
        const currentPosition = getStoredCurrentPosition()
        DEBUG && _getLogger().debug('_getCurrentPosition()', currentPosition)
        return currentPosition
      },

      _printCoordsToBody(data) {
        this.latitude.textContent = data.coords.latitude
        this.longitude.textContent = data.coords.longitude
        this.altitude.textContent = data.coords.altitude
        this.accuracy.textContent = data.coords.accuracy
        this.altitudeAccuracy.textContent = data.coords.altitudeAccuracy
        this.heading.textContent = data.coords.heading
        this.speed.textContent = data.coords.speed
        this.timestamp.textContent = data.timestamp
        // lastCoordsUpdate.textContent = 0
        this.coordsUpdatedTimes.textContent = this.countCoordsUpdate
      },

      _setPosition(position) {
        this.countCoordsUpdate++
        this._printCoordsToBody( position )
      },

      updateCurrentBody(positionUpdate) {
        DEBUG && _getLogger().debug('updateCurrentBody()')
        const currentPosition = this._getCurrentPosition()
        const isStored = currentPosition === positionUpdate
        const position = isStored ? currentPosition : positionUpdate
        this._setPosition(position)
      },

      renderMap(coordinates) {
        this.map = document.getElementById('map')
        this.map.style.width = (window.innerWidth - 40) + 'px'
        this.map.style.height = (window.innerHeight - 40) + 'px'

        this.mapElement = L.map(this.map)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {
          foo: 'bar',
          attribution: 'Map data &copy <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
        }).addTo(this.mapElement)

        this.mapMarker = L.marker([coordinates.latitude, coordinates.longitude]).addTo(this.mapElement)

        this.popup = L.popup()
        
        this.mapElement.on('click', this.onMapClick)

        this.updateMap(coordinates)

        this.toggleMapButtonText()
      },

      onMapClick(e) {
        this.updateMap({latitude: e.latlng.lat, longitude: e.latlng.lng})
        this.popup
          .setLatLng(e.latlng)
          .setContent("Coordinates: " + e.latlng.toString())
          .openOn(this.mapElement)
      },

      updateMap(coordinates) {
        let position = [coordinates.latitude, coordinates.longitude]
        this.mapElement.setView(position, this.mapZoom)
        this.mapMarker.setLatLng(position)
      },

      removeMap(forceDisable = null) {
        this.mapMarker.remove()
        this.mapElement.remove()
        this.map.setAttribute('style', '')
        this.map.className = ''
        this.map.innerHTML = ''
        this.toggleMapButtonText(forceDisable)
      },

      toggleMap() {
        if (this.mapRendered) {
          this.removeMap()
        } else {
          const position = this._getCurrentPosition()
          const coords = position.coords
          this.renderMap( coords )
        }
      },

      toggleMapButtonText(forceDisable = null) {
        this.mapRendered = !!forceDisable ? !forceDisable : !this.mapRendered
        this.mapButtonText = this.mapRendered ? 'Map: Off' : 'Map: On'
      },

      enableTracking() {
        geolocation.startTracking()
      },

      disableTracking() {
        // this.removeMap(true)
        geolocation.stopTracking()
      },

      toggleTracking() {
        this.tracking ? this.disableTracking() : this.enableTracking()
      },

      toggleTrackingText() {
        this.tracking = !this.tracking
        this.trackingText = this.tracking ? 'Track: Off' : 'Track: On'
      },

      toggleTrackingInterval() {
        const intervalCallback = function() {
          console.log( Date.now() )
        }

        this.trackingInterval = isNull(this.trackingInterval)
          ? interval.set(App.name, this.trackingInterval, () => { intervalCallback() }, 2000)
          : interval.clear(App.name, this.trackingInterval)

        this.toggleTrackingText()
      },
    },
    beforeCreate: function() {
      console.log('beforeCreate')
    },
    created: function() {
      console.log('created')
    },
    beforeMount: function() {
      console.log('beforeMount')
    },
    mounted: function() {
      console.log('mounted')

      broadcast.subscribe(GeolocationEvent.ON_GEOLOCATION_CURRENT_POSITION_UPDATE, this.updateCurrentBody)
      broadcast.subscribe(GeolocationEvent.ON_GEOLOCATION_TRACKING_STARTED, this.toggleTrackingInterval)
      broadcast.subscribe(GeolocationEvent.ON_GEOLOCATION_TRACKING_STOPPED, this.toggleTrackingInterval)

      this.latitude = document.getElementById('latitude')
      this.longitude = document.getElementById('longitude')
      this.altitude = document.getElementById('altitude')
      this.accuracy = document.getElementById('accuracy')
      this.altitudeAccuracy = document.getElementById('altitudeAccuracy')
      this.heading = document.getElementById('heading')
      this.speed = document.getElementById('speed')
      this.timestamp = document.getElementById('timestamp')
      this.statusUpdate = document.getElementById('statusUpdate')
      this.coordsUpdatedTimes = document.getElementById('coordsUpdatedTimes')
      this.lastCoordsUpdate = document.getElementById('lastCoordsUpdate')
    },
    beforeUpdate: function() {
      console.log('beforeUpdate')
    },
    updated: function() {
      console.log('updated')
    },
    beforeDestroy: function() {
      console.log('beforeDestroy')
    },
    destroyed: function() {
      console.log('destroyed')

      broadcast.unsubscribe(GeolocationEvent.ON_GEOLOCATION_CURRENT_POSITION_UPDATE)
      broadcast.unsubscribe(GeolocationEvent.ON_GEOLOCATION_TRACKING_STARTED)
      broadcast.unsubscribe(GeolocationEvent.ON_GEOLOCATION_TRACKING_STOPPED)
    }
  }

  export default App
</script>
<style>
  @import "~leaflet/dist/leaflet.css";

  #map {
    padding: 10px;
  }

  #data-scheme {
    background-color:rgba(255,255,255,0.6);
    position: absolute;
    bottom: 30px;
    right: 10px;
    z-index: 1000;
    padding: 5px;
    line-height: 0;
  }
  #latitude, #longitude, #altitude, #accuracy, #altitudeAccuracy, #heading, #speed, #coordsUpdatedTimes, #timestamp, #statusUpdate, #lastCoordsUpdate {
    color: red;
  }

  .btnShow {
    display: block;
  }

  .btnHide {
    display: none;
  }
</style>
