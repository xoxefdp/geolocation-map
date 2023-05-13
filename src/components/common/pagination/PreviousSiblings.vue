<template>
  <div>
    <div class="pagination-navbar">
      <button class="pagination-nav" v-if="getPrevSiblings()[0] > 1" @click="requestPage(1)">1</button>
      <button class="pagination-nav" v-if="getPrevSiblings()[0] > 2" disabled="true">...</button>
      <button class="pagination-nav" @click="requestPage(sibling)" v-for="sibling in getPrevSiblings()">{{ sibling
      }}</button>
    </div>
  </div>
</template>

<script>
const PreviousSiblings = {
  name: 'PreviousSiblings',
  props: [
    'items',
    'requestPage',
    'currentPage',
    'siblingsOptions'
  ],
  methods: {
    getPrevSiblings() {
      const prevSiblings = []
      for (let index = this.currentPage - this.siblingsOptions; index < this.currentPage; index++) {
        if (index > 0) {
          prevSiblings.push(index)
        }
      }
      return prevSiblings
    },
  }
}

export default PreviousSiblings
</script>
