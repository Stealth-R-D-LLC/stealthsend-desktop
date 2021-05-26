<template>
  <div class="st-settings-nav">
    <div class="st-settings-nav__title">Settings</div>
  </div>
</template>

<script>
export default {
  name: 'StSettingsNav',
  setup() {
    return {};
  },
};
</script>

<style scoped>
.st-settings-nav {
  min-width: 346px;
  width: 346px;
  padding: 0 24px;
  background-color: var(--background50);
}

.st-settings-nav__title {
  font-size: 18px;
  line-height: 28px;
  letter-spacing: 0.32px;
  color: var(--grey1000);
  padding: 32px 24px 0;
  height: 50px;
  border-bottom: 1px solid var(--grey100);
}
</style>
