<template>
  <div class="layout">
        <ReceiveModal />
    <QuickReceiveModal />
    <SendModal />
    <AddAccount />
    <MenuBar></MenuBar>
    <main class="layout__main">
      <Side v-if="$route.path === '/dashboard'"></Side>
      <router-view v-slot="{ Component }">
        <div
          class="full-width"
          :class="{
            'full-width__grey':
              $route.name === 'Transactions' ||
              $route.name === 'ArchivedAccounts',
          }"
        >
          <TopBar></TopBar>
          <transition name="fade">
            <component :is="Component" />
          </transition>
        </div>
      </router-view>
    </main>
  </div>
</template>

<script>
import MenuBar from '@/components/layout/MenuBar.vue';
import TopBar from '@/components/layout/TopBar.vue';
import CryptoService from '@/services/crypto';
import Side from '@/views/dashboard/components/side.vue';
import ReceiveModal from '@/components/partials/ReceiveModal.vue';
import QuickReceiveModal from '@/components/partials/QuickReceiveModal.vue';
import SendModal from '@/components/partials/SendModal.vue';
import AddAccount from '@/components/partials/AddAccount.vue';

export default {
  name: 'TsDefault',
  components: {
    MenuBar,
    TopBar,
    Side,

        ReceiveModal,
    QuickReceiveModal,
    SendModal,
    AddAccount,
  },
  setup() {
    CryptoService.init();
    // if there's nothing in the db, show welcome screen
    // welcome screen will have recover option, create new wallet option and import option
    // recover option will recover the whole wallet via seed
    // import option will import the WIF (previously exported from somewhere within the app)
    // create new wallet will ask for a new password and generate a new seed/pk/address/etc
    // if there is an account/wallet in the db, ask for password (lock screen page), render dashboard
    return {};
  },
};
</script>

<style scoped>
.layout {
  position: relative;
}
.full-width {
  width: 100%;
}
.full-width__grey {
  background-color: var(--background100);
  height: 100%;
}
</style>
