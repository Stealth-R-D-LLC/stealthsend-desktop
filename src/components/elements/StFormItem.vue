<template>
  <div
    class="st-form-item"
    :class="{
      'st-form-item--has-error': errorMessage.length,
      'st-form-item--is-dark': color === 'dark',
      'st-form-item--is-success': notice,
    }"
  >
    <div class="label">
      <label for="">{{ label }} </label>
      <span @click="handleActionLabelClick" class="label-right">{{
        labelRight
      }}</span>
    </div>
    <slot v-bind="{ field, name }"></slot>
    <p
      class="st-form-item__message"
      :class="[
        notice && (!errorMessage || errorMessage.length === 0)
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
    labelRight: {
      type: String,
      required: false,
      default: '',
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
  emits: ['rightLabelClick'],
  setup(_, ctx) {
    function handleActionLabelClick() {
      ctx.emit('rightLabelClick');
    }
    return {
      handleActionLabelClick,
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
  margin-top: 6px;
}
.st-form-item__message--is-error {
  color: var(--red300);
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
  color: var(--red500);
}
.st-form-item--has-error :deep .st-input::after {
  background-color: var(--red500);
}
.st-form-item--has-error :deep .st-icon path {
  stroke: var(--red500);
}
:deep .form-desc {
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.12px;
  color: var(--grey400);
  font-family: var(--secondary-font);
}
.st-form-item--is-dark :deep .multiselect__content-wrapper {
  background: var(--marine800);
  border: 1px solid var(--marine700);
}
.st-form-item--is-dark :deep .multiselect__option--selected {
  color: var(--grey200);
}
.st-form-item--is-dark :deep .multiselect__option--selected {
  color: var(--grey200);
}
.st-form-item--is-dark :deep .multiselect__option--highlight {
  color: var(--grey200) !important;
}
.st-form-item--is-dark :deep .multiselect__option {
  color: var(--grey100);
}

.st-form-item :deep .label-right {
  font-family: var(--secondary-font);
  font-weight: normal;
  font-size: 12px;
  line-height: 24px;
  text-align: right;
  letter-spacing: 0.12px;
  color: var(--marine200);
  position: absolute;
  top: -22px;
  right: 0;
  cursor: pointer;
}
</style>
