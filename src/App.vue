<template>
  <div class="container">
    <NoInternet v-if="!isOnline" />
    <!-- <NoStealthConnection v-if="!isRpcAvailable" /> -->
    <StLoading :visibility="isLoading"></StLoading>
    <component :is="layout"> </component>
  </div>
</template>

<script>
import { useMainStore } from '@/store';

// import StLoading from '@/components/kit/StLoading.vue'
import { computed } from 'vue';
import DefaultLayout from './components/layout/Default.vue';
import NewUserLayout from './components/layout/NewUser.vue';
import SingleColumnLayout from './components/layout/SingleColumnLayout.vue';
import LockLayout from './components/layout/Lock.vue';
import { useRoute } from 'vue-router';
import router from '@/router';
import NoInternet from '@/components/connection/NoInternetConnection.vue';
import NoStealthConnection from '@/components/connection/NoStealthConnection.vue';
import { useOnline } from '@vueuse/core';
// import db from '@/db';

export default {
  name: 'StDefault',
  components: {
    NoInternet,
    NoStealthConnection,
  },
  setup() {
    const mainStore = useMainStore();
    const online = useOnline();

    const route = useRoute();
    const isLoading = computed(() => {
      return mainStore.globalLoading;
    });
    const isOnline = computed(() => {
      return online.value;
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
      if (router.name === 'Lock') return; // don't handle if already on lock screen
      // CTRL + ESCAPE combo
      if (event.ctrlKey && event.code === 'Escape') {
        mainStore.SET_IS_LOCK(true);
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
          mainStore.SET_IS_LOCK(true);
          router.push('/lock');
        }
      }
    }
    calculateIdleTime();

    return {
      isOnline,
      isLoading,
      layout,
    };
  },
};
</script>
<style scoped>
@import 'css/skeleton/layout.css';
</style>
