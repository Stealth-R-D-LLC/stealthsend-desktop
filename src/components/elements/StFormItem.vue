<template>
  <div
    class="st-form-item"
    :class="{
      'st-form-item--has-error': !!errorMessage,
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
  border: 1px dashed red;
}
</style>
