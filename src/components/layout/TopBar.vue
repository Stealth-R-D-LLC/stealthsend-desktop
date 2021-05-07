<template>
  <header
    class="layout__header"
    :class="{ 'layout__header--is-grey': headerStyle === 'grey' }"
  >
    <div class="header-left">
      <StIcon name="chart"></StIcon>
      <StIcon name="tx-list"></StIcon>
      <button @click="toggleDrawer">test</button>
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
export default {
  setup() {
    const mainStore = useMainStore();
    let version = pkgjson.version;

    function toggleDrawer() {
      mainStore.TOGGLE_DRAWER(true)
    }

    return {
      version,
      headerStyle: computed(() => mainStore.headerStyle),
      toggleDrawer
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

.layout__header--is-grey {
  background: var(--background100);
}

.layout__header svg {
  margin: 0 10px;
}

.layout__header svg:hover {
  cursor: pointer;
}
</style>
