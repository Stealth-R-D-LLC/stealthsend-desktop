<template>
  <div class="container">
    <ReceiveModal :steps="3" :current-step="1"></ReceiveModal>
    <StLoading :visibility="isLoading" :opaque="true"></StLoading>
    <component :is="layout"> </component>
    <OffCanvas></OffCanvas>
  </div>
</template>

<script>
import { useMainStore } from '@/store';

// import StLoading from '@/components/kit/StLoading.vue'
import { computed } from 'vue';
import DefaultLayout from './components/layout/Default.vue';
import NewUserLayout from './components/layout/NewUser.vue';
import SingleColumnLayout from './components/layout/SingleColumnLayout.vue';
import OffCanvas from './components/elements/StOffCanvas.vue';
import LockLayout from './components/layout/Lock.vue';
import ReceiveModal from './components/partials/ReceiveModal.vue';
import { useRoute } from 'vue-router';

export default {
  name: 'TsDefault',
  components: {
    ReceiveModal,
    OffCanvas,
  },
  setup() {
    const mainStore = useMainStore();

    const route = useRoute();
    const isLoading = computed(() => {
      return mainStore.globalLoading;
    });
    const layout = computed(() => {
      if (!route && !route.name) return;
      const layout = route.meta.layout || 'default'; // this.$route.meta.layout
      if (!layout || layout === 'default') {
        return DefaultLayout;
      } else if (layout === 'new-user') {
        return NewUserLayout;
      } else if (layout === 'lock') {
        return LockLayout;
      } else if (layout === 'single') {
        return SingleColumnLayout;
      } else {
        console.warn('Layout error');
        return DefaultLayout;
      }
    });
    return {
      isLoading,
      layout,
    };
  },
};
</script>
<style scoped>
@import 'css/skeleton/layout.css';
</style>

<style src="@vueform/multiselect/themes/default.css"></style>
