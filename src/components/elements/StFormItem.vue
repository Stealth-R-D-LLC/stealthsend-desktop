<template>
  <div
    class="st-form-item"
    :class="{
      'st-form-item--has-error': !!errorMessage,
      'st-form-item--is-dark': color === 'dark',
      'st-form-item--is-success': notice,
    }"
  >
    <label for="">{{ label }}</label>
    <slot v-bind="{ field, name }"></slot>
    <p class="st-form-item__message" v-show="errorMessage || notice">
      {{ errorMessage[0] || notice }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'StFormItem',
  props: {
    color: {
      type: String,
      required: false,
      default: () => {
        return 'default'
      },
      validator: (value) => {
        return ['default', 'dark'].includes(value)
      }
    },
    label: {
      type: String,
      required: false,
      default: 'Missing label',
    },
    name: {
      type: String,
      required: true,
      default: 'noname',
    },
    notice: {
      type: String,
      required: false,
      default: '',
    },
    errorMessage: {
      type: String,
      required: false,
      default: '',
    },
  },
  setup() {
    return {
      // errorMessage
    };
  },
};
</script>

<style scoped>
.st-form-item {
  position: relative;
}
.st-form-item label {
  position: absolute;
  top: -20px;
  left: 0;
  pointer-events: none;
  font-size: 12px;
  color: var(--marine500);
  font-weight: 600;
  letter-spacing: 0.16px;
  line-height: 20px;
}
.st-form-item--is-dark > :deep .st-icon path {
    stroke: var(--grey100);
}
.st-form-item--is-dark label {
    color: var(--grey50) !important;
}
.st-form-item--is-dark > :deep input::placeholder {
    color: var(--grey100);
}
.st-form-item--is-dark :deep input {
color: var(--grey100);
}
</style>