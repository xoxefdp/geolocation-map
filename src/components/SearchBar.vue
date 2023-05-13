<template>
  <div class="search-bar">
    <div>
      <div class="form-box">
        <div class="form-location">
          <input type="text" class="form-control" placeholder="LOCATION" name="location" id="location" v-model="location"
            @keyup="keyboardHandler" />
        </div>
        <div class="form-search">
          <button type="button" class="btn btn-primary" @click="lookUpLocation">
            Search
          </button>
        </div>
      </div>
      <div class="results-container" v-show="items?.data?.length > 0">
        <hr />
        <div class="results-box">
          <div class="result-item" v-for="item in items.data" :key="item.id">
            <div class="result-location">
              <span>{{ item.name }} / {{ item.country }} / {{ item.latitude }} /
                {{ item.longitude }}</span>
            </div>
            <div class="result-action">
              <button class="btn btn-primary right" @click="goToLocation(item)">
                Go
              </button>
            </div>
          </div>
        </div>
        <hr />
        <Pagination :items="items" :hasConfig="true" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-bar {
  top: 0;
  left: 0;
  position: absolute;
  background-color: var(--color-lightslategray);
  color: var(--color-black);
  padding: 8px;
  margin: 8px;
  z-index: 1000;
  font-family: sans-serif;
}

.form-control {
  color: var(--color-gray);
  background-color: var(--color-white);
  background-image: none;
  border: 1px solid #e7e7e7;
  box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%);
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
}

.btn {
  display: inline-block;
  margin-bottom: 0;
  font-weight: normal;
  text-align: center;
  vertical-align: middle;
  touch-action: manipulation;
  cursor: pointer;
  background-image: none;
  border: 0;
  white-space: nowrap;
  text-transform: uppercase;
  user-select: none;
}

.btn-primary {
  background-color: var(--color-blue);
  border-color: var(--color-blue);
  color: var(--color-white);
}

.results-box {
  overflow: auto;
  max-height: 200px;
  background-color: var(--color-white)
}

.result-item {
  margin: 8px;
  background-color: var(--color-lightgray);
}

.result-item:hover,
.result-item:focus {
  background-color: var(--color-salmon);
}

.result-location {
  padding-left: 8px;
}

.results-info {
  color: var(--color-white)
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
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-content: stretch;
  align-items: center;
}

.form-control,
.btn {
  padding: 6px 12px;
  line-height: 1.42857143;
}

.form-location,
.result-location {
  margin-right: 8px;
}

.form-location,
.form-search,
.result-location,
.result-action {
  order: 0;
  flex: 0 1 auto;
  align-self: auto;
}

@media (max-width: 600px) {
  .form-control {
    background-color: var(--color-lightslategray);
    color: var(--color-white);
  }

  .form-control::placeholder {
    color: var(--color-yellow);
  }

  .search-bar {
    background-color: var(--color-white);
    max-height: 50px;
    padding: 16px;
    margin: 0;
    position: relative;
    z-index: 1001;
  }

  .results-container {
    top: 56px;
    left: 0;
    position: absolute;
    background-color: var(--color-white);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  .results-container>hr:first-child,
  .results-container>hr:nth-child(3) {
    background-color: var(--color-lightslategray);
  }

  .results-container>hr:first-child {
    margin-bottom: 0;
    padding-bottom: 7px;
    border: 1px;
  }

  .results-container>hr:nth-child(3) {
    margin-top: 0;
    padding-top: 7px;
    border: 1px;
  }

  .results-box {
    background-color: var(--color-lightslategray);
    border-radius: 0;
  }

  .results-info {
    padding: 0 8px 8px 8px;
    color: var(--color-black);
  }
}

@media (max-width: 300px) {
  .form-control {
    width: 140px;
  }
}
</style>

<script>
// EXTERNAL IMPORTS
import { isNull } from 'the-type-validator'
import PubSub from 'pubsub-js'
// LOCAL IMPORTS
import '../styles/colors.css'
import { getStoredCurrentPosition } from 'geolocation/store'
import Pagination from 'components/common/Pagination'

const SearchBar = {
  name: 'SearchBar',
  components: { Pagination },
  data: function () {
    return {
      location: null,
      latitude: null,
      longitude: null,
      items: {},
    }
  },
  methods: {
    getCurrentPosition() {
      const currentPosition = getStoredCurrentPosition()
      DEBUG &&
        console.debug(SearchBar.name, 'getCurrentPosition()', currentPosition)
      if (!isNull(currentPosition)) {
        this.latitude = currentPosition.coords.latitude
        this.longitude = currentPosition.coords.longitude
      }
      return currentPosition
    },
    lookUpLocation(message, data) {
      DEBUG &&
        console.debug(SearchBar.name, `lookUpLocation() ${this.location}`)
      if (this.location) {
        PubSub.publish('toggleLoading', true)

        let promise

        if (data) {
          promise = fetch(`/api/v1/location/${this.location}?page=${data}`)
        } else {
          promise = fetch(`/api/v1/location/${this.location}`)
        }

        promise
          .then((response) => response.json())
          .then((locations) => {
            if (locations.data.length > 0) {
              this.items = locations
            }
            DEBUG && console.debug(SearchBar.name, `lookUpLocation() data ${locations.data}`)
            PubSub.publish('searchLocation', locations.data)
          })
          .catch((error) => {
            this.items = []
            console.error(SearchBar.name, `lookUpLocation() error ${error}`)
          })
          .finally(() => {
            PubSub.publish('toggleLoading', false)
          })
      }
    },
    goToLocation(item) {
      DEBUG && console.debug(SearchBar.name, `goToLocation() item ${item}`)
      this.latitude = item.latitude
      this.longitude = item.longitude
      this.items = {}
      PubSub.publish('locatePosition', {
        coords: { latitude: this.latitude, longitude: this.longitude },
      })
    },
    keyboardHandler(event) {
      if (event.key === 'Enter') {
        this.lookUpLocation()
      }
    }
  },
  mounted: function () {
    PubSub.subscribe('paginate', this.lookUpLocation)
  },
  beforeDestroy: function () {
    PubSub.unsubscribe('paginate')
  },
}
export default SearchBar
</script>
