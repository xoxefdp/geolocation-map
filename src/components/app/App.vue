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
          <button id="trackingButton" v-on:click="toggleTracking">
            <span id="trackingOn" style="display:block">Track: On</span>
            <span id="trackingOff" style="display:none">Track: Off</span>
          </button>
        </div>
        <div style="display:inline-block">
          <button id="mapButton" style="display:none" v-on:click="toggleMap">
            <span id="showMap" style="display:block">Map: On</span>
            <span id="hideMap" style="display:none">Map: Off</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // import Map from 'components/app/Map'
  // import Controls from 'components/app/Controls'

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
        mapRendered: false,
        popup: null,
        mapZoom: 17,
        navListener: null,
        mapMarker: null,
        mapButton: null,
        showMap: null,
        hideMap: null,
        trackingOn: null,
        trackingOff: null,
        tracking: false,
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
        lastCoordsUpdate: null
      }
    },
    methods: {
      _printCurrentPosition() {
        // _printCoordsToBody( _getCurrentPosition() )
        navigator.geolocation.getCurrentPosition(
          (position) => {
            _setPosition(position)
          }, (error) => {
            console.log(error)
          }
        )
      },

      _getCurrentPosition() {
        return this.currentPosition
      },

      _setCurrentPosition(position) {
        this.currentPosition = position
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
        this._setCurrentPosition(position)
        this._printCoordsToBody( this._getCurrentPosition() )
      },

      _revealPosition(position) {
        console.log(position)
      },

      _positionDenied(error) {
        console.log(error)
      },

      updateCurrentBody(position) {
        this._revealPosition(position)
        this._setPosition(position)
        // !mapRendered && renderMap(position.coords)
        this.mapRendered && this.updateMap(position.coords)
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

        this.toggleMapButtonMessages()
      },

      removeMap() {
        this.mapMarker.remove()
        this.mapElement.remove()
        this.map.setAttribute('style', '')
        this.map.className = ''
        this.map.innerHTML = ''
        this.toggleMapButtonMessages()
      },

      toggleMap() {
        this.mapRendered ? this.removeMap() : this.renderMap( this._getCurrentPosition().coords )
        this.mapRendered = !this.mapRendered
      },

      toggleMapButton() {
        this.mapButton.style.display = this.mapButton.style.display == 'block' ? 'none' : ' block'
      },


      toggleMapButtonMessages() {
        this.showMap.style.display = this.showMap.style.display == 'block' ? 'none' : ' block'
        this.hideMap.style.display = this.hideMap.style.display == 'block' ? 'none' : ' block'
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

      enableTracking() {
        this.toggleMapButton()
        // this.navListener = navigator.geolocation.watchPosition(this.updateCurrentBody, this._positionDenied, null)
        geolocation.startTracking()
        this.toggleTrackingButton()
      },

      disableTracking() {
        this.toggleMap()
        this.toggleMapButton()
        // this.navListener = null
        geolocation.stopTracking()
        this.toggleTrackingButton()
      },

      toggleTracking() {
        this.tracking ? this.disableTracking() : this.enableTracking()
        this.tracking = !this.tracking
      },

      toggleTrackingButton() {
        this.trackingOn.style.display = this.trackingOn.style.display == 'block' ? 'none' : ' block'
        this.trackingOff.style.display = this.trackingOff.style.display == 'block' ? 'none' : ' block'
      }
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
      this.mapButton = document.getElementById('mapButton')
      this.showMap = document.getElementById('showMap')
      this.hideMap = document.getElementById('hideMap')
      this.trackingOn = document.getElementById('trackingOn')
      this.trackingOff = document.getElementById('trackingOff')

      setInterval(() => {
        let date = Date.now()
        console.log(date)
        this.statusUpdate.textContent = date
        // console.log(geoPermissionStatus.state)
        if (navigator.geolocation) {
          // _printCurrentPosition()
          this.lastCoordsUpdate.textContent = this.statusUpdate.textContent - this.timestamp.textContent
        }
      }, 1000)
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
    }
  }

  export default App
</script>
<style>

</style>