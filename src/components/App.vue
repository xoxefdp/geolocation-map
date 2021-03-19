<template>
  <div>
    <SearchBar v-show="!overlay" />
    <Mape :overlay="overlay" :tracking="tracking" />
    <CustomMapeControls v-show="!overlay" :tracking="tracking" />
    <Overlay v-show="overlay" :permissionState="permissionState" />
  </div>
</template>

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
import { STORE_NAME as GeoStore, getStoredTrackingWatcher } from 'geolocation/store'
import { getStoredCurrentState, updatePermissionStore } from 'permissions/store'
import { isPermissionGranted } from 'permissions/permissions'

const App = {
  name: 'App',
  components: { Mape, CustomMapeControls, Overlay, SearchBar },
  data: function() {
    return {
      overlay: !isPermissionGranted(GeoStore),
      permissionState: getStoredCurrentState(GeoStore),
      tracking: false,
    }
  },
  methods: {
    onPermissionChanged (message, data) {
      console.debug(App.name, `onPermissionChanged() ${message} ${data.resource} ${data.state}`)
      updatePermissionStore(data.resource, data.state)
      this.overlay = !isPermissionGranted(data.resource)
      this.permissionState = getStoredCurrentState(data.resource)
    },
    onTrackingChanged (message, data) {
      console.debug(App.name, `onTrackingChanged() message ${message}`)
      console.debug(App.name, 'onTrackingChanged() data', data)
      console.debug(App.name, 'onTrackingChanged() tracking', this.tracking)

      const trackingWatcher = getStoredTrackingWatcher()
      if (isNull(trackingWatcher)) {
        this.tracking = false
      } else {
        this.tracking = true
      }
    },
  },
  mounted: function() {
    console.debug(App.name, 'mounted')

    PubSub.subscribe(PermissionEvent.ON_PERMISSION_GRANTED, this.onPermissionChanged)
    PubSub.subscribe(PermissionEvent.ON_PERMISSION_PROMPT, this.onPermissionChanged)
    PubSub.subscribe(PermissionEvent.ON_PERMISSION_DENIED, this.onPermissionChanged)
    PubSub.subscribe(GeolocationEvent.ON_GEOLOCATION_TRACKING_STARTED, this.onTrackingChanged)
    PubSub.subscribe(GeolocationEvent.ON_GEOLOCATION_TRACKING_STOPPED, this.onTrackingChanged)
  },
  updated: function() {
    console.debug(App.name, 'updated')
    console.debug(App.name, `overlay: ${this.overlay}`)
    console.debug(App.name, `permissionState: ${this.permissionState}`)
    console.debug(App.name, `tracking: ${this.tracking}`)
  },
  beforeDestroy: function() {
    console.debug(App.name, 'beforeDestroy')

    PubSub.unsubscribe(PermissionEvent.ON_PERMISSION_GRANTED)
    PubSub.unsubscribe(PermissionEvent.ON_PERMISSION_PROMPT)
    PubSub.unsubscribe(PermissionEvent.ON_PERMISSION_DENIED)
    PubSub.unsubscribe(GeolocationEvent.ON_GEOLOCATION_TRACKING_STARTED)
    PubSub.unsubscribe(GeolocationEvent.ON_GEOLOCATION_TRACKING_STOPPED)
  },
}

export default App
</script>
