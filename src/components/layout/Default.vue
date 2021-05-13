<template>
  <div class="layout">
    <MenuBar></MenuBar>
    <main class="layout__main">
      <Side v-if="$route.path === '/dashboard'"></Side>
      <router-view v-slot="{ Component }">
        <div class="full-widht">
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
import CryptoService from '../../services/crypto';
import Side from '@/views/dashboard/components/side.vue';

export default {
  name: 'TsDefault',
  components: {
    MenuBar,
    TopBar,
    Side,
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
.full-widht {
  width: 100%;
}
</style>
