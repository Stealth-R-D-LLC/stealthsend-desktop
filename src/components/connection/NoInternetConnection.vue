<template>
  <div class="connection-container">
    <img class="background" src="@/assets/welcome.png" alt="welcome" />
    <div class="overlay" />
    <div class="overlay-gradient" />
    <div class="connection-container__inner">
      <div class="content">
        <SvgIcon name="icon-stealth-logo" />
        <h3>Seems like you're stealthier<br />than Stealth</h3>
        <h5>
          Please make sure you have a working internet<br />connection to use
          StealthSend.
        </h5>
        <p class="app-version">StealthSend v{{ version }}</p>
      </div>
      <img class="dragon" src="@/assets/ClarenceDragon.png" alt="Test gif" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import pkgjson from '@/../package.json';
import SvgIcon from '../partials/SvgIcon.vue';
const version = ref(pkgjson.version);
</script>

<style scoped>
.connection-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
}
.overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: var(--marine900);
  opacity: 0.5;
  z-index: 1;
}
.overlay-gradient {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  background: linear-gradient(
    180deg,
    rgba(6, 6, 6, 0) 0%,
    var(--grey1100) 100%
  );
}
.connection-container .background {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.connection-container__inner {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 3;
  display: grid;
  grid-template-columns: 6fr 6fr;
  grid-gap: 32px;
  margin: 80px 72px;
}
.connection-container__inner .dragon {
  display: block;
  max-width: 435px;
  max-height: 563px;
  margin: auto;
}
h3,
h5,
p {
  color: var(--grey50);
}
.content {
  display: flex;
  flex-direction: column;
}
.content h3 {
  margin: 60px 0;
}
.content .app-version {
  margin-top: auto;
}
</style>
