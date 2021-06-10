<template>
  <div class="search-bar">
    <div>
      <div class="form-box">
       <div class="form-address"><input type="text" class="form-control" placeholder="ADDRESS" name="address" id="address" v-model="address"></div>
       <div class="form-search"><button type="button" class="btn btn-primary" v-on:click="lookUpAddress">Search</button></div>
      </div>
      <div class="results-container" v-show="items.length > 0">
        <hr>
        <div class="results-box">
          <div class="result-item" v-for="item in items" :key="item.id">
            <div class="result-address"><span>{{ item.name }} / {{ item.country }} / {{ item.latitude }} / {{ item.longitude }}</span></div>
            <div class="result-action"><button class="btn btn-primary right" v-on:click="goToAddress(item)">Go</button></div>
          </div>
        </div>
        <hr>
        <div class="results-info">
          <span>RESULTS: {{ items.length }}</span>
        </div>
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
      items: [],
    }
  },
  methods: {
    getCurrentPosition () {
      const currentPosition = getStoredCurrentPosition()
      DEBUG && console.debug(SearchBar.name, 'getCurrentPosition()', currentPosition)
      if (!isNull(currentPosition)) {
        this.latitude = currentPosition.coords.latitude
        this.longitude = currentPosition.coords.longitude
      }
      return currentPosition
    },
    lookUpAddress () {
      DEBUG && console.debug(SearchBar.name, `lookUpAddress() ${this.address}`)
      if (this.address) {
        PubSub.publish('toggleLoading', true)
        fetch(`/api/address/${this.address}`)
          .then(response => response.json())
          .then((data) => {
            DEBUG && console.debug(SearchBar.name, `lookUpAddress() data ${data}`)
            this.items = data
            PubSub.publish('searchLocation', data)
          }).catch((error) => {
            console.error(SearchBar.name, `lookUpAddress() error ${error}`)
          }).finally(() => {
            PubSub.publish('toggleLoading', false)
          })
      }
    },
    goToAddress (item) {
      DEBUG && console.debug(SearchBar.name, `goToAddress() item ${item}`)
      this.latitude = item.latitude
      this.longitude = item.longitude
      this.items = []
      PubSub.publish('locatePosition', { coords: { latitude: this.latitude, longitude: this.longitude } })
    },
  },
  updated: function() {
    DEBUG && console.debug(SearchBar.name, 'updated')
    DEBUG && console.debug(SearchBar.name, `address: ${this.address}`)
    DEBUG && console.debug(SearchBar.name, `latitude: ${this.latitude}`)
    DEBUG && console.debug(SearchBar.name, `longitude: ${this.longitude}`)
    DEBUG && console.debug(SearchBar.name, `items: ${this.items}`)
  },
}
export default SearchBar
</script>

<style>
  .search-bar {
    top:0;
    left:0;
    position: absolute;
    background-color: slategray;
    color: black;
    margin: 8px;
    padding: 8px;
    z-index: 1000;
    font-family: sans-serif;
  }

  .form-control {
    color: #555555;
    background-color: #ffffff;
    background-image: none;
    border: 1px solid #e7e7e7;
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
    border: 0;
    white-space: nowrap;
    text-transform: uppercase;
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

  .results-box {
    overflow: auto;
    max-height: 200px;
    background-color: white;
  }

  .result-item {
    margin: 8px;
    background-color: lightgray;
  }

  .result-address {
    padding-left: 8px;
  }

  .results-info {
    color: white;
  }

  .search-bar,
  .form-control,
  .btn,
  .results-box,
  .result-item {
    border-radius: 4px;
  }

  .form-box,
  .result-item {
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: row;
    -ms-flex-direction: row;
    flex-direction: row;
    -webkit-flex-wrap: nowrap;
    -ms-flex-wrap: nowrap;
    flex-wrap: nowrap;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-align-content: stretch;
    -ms-flex-line-pack: stretch;
    align-content: stretch;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
  }

  .form-control,
  .btn {
    padding: 6px 12px;
    line-height: 1.42857143;
  }

  .form-address,
  .result-address {
    margin-right: 8px;
  }

  .form-address,
  .form-search,
  .result-address,
  .result-action {
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

  @media (max-width: 600px) {
    .search-bar {
      background-color: white;
      max-height: 50px;
      position: relative;
    }

    .results-container {
      position: absolute;
      top: 50px;
      background-color: white;
      left: -8px;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
    }

    .results-info {
      padding: 0 8px 8px 8px;
      color: black;
    }
  }

  @media (max-width: 300px) {
    .form-control {
      width: 140px;
    }
  }
</style>
