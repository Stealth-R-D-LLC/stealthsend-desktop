<template>
  <div class="settings-container">
    <SettingsNav></SettingsNav>
    <div class="st-settings-child" v-if="$route.path === '/settings'">
      <h2 class="title">General Information</h2>
      <p class="subtitle">
        Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
      </p>
      <div class="content">
        <p class="page-title">Stealth: The Fastest Private Digital Currency</p>
        <p class="text">
          We are building the Holy Grail of Crypto: a fast, feeless, private and
          scalable digital currency
        </p>
        <p class="text">Application version: v1.0.0.0.</p>
        <p class="text">
          Github Source Repository
          <br />
          <StLink> https://github.com/Stealth-R-D-LLC/Stealth </StLink>
        </p>

        <p class="text">
          This application is provided to you for free by Stealth R&D LLC
        </p>

        <p class="text">
          Exchange rate source
          <br />
          <StLink> coincap.io </StLink>
        </p>
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

.content {
  margin-top: 40px;
  font-family: var(--secondary-font);
  color: var(--grey900);
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.12px;
}
.content .page-title {
  font-weight: 700;
  margin-bottom: 26px;
}

.content .text {
  font-weight: normal;
  margin-bottom: 26px;
  font-size: 14px;
  letter-spacing: 0.12px;
  line-height: 24px;
}

.content .st-link {
  font-weight: normal;
  margin-bottom: 26px;
  font-size: 14px;
  letter-spacing: 0.12px;
  line-height: 24px;
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
</style>
