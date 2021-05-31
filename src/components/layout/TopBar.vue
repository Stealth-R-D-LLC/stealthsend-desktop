<template>
  <header
    class="layout__header"
    :class="{ 'layout__header--is-grey': headerStyle === 'grey' }"
  >
    <div class="header-left">
      <template v-if="checkVisibilityForRoute(['Dashboard'])">
        <StIcon
          :class="{ inactive: !componentVisibility.chart }"
          name="chart"
          @click="toggleComponentVisibility('chart')"
        ></StIcon>
        <StIcon
          :class="{ inactive: !componentVisibility.txDashboard }"
          name="tx-list"
          @click="toggleComponentVisibility('txDashboard')"
        ></StIcon>
      </template>
      <template v-if="checkVisibilityForRoute(['ArchivedAccounts'])">
        <svg
          width="22"
          height="16"
          viewBox="0 0 22 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 3C7.68629 3 4.68629 4.66667 2 8C4.68629 11.3333 7.68629 13 11 13C14.3137 13 17.3137 11.3333 20 8C19.3945 7.24866 18.7731 6.58199 18.1357 6"
            stroke="#4E00F6"
            stroke-width="2"
          />
          <path d="M6 8L12 8" stroke="#4E00F6" stroke-width="2" />
          <path d="M19 1L5 15" stroke="#4E00F6" stroke-width="2" />
        </svg>
        <svg
          @click="toggleDrawer('favourite-list')"
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.6218 6.61132L12.8885 3.14551L9.83282 9.33709L3 10.33L7.94427 15.1494L6.77709 21.9546L12.8885 18.7417L19 21.9546"
            stroke="#4E00F6"
            stroke-width="2"
          />
          <path
            d="M22.4131 7.14551L18.4131 7.14551"
            stroke="#4E00F6"
            stroke-width="2"
          />
          <line
            x1="22.4131"
            y1="11.1455"
            x2="14.4131"
            y2="11.1455"
            stroke="#4E00F6"
            stroke-width="2"
          />
          <line
            x1="22.4131"
            y1="15.1455"
            x2="14.4131"
            y2="15.1455"
            stroke="#4E00F6"
            stroke-width="2"
          />
        </svg>
      </template>
    </div>
    <div class="header-right">
      <StIcon name="sync-status"></StIcon>
      <StIcon name="support"></StIcon>
      <StIcon
        name="notifications"
        @click="toggleDrawer('recent-notifications')"
      ></StIcon>
      <StIcon name="qr"></StIcon>
      <StIcon @click="goto('/settings')" name="settings"></StIcon>
    </div>
  </header>
</template>

<script>
import pkgjson from '../../../package.json';
import { useMainStore } from '@/store';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router';

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

    function toggleDrawer(canvas) {
      mainStore.SET_CURRENT_CANVAS(canvas);
      mainStore.TOGGLE_DRAWER(true);
    }

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

    function goto(path) {
      router.push(path);
    }

    return {
      version,
      toggleDrawer,
      currentRoute,
      componentVisibility,
      checkVisibilityForRoute,
      toggleComponentVisibility,
      goto,
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
:deep path {
  transition: 0.3s;
}
:deep .inactive path {
  stroke: var(--marine100);
}
</style>
