<template>
  <div class="container">
    <StLoading :visibility="isLoading"></StLoading>
    <component :is="layout"> </component>
  </div>
</template>

<script>
import globalState from '@/store/global'
import StLoading from '@/components/kit/StLoading.vue'
import { computed } from 'vue'
import DefaultLayout from './components/layout/Default.vue'
import NewUserLayout from './components/layout/NewUser.vue'
import { useRoute } from 'vue-router'

export default {
  name: 'TsDefault',
  components: {
    StLoading
  },
  setup() {
    const route = useRoute()
    const isLoading = computed(() => {
      return globalState.state.globalLoading
    })
    const layout = computed(() => {
      if (!route && !route.name) return
      const layout = route.meta.layout || 'default' // this.$route.meta.layout
      if (!layout || layout === 'default') {
        return DefaultLayout
      } else if (layout === 'new-user') {
        return NewUserLayout
      } else {
        console.warn('Layout error')
        return DefaultLayout
      }
    })
    return {
      isLoading,
      layout
    }
  }
}
</script>
<style scoped>
@import 'css/skeleton/layout.css';
</style>

<style src="@vueform/multiselect/themes/default.css"></style>
