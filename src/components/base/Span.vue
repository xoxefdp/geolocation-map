<template>
  <span></span>
</template>

<script>
export default {
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
  },
  updated: function() {
    console.log('updated')
  },
  beforeUpdate: function() {
    console.log('beforeUpdate')
  },
  beforeDestroy: function() {
    console.log('beforeDestroy')
  },
  destroyed: function() {
    console.log('destroyed')
  }
}
</script>

<style>

</style>