<template>
  <div>
    <Mape :overlay="overlay" />
    <CustomMapeControls v-show="!overlay" />
    <Overlay v-show="overlay" :permissionState="permissionState" />
  </div>
</template>

<script>
import Mape from 'components/app/Mape'
import CustomMapeControls from 'components/app/CustomMapeControls'
import Overlay from 'components/app/Overlay'
import PubSub from 'pubsub-js'
import { PermissionEvent } from 'systems/Events'
import { STORE_NAME as GeoStore } from 'geolocation/store'
import { getStoredCurrentState, updatePermissionStore } from 'permissions/store'
import { isPermissionGranted } from 'permissions/permissions'

const App = {
  name: 'App',
  components: { Mape, CustomMapeControls, Overlay },
  data: function() {
    return {
      overlay: !isPermissionGranted(GeoStore),
      permissionState: getStoredCurrentState(GeoStore),
    }
  },
  methods: {
    _onPermissionChanged (message, data) {
      console.debug(`_onPermissionChanged() ${message} ${data.resource} ${data.state}`)
      updatePermissionStore(data.resource, data.state)
      this.overlay = !isPermissionGranted(data.resource)
      this.permissionState = getStoredCurrentState(data.resource)
    },
  },
  mounted: function() {
    console.debug(App.name, 'mounted')

    PubSub.subscribe(PermissionEvent.ON_PERMISSION_GRANTED, this._onPermissionChanged)
    PubSub.subscribe(PermissionEvent.ON_PERMISSION_PROMPT, this._onPermissionChanged)
    PubSub.subscribe(PermissionEvent.ON_PERMISSION_DENIED, this._onPermissionChanged)
  },
  updated: function() {
    console.debug(App.name, 'updated')
    console.debug(App.name, `overlay: ${this.overlay}`)
    console.debug(App.name, `permissionState: ${this.permissionState}`)
  },
  beforeDestroy: function() {
    console.debug(App.name, 'beforeDestroy')

    PubSub.unsubscribe(PermissionEvent.ON_PERMISSION_GRANTED)
    PubSub.unsubscribe(PermissionEvent.ON_PERMISSION_PROMPT)
    PubSub.unsubscribe(PermissionEvent.ON_PERMISSION_DENIED)
  },
}

export default App
</script>
