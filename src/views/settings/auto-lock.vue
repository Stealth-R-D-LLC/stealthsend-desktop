<template>
  <div class="st-settings-child st-password-container">
    <h2 class="title">Auto Lock</h2>
    <p class="subtitle">Automatically lock StealthSend after inactivity.</p>
    <div class="content">
            <p class="notice">
        <span class="bold">Note:</span> For enhanced security it is recommended to enable Auto-lock. When enabled you will need your password to unlock your StealthSend app.
      </p>
      <p>Select one of the following options:</p>
      <div class="options">
        <span class="option" v-for="option in [1, 5, 10, 15, 30, 60]" :key="option">{{option}} minutes</span>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  setup() {

    return {

    };
  },
};
</script>

<style scoped>
.notice {
  padding: 24px;
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
font-size: 10px;
line-height: 16px;
letter-spacing: 0.16px;
color: var(--grey900);
}
</style>
