<template>
  <div class="st-label" :class="{ 'st-label--is-bold': bold }">
    <label>{{ label }}</label>
    <p class="content"><slot></slot></p>
  </div>
</template>

<script>
export default {
  name: 'StLabel',
  props: {
    label: {
      type: String,
      required: true,
      default: () => {
        return 'Missing label';
      },
    },
    bold: {
      type: Boolean,
      required: true,
      default: () => {
        return false;
      },
    },
  },
  setup() {
    return {};
  },
};
</script>

<style scoped>
.st-label {
  font-family: var(--secondary-font);
}
.st-label label {
  font-size: 12px;
  font-weight: normal;
  line-height: 24px;
  letter-spacing: 0.12px;
}
.st-label--is-bold label {
  font-weight: 700;
  color: var(--marine500);
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.12px;
}

.st-label .content {
  font-family: var(--primary-font);
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 28px;

  letter-spacing: 0.32px;

  color: var(--text);
  margin-top: 8px;
}
</style>
