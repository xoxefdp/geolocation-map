<template>
  <div class="search-bar">
    <div>
      <div class="form-box">
       <div class="form-address"><input type="text" class="form-control" placeholder="ADDRESS" name="address" id="address" v-model="address"></div>
       <div class="form-search"><button type="button" class="btn btn-primary" v-on:click="lookUpAddress">Search</button></div>
      </div>
      <div v-show="items.length > 0">
        <hr>
        <div class="results-box">
          <div class="result-item" v-for="item in items" :key="item.id">
            <div class="result-address"><span>{{ item.asciiname }} / {{ item.country }} / {{ item.latitude }} / {{ item.longitude }}</span></div>
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
            this.items = data
          }).catch((error) => {
            console.log(error)
          }).finally(() => {
            PubSub.publish('toggleLoading', false)
          })
      }
    },
    goToAddress (item) {
      this.latitude = item.latitude
      this.longitude = item.longitude
      this.items = []
      PubSub.publish('locatePosition', { coords: { latitude: this.latitude, longitude: this.longitude } })
    },
    onFillAddress () {
      const currentPosition = this.getCurrentPosition()
      if (!isNull(currentPosition)) {
        fetch(`/api/latlang/${this.latitude}/${this.longitude}`)
          .then(response => response.json())
          .then((data) => {
            console.log(data)
            this.address = data[0].asciiname
            this.items = data
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

  /* @media (max-width: 600px) {
    .search-bar {
      top: unset;
      left: unset;
      bottom: 0;
      margin: 0;
      padding: 0;
    }
  } */
</style>
