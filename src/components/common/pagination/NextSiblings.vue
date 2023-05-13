<template>
  <div>
    <div class="pagination-navbar">
      <button class="pagination-nav" @click="requestPage(sibling)" v-for="sibling in getNextSiblings()">{{ sibling
      }}</button>
      <button class="pagination-nav" v-if="getNextSiblings()[0] + siblingsOptions < lastPage" disabled="true">...</button>
      <button class="pagination-nav" v-if="getNextSiblings()[0] + siblingsOptions - 1 < lastPage"
        @click="requestPage(lastPage)">{{ lastPage }}</button>
    </div>
  </div>
</template>

<script>
const NextSiblings = {
  name: 'NextSiblings',
  props: [
    'items',
    'requestPage',
    'currentPage',
    'siblingsOptions',
    'lastPage'
  ],
  methods: {
    getNextSiblings() {
      const nextSiblings = []
      for (let index = this.currentPage; index <= this.currentPage + this.siblingsOptions; index++) {
        if (index > this.currentPage && index <= this.lastPage) {
          nextSiblings.push(index)
        }
      }
      return nextSiblings
    },
  }
}

export default NextSiblings
</script>
