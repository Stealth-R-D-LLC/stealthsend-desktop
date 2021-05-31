<template>
  <div class="settings-container">
    <SettingsNav></SettingsNav>
    <router-view> </router-view>
  </div>
</template>

<script>
import SettingsNav from '@/views/settings/SettingsNav.vue';

export default {
  name: 'StSettings',
  components: {
    SettingsNav,
  },
  setup() {
    return {};
  },
};
</script>

<style scoped>
.settings-container {
  display: flex;
}
</style>

<style>
.st-settings-child {
  padding: 42px 64px;
}
.st-settings-child .title {
  font-family: var(--primary-font);
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.32px;
  color: var(--black);
}

.st-settings-child .subtitle {
  font-family: var(--secondary-font);
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.12px;
  color: var(--black);
  margin-top: 12px;
}

.content {
  margin-top: 40px;
}
</style>
