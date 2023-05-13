<template>
  <div v-if="items?.data?.length">
    <div class="pagination">
      <div class="pagination-navbar navbar-margin-bottom">
        <button class="pagination-nav" @click="requestPrevPage" :disabled="isPrevDisabled">&lt;</button>
        <PreviousSiblings class="pagination-nav" :items="items" :requestPage="requestPage" :currentPage="currentPage"
          :siblingsOptions="siblingsOptions" />
        <button class="pagination-nav active">{{ currentPage }}</button>
        <NextSiblings class="pagination-nav" :items="items" :requestPage="requestPage" :currentPage="currentPage"
          :siblingsOptions="siblingsOptions" :lastPage="lastPage" />
        <button class="pagination-nav" @click="requestNextPage" :disabled="isNextDisabled">&gt;</button>
      </div>
      <div class="pagination-config" v-if="hasConfig">
        <div class="pagination-perpage">
          <span>Show</span>
          <select class="dropdown" required="true" v-model="perPageSelected" @change="changePerPage($event)">
            <option class="items" v-for="option in perPageOptions" :key="option" :value="option">{{ option }}
            </option>
          </select>
        </div>
        <div class="pagination-details">
          <span>Results: {{ fromItem }} - {{ toItem }} of {{ totalItems }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.active {
  background-color: var(--color-green);
}

.pagination-navbar {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
}

.navbar-margin-bottom {
  margin-bottom: 16px;
}

.pagination-nav {
  display: block;
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
  align-self: auto;
  order: 0;
}

.pagination-config {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  align-content: normal;
}

.pagination-perpage,
.pagination-details {
  display: block;
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
  align-self: auto;
  order: 0;
}

@media (max-width: 600px) {
  .pagination {
    margin: 8px;
  }

  .pagination-config {
    min-height: 20px;
  }
}
</style>

<script>
// EXTERNAL IMPORTS
import PubSub from 'pubsub-js'
// LOCAL IMPORTS
import '../../styles/colors.css'
import PreviousSiblings from 'components/common/pagination/PreviousSiblings'
import NextSiblings from 'components/common/pagination/NextSiblings'

const Pagination = {
  name: 'Pagination',
  components: { PreviousSiblings, NextSiblings },
  data: function () {
    return {
      perPageSelected: 5,
      perPageOptions: [5, 10, 20, 50],
      isPrevDisabled: null,
      isNextDisabled: null,
      currentPage: null,
      lastPage: null,
      fromItem: null,
      toItem: null,
      itemsPerPage: null,
      totalItems: null,
    }
  },
  props: {
    items: Object,
    hasConfig: Boolean,
    siblingsOptions: {
      type: Number,
      default: 1
    }
  },
  methods: {
    requestPage(newPage) {
      DEBUG && console.debug(Pagination.name, `requestPage(): ${newPage}, current: ${this.currentPage}`)
      PubSub.publish('paginate', newPage)
    },
    requestPrevPage() {
      const previousPageNumber = this.currentPage - 1
      DEBUG && console.debug(Pagination.name, 'requestPrevPage()', previousPageNumber)
      this.requestPage(previousPageNumber)
    },
    requestNextPage() {
      const previousPageNumber = this.currentPage + 1
      DEBUG && console.debug(Pagination.name, 'requestNextPage()', previousPageNumber)
      this.requestPage(previousPageNumber)
    },
    changePerPage(event) {
      DEBUG && console.debug(Pagination.name, 'changePerPage():', event.target.value)

    },
  },
  beforeUpdate: function () {
    if (this.items?.data?.length) {
      this.currentPage = this.items.current_page
      this.lastPage = this.items.last_page
      this.fromItem = this.items.from
      this.toItem = this.items.to
      this.itemsPerPage = this.items.per_page
      this.totalItems = this.items.total
      this.isPrevDisabled = this.currentPage - 1 <= 0
      this.isNextDisabled = this.currentPage + 1 > this.lastPage
    }
  },
}

export default Pagination
</script>
