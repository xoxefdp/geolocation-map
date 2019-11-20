import '@babel/polyfill'
import * as L from 'leaflet'
import Vue from 'vue'
import App from 'main/components/App'

Vue.use(L)

new Vue({
  el: '#root',
  components: { App }
})
