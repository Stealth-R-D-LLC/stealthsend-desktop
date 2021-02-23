<template>
  <div class="st-pagination">
    <p class="st-pagination__label">
      Showing {{ currentPage * pageSize - (pageSize - 1) }} to
      {{ currentPage * pageSize > total ? total : currentPage * pageSize }} of
      {{ total }} entries
    </p>
    <div class="st-pagination__pages">
      <span
        class="prev page"
        :class="{ disabled: currentPage === 1 }"
        @click="prevPage"
        >Previous</span
      >
      <template v-for="page in Math.ceil(total / pageSize) - 1" :key="page">
        <span v-if="page" class="page" @click="gotoPage(page)">
          {{ page }}
        </span>
      </template>
      <!-- <span
        v-if="Math.ceil(total / pageSize) - 2 >= paginationLimit && Math.ceil(total / pageSize) - 1 >= paginationLimit"
        class="page no-hover"
        >...</span
      > -->
      <span class="page">{{ Math.ceil(total / pageSize) }}</span>
      <!-- always show last page -->
      <span
        class="next page"
        :class="{ disabled: pageCount === currentPage }"
        @click="nextPage"
        >Next</span
      >
    </div>
  </div>
</template>

<script>
import { onMounted, watch, ref, computed } from 'vue'
export default {
  name: 'StPagination',
  props: {
    total: {
      type: Number,
      required: true
    },
    pageSize: {
      type: Number,
      required: false,
      default: () => {
        return 10
      }
    },
    currentPage: {
      type: Number,
      required: true,
      default: 1
    },
    paginationLimit: {
      type: Number,
      required: false,
      default: 5 // number of pages in pagination before 3 dots
    }
  },
  emits: ['view-all', 'size-change', 'current-change'],
  setup(props, ctx) {
    let pageSizeCached = ref()
    onMounted(() => {
      pageSizeCached = props.pageSize
    })

    const pageCount = computed(() => {
      let l = props.total
      let s = props.pageSize
      // 40 items will be 4 pages with 10 results
      // 42 items will be 5 pages with 10 results + 1 page with 2 results
      return l % props.pageSize === 0
        ? Math.floor(l / s)
        : Math.floor(l / s) + 1
    })

    watch(props.pageSize, (pageSize) => {
      sizeChange(pageSize)
    })

    function viewAll() {
      ctx.emit('view-all')
    }
    function sizeChange(val) {
      ctx.emit('size-change', val)
    }
    function paginationChange(newPage) {
      ctx.emit('current-change', newPage)
    }
    function gotoPage(page) {
      paginationChange(page)
    }
    function nextPage() {
      console.log('next page')
      if (props.pageCount <= props.currentPage) return
      paginationChange(props.currentPage + 1)
    }
    function prevPage() {
      console.log('prev page')

      if (props.currentPage <= 1) return
      paginationChange(props.currentPage - 1)
    }

    return {
      pageCount,
      pageSizeCached,
      viewAll,
      sizeChange,
      gotoPage,
      nextPage,
      prevPage
    }
  }
}
</script>

<style lang="postcss" scoped>
.st-pagination {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;
}
.st-pagination__label {
  margin-bottom: 24px;
}
.st-pagination__pages .page {
  padding: 10px 16px;
  border: 1px solid var(--grey100);
  border-right: transparent;
}
.st-pagination__pages .page:last-child {
  border-right: 1px solid var(--grey100);
}
.st-pagination__pages .page:hover:not(.no-hover) {
  border-color: var(--marine500);
  border-right: 1px solid var(--marine500);
  cursor: pointer;
}
.st-pagination__pages .disabled {
  color: var(--grey100);
  border-color: var(--grey100);
}
.st-pagination__pages .disabled:hover:not(.no-hover) {
  border-color: var(--grey100);
  cursor: not-allowed;
}
</style>
