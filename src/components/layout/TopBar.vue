<template>
  <header
    class="layout__header"
    :class="{ 'layout__header--is-grey': headerStyle === 'grey' }"
  >
    <div class="header-left">
      <template v-if="checkVisibilityForRoute(['Dashboard'])">
        <StIcon
          name="chart"
          @click="toggleComponentVisibility('chart')"
        ></StIcon>
        <StIcon
          name="tx-list"
          @click="toggleComponentVisibility('txDashboard')"
        ></StIcon>
      </template>
    </div>
    <div class="header-right">
      <StIcon name="sync-status"></StIcon>
      <StIcon name="support"></StIcon>
      <StIcon name="notifications"></StIcon>
      <StIcon name="qr"></StIcon>
      <StIcon name="settings"></StIcon>
    </div>
  </header>
</template>

<script>
import pkgjson from '../../../package.json';
import { useMainStore } from '@/store';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const mainStore = useMainStore();
    let version = pkgjson.version;
    const route = useRoute();

    const currentRoute = computed(() => {
      return route.name;
    });

    const componentVisibility = computed(() => {
      return mainStore.componentVisibility;
    });

    function checkVisibilityForRoute(routes = []) {
      if (!currentRoute.value) return false;
      return routes.includes(currentRoute.value);
    }

    function toggleComponentVisibility(component) {
      mainStore.SET_COMPONENT_VISIBILITY(
        component,
        !componentVisibility.value[component]
      );
    }

    return {
      version,
      currentRoute,
      componentVisibility,
      checkVisibilityForRoute,
      toggleComponentVisibility,
      headerStyle: computed(() => mainStore.headerStyle),
    };
  },
};
</script>

<style scoped>
.layout__header {
  border-bottom: 1px solid var(--grey100);
  display: flex;
  justify-content: space-between;
}
h .layout__header--is-grey {
  background: var(--background100);
}

.layout__header svg {
  margin: 0 10px;
}

.layout__header svg:hover {
  cursor: pointer;
}
</style>
