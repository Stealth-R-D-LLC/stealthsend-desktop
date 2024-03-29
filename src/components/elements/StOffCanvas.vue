<template>
  <div class="off-canvas" aria-hidden="true">
    <div
      class="off-canvas-wrapper"
      :class="{ open: isOpen }"
      :aria-hidden="isOpen ? 'true' : 'false'"
      @click="closeCanvas"
    >
      <div class="off-canvas-menu" :class="{ open: isOpen }" @click.stop>
        <TransactionDetails
          v-show="currentOffCanvas === 'transaction-details'"
        ></TransactionDetails>
        <FavouriteList v-show="currentOffCanvas === 'favourite-list'" />
        <RecentNotifications
          v-show="currentOffCanvas === 'recent-notifications'"
        />
        <AddressBook v-show="currentOffCanvas === 'address-book'" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, watch, ref } from 'vue';
import { useMainStore } from '@/store';
import TransactionDetails from '@/components/partials/TransactionDetails';
import FavouriteList from '@/components/partials/FavouriteList';
import RecentNotifications from '@/components/partials/RecentNotifications';
import AddressBook from '@/components/partials/AddressBook';

const mainStore = useMainStore();

const isOpen = computed(() => {
  return mainStore.isDrawerOpened;
});

watch(
  () => mainStore.isDrawerOpened,
  () => {
    getCurrentOffCanvas();
  }
);

const currentOffCanvas = ref('transaction-details');
function getCurrentOffCanvas() {
  currentOffCanvas.value = mainStore.currentOffCanvas;
}

function closeCanvas() {
  mainStore.TOGGLE_DRAWER(false);
  setTimeout(() => {
    mainStore.SET_ADDRESS_ACTIVE_TAB('address-book');
    mainStore.SET_OFF_CANVAS_DATA(null);
    mainStore.SET_CURRENT_CANVAS('');
  }, 100);
}
</script>

<style scoped>
.off-canvas-menu {
  position: fixed;
  right: -500px;
  top: 0;
  transition: right 0.2s ease;
  background: var(--background50);
  width: 336px;
  height: calc(100% - 80px);
  padding: 40px 32px;
}
.off-canvas-menu.open {
  right: 0;
  box-shadow: -15px 15px 30px rgba(20, 4, 53, 0.05);
}

.off-canvas-wrapper {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0);
  transition: background-color ease 0.2s;
  z-index: 999;
  pointer-events: none;
}
.off-canvas-wrapper.open {
  pointer-events: initial;
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.off-canvas__open-toggle {
  position: fixed;
  right: 30px;
  top: 30px;
}
</style>
