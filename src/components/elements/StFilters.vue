<template>
  <div class="st-filters">
    <div class="st-filters__left">
      <slot>Transactions</slot>
    </div>
    <div class="st-filters__right">
      <p
        v-for="filter in filters"
        :key="filter.label"
        :class="{ 'filter-item--active': currentFilter.value === filter.value }"
        class="filter-item"
        @click="changeFilter(filter)"
      >
        {{ filter.label }}
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
export default {
  name: 'StFilters',
  emits: ['change'],
  setup(_, ctx) {
    const filters = ref([
      {
        label: '1d',
        value: 1,
      },
      {
        label: '3d',
        value: 3,
      },

      {
        label: '1w',
        value: 7,
      },
      {
        label: '1m',
        value: 30,
      },
      {
        label: 'All',
        value: Infinity,
      },
    ]);
    const currentFilter = ref({ label: 'All', value: Infinity });

    function changeFilter(filter) {
      currentFilter.value = filter;
      ctx.emit('change', filter);
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
    width: 30px;
    height: 24px;
    border: 1px solid var(--grey100);
    border-radius: 6px;
    background: var(--grey50);
    color: var(--grey900);
    cursor: pointer;
    font-family: var(--secondary-font);
    font-style: normal;
    font-weight: normal;
    font-size: 10px;
    line-height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    letter-spacing: 0.16px;
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
  font-weight: 700;
  /* padding: 19px; */
}
</style>
