<template>
  <div class="st-settings-child st-password-container">
    <h2 class="title">Auto Lock</h2>
    <p class="subtitle">Automatically lock StealthSend after inactivity.</p>
    <div class="content">
      <p class="notice">
        <span class="bold">Note:</span> For enhanced security it is recommended
        to enable Auto-lock. When enabled you will need your password to unlock
        your StealthSend app.
      </p>
      <div class="minutes-picker" v-if="isEnabled">
        <p>Select one of the following options:</p>
        <div class="options">
          <span
            class="option"
            :class="{ 'option--is-selected': option.value === selected }"
            v-for="option in options"
            :key="option.value"
            @click="selected = option.value"
            >{{ option.label }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
export default {
  setup() {
    const options = ref([
      { label: '1 minute', value: 1 },
      { label: '5 minutes', value: 5 },
      { label: '10 minutes', value: 10 },
      { label: '15 minutes', value: 15 },
      { label: '30 minutes', value: 30 },
      { label: '1 hour', value: 60 },
    ]);
    const selected = ref(1);
    const isEnabled = ref(TextTrackCueList);
    return {
      selected,
      options,
      isEnabled,
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
  padding: 24px 0;
  border-top: 1px solid var(--grey100);
}

.minutes-picker p {
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.12px;
  color: var(--grey900);
}
</style>
