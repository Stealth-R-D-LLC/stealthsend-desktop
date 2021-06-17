<template>
  <div
    class="st-form-item"
    :class="{
      'st-form-item--has-error': errorMessage.length,
      'st-form-item--is-dark': color === 'dark',
      'st-form-item--is-success': notice,
    }"
  >
    <label for="">{{ label }}</label>
    <slot v-bind="{ field, name }"></slot>
    <p
      class="st-form-item__message"
      :class="[
        notice && !errorMessage
          ? 'st-form-item__message--is-notice'
          : 'st-form-item__message--is-error',
      ]"
      v-show="errorMessage || notice"
    >
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
        return 'default';
      },
      validator: (value) => {
        return ['default', 'dark'].includes(value);
      },
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
  margin: 54px 0;
}
.st-form-item label {
  position: absolute;
  top: -20px;
  left: 0;
  pointer-events: none;
  font-size: 12px;
  color: var(--marine500);
  font-family: var(--secondary-font);
  font-weight: 600;
  letter-spacing: 0.16px;
  line-height: 20px;
}
.st-form-item__message {
  position: absolute;
  top: calc(100% + 10px);
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.12px;
}
.st-form-item__message--is-error {
  color: var(--danger);
}
.st-form-item__message--is-notice {
  color: var(--grey400);
}
.st-form-item--is-dark :deep .st-icon path {
  stroke: var(--grey100);
}
.st-form-item--is-dark label {
  color: var(--grey50) !important;
}
.st-form-item--is-dark :deep input::placeholder {
  color: var(--grey100);
}
.st-form-item--is-dark :deep input {
  color: var(--grey100);
}
.st-form-item--has-error label {
  color: var(--danger);
}
.st-form-item--has-error :deep .st-input::after {
  background-color: var(--danger);
}
.st-form-item--has-error :deep .st-icon path {
  stroke: var(--danger);
}
:deep .form-desc {
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.12px;
  color: var(--grey400);
  font-family: var(--secondary-font);
}
</style>
