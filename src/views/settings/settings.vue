<template>
  <div class="settings-container">
    <SettingsNav></SettingsNav>
    <div class="st-settings-child" v-if="$route.path === '/settings'">
      <div class="st-settings-child__overflow">
        <h2 class="title">General Information</h2>
        <p class="subtitle">Information about Stealth and StealthSend</p>
        <div class="content">
          <p class="page-title">
            Stealth: The Fastest Private Digital Currency
          </p>
          <p class="text">
            We are building the Holy Grail of Crypto: a fast, feeless, private
            and scalable digital currency
          </p>
          <p class="text">Application version: v. {{ version }}</p>
          <p class="text">
            Github Source Repository
            <br />
            <a
              class="link"
              href="https://github.com/Stealth-R-D-LLC/Stealth"
              target="_blank"
              >https://github.com/Stealth-R-D-LLC/Stealth</a
            >
          </p>

          <p class="text">
            This application is provided to you for free by Stealth R&D LLC
          </p>

          <p class="text">
            Exchange rate source
            <br />
            <a class="link" href="https://coincap.io/" target="_blank"
              >coincap.io</a
            >
          </p>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import SettingsNav from '@/views/settings/SettingsNav.vue';
import pkgjson from '@/../package.json';
import { ref } from 'vue';
export default {
  name: 'StSettings',
  components: {
    SettingsNav,
  },
  setup() {
    const version = ref(pkgjson.version);
    return {
      version,
    };
  },
};
</script>

<style scoped>
.settings-container {
  display: flex;
}

.content {
  max-width: 503px;
  margin-top: 40px;
  font-family: var(--secondary-font);
  color: var(--grey900);
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.12px;
}
.content .page-title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 26px;
}

.content .text {
  font-weight: normal;
  margin-bottom: 26px;
  font-size: 12px;
  letter-spacing: 0.12px;
  line-height: 24px;
}

.content .st-link {
  font-weight: normal;
  margin-bottom: 26px;
  font-size: 12px;
  letter-spacing: 0.12px;
  line-height: 24px;
}
</style>

<style>
.st-settings-child {
  padding: 42px 10px 40px 64px;
  height: calc(100vh - 101px);
  width: 100%;
  box-sizing: border-box;
}
.st-settings-child__overflow {
  overflow: auto;
  height: 100%;
  padding-right: 50px;
}
.st-settings-child__overflow::-webkit-scrollbar {
  width: 4px;
}
.st-settings-child__overflow::-webkit-scrollbar-thumb {
  background: var(--grey100);
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
