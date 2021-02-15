<template>
  <label class="st-radio" :for="id">
    <span class="st-radio__label">
      <slot></slot>
    </span>
    <input
      :id="id"
      :name="name"
      type="radio"
      class="st-radio__input"
      :value="label"
      @input="$emit('update:modelValue', label)"
    />
    <span class="st-radio__checkmark"></span>
  </label>
</template>

<script>
// import { ref } from 'vue'
export default {
  name: 'StRadio',
  props: {
    id: {
      type: String,
      required: true,
    },
    modelValue: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  emits: ['update:modelValue'],
}
</script>

<style lang="postcss" scoped>
.st-radio {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  color: var(--text);
  font-size: 16px;
  letter-spacing: 0.12px;
  line-height: 25px;
  &__label {
      margin-left: 10px;
  }
  &__input {
    /* Hide the browser's default radio button */

    position: absolute;
    opacity: 0;
    cursor: pointer;

    /* When the radio button is checked, add a blue background */
    &:checked ~ .st-radio__checkmark {
      background-color: transparent;
      border: 2px solid var(--marine500);
    }
    /*  shot dot indicator when selected */
    &:checked ~ .st-radio__checkmark:after {
      display: block;
    }
  }
  &__checkmark {
    /* Create a custom radio button */

    position: absolute;
    top: 0;
    left: 0;
    height: 24px;
    width: 24px;
    background-color: transparent;
    border-radius: 50%;
    border: 2px solid var(--grey200);
    margin-right: 16px;

    /* create indikator dot */
    &:after {
      content: '';
      position: absolute;
      display: none;
      top: 6px;
      left: 6px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--marine500);
    }
  }
}
</style>
