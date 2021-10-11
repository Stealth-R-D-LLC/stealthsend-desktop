<template>
  <div class="st-settings-child st-password-container">
    <div class="st-settings-child__overflow">
      <h2 class="title">Auto-lock</h2>
      <p class="subtitle">Automatically lock StealthSend after inactivity</p>
      <div class="content">
        <p class="notice">
          <span class="bold">Notice:</span> For enhanced security it is
          recommended to enable Auto-lock. When enabled you will need your
          password to unlock your StealthSend app.
        </p>
        <StSwitch
          type="simple"
          @update:modelValue="toggleAutoLock"
          v-model="isEnabled"
        >
          Enable Auto-lock
        </StSwitch>
        <div class="minutes-picker" v-if="isEnabled">
          <p>Select one of the following options:</p>
          <div class="options">
            <span
              class="option"
              :class="{
                'option--is-selected': option.value === selectedInterval,
              }"
              v-for="option in options"
              :key="option.value"
              @click="changeInterval(option.value)"
              >{{ option.label }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMainStore } from '@/store';
import { onMounted, ref } from 'vue';

const mainStore = useMainStore();
const options = ref([
  // interval config values are in seconds
  { label: '1 minute', value: 60 },
  { label: '5 minutes', value: 300 },
  { label: '10 minutes', value: 600 },
  { label: '15 minutes', value: 900 },
  { label: '30 minutes', value: 1800 },
  // { label: '1 hour', value: 3600 },
]);
const selectedInterval = ref(60);
const isEnabled = ref(false);
const menuExpanded = ref(false);

onMounted(async () => {
  getIntervalFromStorage();
  getExpandedMenu();
});

// interval config is set in local storage to avoid reading the db every second

function storeIntervalInStorage() {
  localStorage.setItem(
    'autolock',
    JSON.stringify({
      interval: selectedInterval.value,
      isEnabled: isEnabled.value,
    })
  );
}

async function getIntervalFromStorage() {
  let config = JSON.parse(localStorage.getItem('autolock'));
  if (config) {
    selectedInterval.value = config.interval;
    isEnabled.value = config.isEnabled;
  }
}

function changeInterval(interval) {
  selectedInterval.value = interval;
  setTimeout(() => {
    storeIntervalInStorage();
  }, 1);
}

function toggleAutoLock() {
  setTimeout(() => {
    storeIntervalInStorage();
  }, 1);
}

function getExpandedMenu() {
  let menu = JSON.parse(localStorage.getItem('menubar'));
  if (menu) {
    mainStore.SET_EXPANDED_MENU(JSON.parse(localStorage.getItem('menubar')));
    menuExpanded.value = mainStore.isMenuExpanded;
  }
}
</script>

<style scoped>
.notice {
  padding: 16px 20px;
  background-color: var(--background100);
  font-family: var(--secondary-font);
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.12px;
  color: var(--grey900);
  margin: 28px 0;
}

.notice .bold {
  font-weight: bold;
}
.notice p {
  text-align: left;
}

.option {
  padding: 6px 12px;
  font-family: var(--secondary-font);
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.12px;
  color: var(--grey900);

  background: linear-gradient(
      153.02deg,
      rgba(250, 249, 252, 0.15) 0%,
      rgba(229, 228, 232, 0.15) 83.23%
    ),
    var(--grey50);
  border: 1px solid rgba(229, 228, 232, 0.15);
  box-sizing: border-box;
  border-radius: 6px;
  margin-right: 14px;
  cursor: pointer;
}

.option--is-selected {
  font-weight: 700;
  letter-spacing: 0.12px;
  color: var(--marine500);
  background: linear-gradient(
      153.43deg,
      rgba(184, 183, 187, 0.15) 0%,
      rgba(229, 228, 232, 0.15) 83.33%
    ),
    var(--grey100);
  border: 1px solid rgba(207, 205, 209, 0.25);
}

.options {
  margin: 24px 0 0 0;
}

.minutes-picker {
  margin: 24px 0 0 0;
  padding: 24px 0;
  border-top: 1px solid var(--grey100);
}

.minutes-picker p {
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.12px;
  color: var(--grey900);
}

.menu-expand {
  margin-bottom: 24px;
}
</style>
