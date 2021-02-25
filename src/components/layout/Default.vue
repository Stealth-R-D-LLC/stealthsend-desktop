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
    return {
      isLoading
    }
  }
}
</script>

<style scoped></style>
