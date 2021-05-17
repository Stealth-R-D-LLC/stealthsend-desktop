<template>
  <div class="off-canvas" aria-hidden="true">
    <div
      class="off-canvas-wrapper"
      :class="{ open: isOpen }"
      :aria-hidden="open ? 'true' : 'false'"
      @click="closeCanvas"
    >
      <div class="off-canvas-menu" :class="{ open: isOpen }" @click.stop>
        <!-- <div class="top">
          <span>{{ title }}</span>
          <span class="close-button">
            <svg
              width="18"
              height="14"
              viewBox="0 0 18 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 1l12 12M3 13L15 1"
                stroke="#FAF9FC"
                stroke-width="2"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </div>
        <div class="body"></div> -->
      </div>
    </div>
  </div>
</template>
<script>
import { computed } from 'vue';
import { useMainStore } from '@/store';

export default {
  setup() {
    const mainStore = useMainStore();

    const isOpen = computed(() => {
      return mainStore.isDrawerOpened;
    });

    function closeCanvas() {
      mainStore.TOGGLE_DRAWER(false);
    }

    return {
      isOpen,
      closeCanvas,
    };
  },
};
</script>

<style scoped>
.off-canvas-menu {
  position: fixed;
  right: -500px;
  top: 0;
  transition: right 0.2s ease;
  background: pink;
  width: 400px;
  height: 100%;
}
.off-canvas-menu.open {
  right: 0;
  padding: 40px 32px;
}

.off-canvas-wrapper {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0);
  transition: background-color ease 0.2s;
  z-index: -1;
}
.off-canvas-wrapper.open {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 999;
}

.off-canvas__open-toggle {
  position: fixed;
  right: 30px;
  top: 30px;
}
</style>
