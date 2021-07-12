<template>
  <div class="st-filters">
    <div class="st-filters__left">
      <template v-if="$route.name !== 'AccountDetails'">
        <p v-if="$route.name === 'Dashboard'">Transactions</p>
        <a
          v-else
          class="filter-item"
          v-for="direction in directions"
          :key="direction.label"
          :class="{
            'filter-item--active': currentDirection.value === direction.value,
          }"
          @click="sortByDirection(direction)"
          >{{ direction.label }}</a
        >
      </template>
    </div>
    <div class="st-filters__right">
      <p
        v-for="filter in $route.name === 'Dashboard' ? filters : complexFilters"
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
  emits: ['change', 'sort'],
  setup(_, ctx) {
    const directions = ref([
      {
        label: 'All',
        value: '',
      },
      {
        label: 'Received',
        value: 'received',
      },
      {
        label: 'Sent',
        value: 'sent',
      },
    ]);
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
    const complexFilters = ref([
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
        label: '3m',
        value: 90,
      },
      {
        label: '6m',
        value: 180,
      },
      {
        label: '1y',
        value: 365,
      },
      {
        label: 'All',
        value: Infinity,
      },
    ]);
    const currentFilter = ref({ label: 'All', value: Infinity });
    const currentDirection = ref({ label: 'All', value: '' });

    function changeFilter(filter) {
      currentFilter.value = filter;
      ctx.emit('change', filter, currentDirection.value);
    }
    function sortByDirection(filter) {
      currentDirection.value = filter;
      ctx.emit('sort', currentFilter.value, filter);
    }
    return {
      changeFilter,
      sortByDirection,
      filters,
      complexFilters,
      directions,
      currentFilter,
      currentDirection,
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

.st-filters__left,
.st-filters__right {
  display: flex;
  align-items: center;
}

.st-filters .filter-item + .filter-item {
  margin-left: 8px;
}

.st-filters .filter-item {
  cursor: pointer;
  padding: 4px 8px;
  background: linear-gradient(
      153.02deg,
      rgba(250, 249, 252, 0.15) 0%,
      rgba(229, 228, 232, 0.15) 83.23%
    ),
    var(--grey50);
  border: 1px solid rgba(229, 228, 232, 0.15);
  border-radius: 6px;
  font-size: 10px;
  line-height: 16px;
  letter-spacing: 0.12px;
  color: var(--grey900);
  font-family: var(--secondary-font);
  transition: 0.3s;
}

.st-filters .filter-item:hover {
  background: linear-gradient(
      153.43deg,
      rgba(184, 183, 187, 0.15) 0%,
      rgba(229, 228, 232, 0.15) 83.33%
    ),
    var(--grey100);
  border: 1px solid rgba(207, 205, 209, 0.25);
  color: var(--marine500);
}

.st-filters .filter-item--active {
  background: linear-gradient(
      153.43deg,
      rgba(184, 183, 187, 0.15) 0%,
      rgba(229, 228, 232, 0.15) 83.33%
    ),
    var(--grey100);
  border: 1px solid rgba(207, 205, 209, 0.25);
  font-weight: 700;
  color: var(--marine500);
  /* padding: 19px; */
}
</style>
