<template>
  <div class="recent-notifications">
    <div class="top">
      <span class="title">Recent notifications</span>
      <div class="icons">
        <SvgIcon name="icon-close-primary" @click="closeCanvas" />
      </div>
    </div>
    <div class="notifications-list">
      <div class="notifications-grid" v-for="(n, index) in 20" :key="n">
        <div>
          <p class="bold">New reply on ticket received</p>
          <p>Stealth Customer Service team replied on you suppor...</p>
          <p>7 Mar 2021, 4:01:01 PM</p>
        </div>
        <span
          class="notification-dot"
          :class="[index > 1 ? 'unread' : 'read']"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMainStore } from '@/store';
import SvgIcon from '../partials/SvgIcon.vue';

const mainStore = useMainStore();
function closeCanvas() {
  mainStore.TOGGLE_DRAWER(false);
  setTimeout(() => {
    mainStore.SET_OFF_CANVAS_DATA(null);
    mainStore.SET_CURRENT_CANVAS('transaction-details');
  }, 300);
}
</script>

<style scoped>
.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.notifications-list {
  margin-top: 18px;
  overflow: auto;
  max-height: calc(100vh - 88px);
  width: calc(100% + 5px);
  padding-right: 18px;
}
.notifications-list::-webkit-scrollbar {
  width: 4px;
}
.notifications-list:hover::-webkit-scrollbar-thumb {
  background: var(--grey100);
}
.notifications-list::-webkit-scrollbar-thumb {
  background: transparent;
}
.notifications-grid {
  display: grid;
  grid-template-columns: 11fr 8px;
  grid-gap: 10px;
}
.notifications-grid + .notifications-grid {
  margin-top: 33px;
}
.notification-dot {
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 6px;
}
.read {
  background-color: var(--grey200);
}
.unread {
  background-color: var(--red500);
}
</style>
