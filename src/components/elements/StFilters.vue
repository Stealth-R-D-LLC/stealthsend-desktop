<template>
  <div class="st-filters">
    <div class="st-filters__left">
        <slot>Transactions</slot>
    </div>
    <div class="st-filters__right">
      <p
        v-for="filter in filters"
        :key="filter"
        :class="{ 'filter-item--active': currentFilter === filter }"
        class="filter-item"
        @click="changeFilter(filter)"
        >{{ filter }}</p
      >
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
export default {
  name: 'StFilters',
  emits: ['change'],
  setup(_, ctx) {
    const filters = ref(['1d', '3d', '1w', '1m', 'All']);
    const currentFilter = ref('1d');

    function changeFilter(filter) {
      currentFilter.value = filter;
      ctx.emit('change', filter)
    }
    return {
      changeFilter,
      filters,
      currentFilter,
    };
  },
};
</script>

<style scoped>
.st-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0;
}

.st-filters__right {
    display: flex;
}

.st-filters .filter-item {
  margin: 0 4px;
  width: 36px;
  height: 36px;
  border: 1px solid var(--grey100);
  border-radius: 50%;
  background: var(--grey50);
  color: var(--grey900);
  /* padding: 10px; */
  cursor: pointer;

  font-family: var(--secondary-font);
font-style: normal;
font-weight: normal;
font-size: 12px;
line-height: 24px;
display: flex;
align-items: center;
justify-content: center;
text-align: center;
letter-spacing: 0.12px;
}

.st-filters .filter-item:hover {
  background: var(--grey200);
  transition: 0.2s;
}

.st-filters .filter-item--active {
  border: 1px solid var(--grey200);
  background: var(--grey100);
  color: var(--marine500);
  transition: 0.2s;
  font-weight: 600;
    /* padding: 19px; */

}
</style>
