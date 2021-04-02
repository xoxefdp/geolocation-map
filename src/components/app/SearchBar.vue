<template>
  <div class="search-bar">
    <div>
      <div>
        <input type="text" class="form-control" placeholder="ADDRESS" name="address" id="address" v-model="address">
      </div>
      <div>
        <button type="button" class="btn btn-primary" v-on:click="lookUpAddress">Search</button>
      </div>
      <hr>
      <div>
        <input type="number" class="form-control" placeholder="LATITUDE" name="latitude" id="latitude" v-model="latitude">
      </div>
      <div>
        <input type="number" class="form-control" placeholder="LONGITUDE" name="longitude" id="longitude" v-model="longitude">
      </div>
      <div>
        <button type="button" class="btn btn-primary" v-on:click="lookUpLatLang">Search</button>
      </div>
    </div>
  </div>
</template>

<script>
// EXTERNAL IMPORTS
import { isNull } from 'the-type-validator'
import PubSub from 'pubsub-js'
// LOCAL IMPORTS
import { getStoredCurrentPosition } from 'geolocation/store'

const SearchBar = {
  name: 'SearchBar',
  components: {},
  data: function() {
    return {
      address: null,
      latitude: null,
      longitude: null,
    }
  },
  methods: {
    getCurrentPosition () {
      const currentPosition = getStoredCurrentPosition()
      console.debug(SearchBar.name, 'getCurrentPosition()', currentPosition)
      if (!isNull(currentPosition)) {
        this.latitude = currentPosition.coords.latitude
        this.longitude = currentPosition.coords.longitude
      }
      return currentPosition
    },
    lookUpAddress () {
      if (this.address) {
        PubSub.publish('toggleLoading', true)
        fetch(`/api/address/${this.address}`)
          .then(response => response.json())
          .then((data) => {
            console.log(data)
            this.latitude = data[0].latitude;
            this.longitude = data[0].longitude;
          }).catch((error) => {
            console.log(error)
          }).finally(() => {
            PubSub.publish('locatePosition', { coords: {latitude: this.latitude, longitude: this.longitude}});
            PubSub.publish('toggleLoading', false)
          })
      }
    },
    lookUpLatLang () {
      if (this.latitude && this.longitude) {
        PubSub.publish('toggleLoading', true)
        fetch(`/api/latlang/${this.latitude}/${this.longitude}`)
          .then(response => response.json())
          .then((data) => {
            console.log(data)
            this.address = data[0].asciiname
          }).catch((error) => {
            console.log(error)
          }).finally(() => {
            PubSub.publish('locatePosition', { coords: {latitude: this.latitude, longitude: this.longitude}});
            PubSub.publish('toggleLoading', false)
          })
      }
    },
    onFillAddress () {
      const currentPosition = this.getCurrentPosition()
      if (!isNull(currentPosition)) {
        fetch(`/api/latlang/${this.latitude}/${this.longitude}`)
          .then(response => response.json())
          .then((data) => {
            console.log(data)
            this.address = data[0].asciiname
          }).catch((error) => {
            console.log(error)
          })
      }
    },
  },
  mounted: function() {
    console.debug(SearchBar.name, 'mounted')

    PubSub.subscribe('fillAddress', this.onFillAddress)
  },
  beforeDestroy: function() {
    console.debug(SearchBar.name, 'beforeDestroy')

    PubSub.unsubscribe('fillAddress')
  },
}
export default SearchBar
</script>

<style>
  .search-bar {
    border-radius: 4px;
    top:0;
    left:0;
    position: absolute;
    background-color: rgba(0,0,0,0.1);
    color: black;
    margin: 8px;
    padding: 8px;
    z-index: 1000;
    font-family: sans-serif;
  }

  .form-control {
    display: block;
    padding: 6px 12px;
    margin-bottom: 10px;
    font-size: 15px;
    line-height: 1.42857143;
    color: #555555;
    background-color: #ffffff;
    background-image: none;
    border: 1px solid #e7e7e7;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%);
    box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%);
    -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
    -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
  }

  .btn {
    display: inline-block;
    margin-bottom: 0;
    font-weight: normal;
    text-align: center;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    background-image: none;
    border: 1px solid transparent;
    white-space: nowrap;
    padding: 6px 12px;
    font-size: 15px;
    line-height: 1.42857143;
    border-radius: 4px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .btn-primary {
    background-color: #0078A8;
    border-color: #0078A8;
    color: #ffffff;
  }
</style>
