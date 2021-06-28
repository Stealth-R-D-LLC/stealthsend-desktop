<template>
  <div class="container">
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
import { useRoute } from 'vue-router';
import router from '@/router';
// import db from '@/db';

export default {
  name: 'TsDefault',
  components: {
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

    document.addEventListener('keydown', function (event) {
      if (route.name === 'Lock') return; // don't handle if already on lock screen
      // ALT + L combo
      if (event.altKey && event.key === 'l') {
        router.push('/lock');
      }
    });

    // calculate idle time for auto lock
    async function calculateIdleTime() {
      let idleTime = 0;

      setInterval(timerIncrement, 1000);

      document.addEventListener('mousemove', function () {
        idleTime = 0;
      });
      document.addEventListener('keypress', function () {
        idleTime = 0;
      });

      function timerIncrement() {
        let config = localStorage.getItem('autolock') || null;
        config = JSON.parse(config);
        idleTime = idleTime + 1;
        if (!config) return;
        if (
          idleTime > config.interval &&
          config.isEnabled &&
          route.name !== 'Lock'
        ) {
          router.push('/lock');
        }
      }
    }
    calculateIdleTime();

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
