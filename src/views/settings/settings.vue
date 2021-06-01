<template>
  <div class="settings-container">
    <SettingsNav></SettingsNav>
    <div class="st-settings-child" v-if="$route.path === '/settings'">
      <h2 class="title">General Information</h2>
      <p class="subtitle">
        Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
      </p>
      <div class="content">
        <p>Stealth: The Fastest Private Digital Currency</p>
        <p>
          We are building the Holy Grail of Crypto: a fast, feeless, private and
          scalable digital currency
        </p>
        <p>Application version: v1.0.0.0.</p>
        <p>
          Github Source Repository https://github.com/Stealth-R-D-LLC/Stealth
        </p>

        <p>This application is provided to you for free by Stealth R&D LLC</p>

        <p>Exchange rate source coincap.io</p>
      </div>
    </div>
    <router-view></router-view>
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
