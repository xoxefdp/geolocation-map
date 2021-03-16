<template>
  <div class="search-bar">
    <div class="inputs-container">
      <div class="input-box">
        <label for="latitude">Latitude</label>
        <input type="number" name="latitude" id="latitude">
      </div>
      <div class="input-box">
        <label for="longitude">Longitude</label>
        <input type="number" name="longitude" id="longitude">
      </div>
      <div class="input-box">
        <button type="button" :disabled="true">Search</button>
      </div>
    </div>
  </div>
</template>

<script>
const SearchBar = {

}
export default SearchBar
</script>

<style>
  .search-bar {
    top:0;
    left:0;
    position: absolute;
    background-color: white;
    color: black;
    margin: 8px;
    padding: 8px;
    z-index: 1000;
  }

  .inputs-container {
    min-height: 60px;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-justify-content: space-around;
    -ms-flex-pack: distribute;
    justify-content: space-around;
    -webkit-align-content: flex-start;
    -ms-flex-line-pack: start;
    align-content: flex-start;
    -webkit-align-items: flex-start;
    -ms-flex-align: start;
    align-items: flex-start;
  }

  .input-box {
    width: 100%;
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
</style>
