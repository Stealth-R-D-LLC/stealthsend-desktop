<template>
  <div class="container">
    <StLoading :visibility="isLoading"></StLoading>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import globalState from '@/store/global'
import StLoading from '@/components/kit/StLoading.vue'
import {computed} from 'vue'
export default {
  name: 'TsDefault',
  components: {
    StLoading
  },
  setup() {
    const isLoading = computed(() => {
      return globalState.state.globalLoading
    })
    // if there's nothing in the db, show welcome screen
    // welcome screen will have recover option, create new wallet option and import option
    // recover option will recover the whole wallet via seed
    // import option will import the WIF (previously exported from somewhere within the app)
    // create new wallet will ask for a new password and generate a new seed/pk/address/etc 

    // if there is an account/wallet in the db, ask for password (lock screen page), render dashboard
    return {
      isLoading
    }
  }
}
</script>

<style scoped></style>
