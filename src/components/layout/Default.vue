<template>
  <div class="layout" v-if="layout ? false : true">
    <ReceiveModal />
    <QuickReceiveModal />
    <SendModal />
    <AddAccount />
    <OffCanvas></OffCanvas>
    <MenuBar></MenuBar>
    <main
      class="layout__main"
      :class="{ 'layout__main--fixed': !menuExpanded }"
    >
      <Side v-if="$route.path === '/dashboard'"></Side>
      <router-view v-slot="{ Component }">
        <div
          class="full-width"
          :class="{
            'full-width__grey':
              $route.name === 'Transactions' ||
              $route.name === 'TransactionsQuery' ||
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
import OffCanvas from '@/components/elements/StOffCanvas.vue';
import { useMainStore } from '@/store';
import { ref, computed, onMounted } from 'vue';

export default {
  name: 'StDefault',
  components: {
    MenuBar,
    TopBar,
    Side,

    ReceiveModal,
    QuickReceiveModal,
    SendModal,
    AddAccount,
    OffCanvas,
  },
  setup() {
    const mainStore = useMainStore();
    CryptoService.init();
    // if there's nothing in the db, show welcome screen
    // welcome screen will have recover option, create new wallet option and import option
    // recover option will recover the whole wallet via seed
    // import option will import the WIF (previously exported from somewhere within the app)
    // create new wallet will ask for a new password and generate a new seed/pk/address/etc
    // if there is an account/wallet in the db, ask for password (lock screen page), render dashboard
    /* setTimeout(() => {
      if (menuExpanded.value) {
        window.ipc.send('resize:menu');
      } else {
        window.ipc.send('resize:other');
      }
    }, 10); */
    const layout = ref(false);

    const menuExpanded = computed(() => {
      return mainStore.isMenuExpanded;
    });
    onMounted(() => {
      if (!mainStore.layoutFlash) {
        layout.value = true;
      }
      mainStore.SET_LAYOUT_FLASH(true);
      getExpandedMenu();
    });

    function getExpandedMenu() {
      let menu = JSON.parse(localStorage.getItem('menubar'));
      if (menu) {
        mainStore.SET_EXPANDED_MENU(
          JSON.parse(localStorage.getItem('menubar'))
        );
      }
    }
    return {
      menuExpanded,
      layout,
    };
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
.layout__main--fixed {
  margin-left: 64px;
}
</style>
