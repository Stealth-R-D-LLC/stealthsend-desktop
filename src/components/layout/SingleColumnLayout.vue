<template>
  <div class="layout">
    <ReceiveModal />
    <QuickReceiveModal />
    <SendModal />
    <AddAccount />
    <OffCanvas></OffCanvas>
    <MenuBar></MenuBar>
    <main
      class="layout__single"
      :class="{ 'layout__single--fixed': !menuExpanded }"
    >
      <router-view v-slot="{ Component }">
        <div>
          <TopBar></TopBar>
          <component :is="Component" />
        </div>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import ReceiveModal from '@/components/partials/ReceiveModal.vue';
import QuickReceiveModal from '@/components/partials/QuickReceiveModal.vue';
import SendModal from '@/components/partials/SendModal.vue';
import AddAccount from '@/components/partials/AddAccount.vue';
import OffCanvas from '@/components/elements/StOffCanvas.vue';
import MenuBar from '@/components/layout/MenuBar.vue';
import TopBar from '@/components/layout/TopBar.vue';
import CryptoService from '../../services/crypto';
import { useMainStore } from '@/store';
import { computed } from 'vue';

const mainStore = useMainStore();
CryptoService.init();
// if there's nothing in the db, show welcome screen
// welcome screen will have recover option, create new wallet option and import option
// recover option will recover the whole wallet via seed
// import option will import the WIF (previously exported from somewhere within the app)
// create new wallet will ask for a new password and generate a new seed/pk/address/etc
// if there is an account/wallet in the db, ask for password (lock screen page), render dashboard
const menuExpanded = computed(() => {
  return mainStore.isMenuExpanded;
});
</script>

<style scoped>
.layout {
  position: relative;
}
.layout__single {
  width: calc(100vw - 252px);
}
.layout__single--fixed {
  margin-left: 64px;
  width: initial;
}
</style>
