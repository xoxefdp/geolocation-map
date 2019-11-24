<template>
  <div>
    <div id="map"></div>
  </div>
</template>

<script>
  const Map = {
    name: 'Map',
    beforeCreate: () => {
      console.log('beforeCreate')
    },
    created: () => {
      console.log('created')
    },
    beforeMount: () => {
      console.log('beforeMount')
    },
    mounted: () => {
      console.log('mounted')
    },
    beforeUpdate: () => {
      console.log('beforeUpdate')
    },
    updated: () => {
      console.log('updated')
    },
    beforeDestroy: () => {
      console.log('beforeDestroy')
    },
    destroyed: () => {
      console.log('destroyed')
    }
  }

  export default Map
</script>

<style>
  @import "~leaflet/dist/leaflet.css";

  #map {
    padding: 10px;
  }
</style>