<template>
  <div class="default-layout">
    <MenuBar></MenuBar>
    <main class="default-layout__main">
      <router-view v-slot="{ Component }">
        <TopBar></TopBar>
        <!-- <transition name="fade" mode="out-in"> -->
          <component :is="Component" />
        <!-- </transition> -->
      </router-view>
    </main>
  </div>
</template>

<script>
import MenuBar from '@/components/layout/MenuBar.vue'
import TopBar from '@/components/layout/TopBar.vue'
import CryptoService from '../../services/crypto'
export default {
  name: 'TsDefault',
  components: {
    MenuBar,
    TopBar
  },
  setup() {
    console.log('Init crypto service!')
    CryptoService.init()
    // if there's nothing in the db, show welcome screen
    // welcome screen will have recover option, create new wallet option and import option
    // recover option will recover the whole wallet via seed
    // import option will import the WIF (previously exported from somewhere within the app)
    // create new wallet will ask for a new password and generate a new seed/pk/address/etc

    // if there is an account/wallet in the db, ask for password (lock screen page), render dashboard
    return {
    }
  }
}
</script>

<style scoped>
.default-layout {
  position: relative;
}
</style>
