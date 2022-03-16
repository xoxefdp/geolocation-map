<template>
  <div class="app">
    <SearchBar />
    <Mape :tracking="tracking" />
    <CustomMapeControls
      :tracking="tracking"
      :permissionState="permissionState"
    />
    <Overlay v-show="isLoading" :isLoading="isLoading" />
  </div>
</template>

<style>
* {
  font-size: 12px;
}

body {
  margin: 0;
}

.app {
  position: relative;
}
</style>

<script>
// EXTERNAL IMPORTS
import { isNull } from 'the-type-validator'
import PubSub from 'pubsub-js'
// LOCAL IMPORTS
import Mape from 'components/app/Mape'
import CustomMapeControls from 'components/app/CustomMapeControls'
import Overlay from 'components/app/Overlay'
import SearchBar from 'components/app/SearchBar'
import { GeolocationEvent, PermissionEvent } from 'systems/Events'
import {
  STORE_NAME as GeoStore,
  getStoredTrackingWatcher,
} from 'geolocation/store'
import {
  getStoredCurrentState,
  updatePermissionStore,
} from 'permissions/store'

const App = {
  name: 'App',
  components: { Mape, CustomMapeControls, Overlay, SearchBar },
  data: function() {
    return {
      permissionState: getStoredCurrentState(GeoStore),
      tracking: false,
      isLoading: false,
    }
  },
  methods: {
    onPermissionChanged (message, data) {
      DEBUG &&
        console.debug(
          App.name,
          `onPermissionChanged() ${message} ${data.resource} ${data.state}`
        )
      updatePermissionStore(data.resource, data.state)
      this.permissionState = getStoredCurrentState(data.resource)
    },
    onTrackingChanged (message, data) {
      DEBUG &&
        console.debug(App.name, `onTrackingChanged() message ${message}`)
      DEBUG && console.debug(App.name, 'onTrackingChanged() data', data)
      DEBUG &&
        console.debug(App.name, 'onTrackingChanged() tracking', this.tracking)

      const trackingWatcher = getStoredTrackingWatcher()
      if (isNull(trackingWatcher)) {
        this.tracking = false
      } else {
        this.tracking = true
      }
    },
    onToggleLoading (message, data) {
      DEBUG && console.debug(App.name, `onToggleLoading() ${message} ${data}`)
      this.isLoading = data
    },
  },
  mounted: function() {
    DEBUG && console.debug(App.name, 'mounted')
    PubSub.subscribe(
      PermissionEvent.ON_PERMISSION_GRANTED,
      this.onPermissionChanged
    )
    PubSub.subscribe(
      PermissionEvent.ON_PERMISSION_PROMPT,
      this.onPermissionChanged
    )
    PubSub.subscribe(
      PermissionEvent.ON_PERMISSION_DENIED,
      this.onPermissionChanged
    )
    PubSub.subscribe(
      GeolocationEvent.ON_GEOLOCATION_TRACKING_STARTED,
      this.onTrackingChanged
    )
    PubSub.subscribe(
      GeolocationEvent.ON_GEOLOCATION_TRACKING_STOPPED,
      this.onTrackingChanged
    )
    PubSub.subscribe('toggleLoading', this.onToggleLoading)
  },
  beforeDestroy: function() {
    DEBUG && console.debug(App.name, 'beforeDestroy')
    PubSub.unsubscribe(PermissionEvent.ON_PERMISSION_GRANTED)
    PubSub.unsubscribe(PermissionEvent.ON_PERMISSION_PROMPT)
    PubSub.unsubscribe(PermissionEvent.ON_PERMISSION_DENIED)
    PubSub.unsubscribe(GeolocationEvent.ON_GEOLOCATION_TRACKING_STARTED)
    PubSub.unsubscribe(GeolocationEvent.ON_GEOLOCATION_TRACKING_STOPPED)
    PubSub.unsubscribe('toggleLoading')
  },
}

export default App
</script>
