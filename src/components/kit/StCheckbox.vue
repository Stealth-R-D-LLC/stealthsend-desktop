<template>
  <label class="st-checkbox">
    <span class="st-checkbox__label">
      <slot></slot>
    </span>
    <input
      type="checkbox"
      class="st-checkbox__input"
      :value="label"
      @input="handleInput"
    />
    <span class="st-checkbox__checkmark">
      <span class="check"></span>
    </span>
  </label>
</template>

<script>
export default {
  name: 'StCheckbox',
  props: {
    modelValue: {
      type: [String, Boolean],
      required: true,
    },
    label: {
      type: [String, Boolean],
      required: false,
      default: false
    },
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    function handleInput(event) {
      let isChecked = event.target.checked
      ctx.emit('update:modelValue', isChecked)
    }

    return {
      handleInput
    }
  }
}
</script>

<style lang="postcss" scoped>
.st-checkbox {
  display: block;
  position: relative;
  padding-left: 45px;
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
  &__input {
    /* Hide the browser's default checkbox */

    position: absolute;
    opacity: 0;
    cursor: pointer;

    /* When the radio button is checked, add a blue background */
    &:checked ~ .st-checkbox__checkmark {
      background-color: var(--marine500);
      /* border: 2px solid var(--marine500); */
    }
    /*  show check indicator when selected */
    &:checked ~ .st-checkbox__checkmark .check {
      display: inline-block;
    }
  }
  &__checkmark {
    /* Create a custom checkox button */

    position: absolute;
    top: 0;
    left: 0;
    height: 24px;
    width: 24px;
    background-color: var(--grey100);
    border-radius: 50%;
    border: 2px solid var(--grey100);
    margin-right: 16px;

    /* create indikator check */
    .check {
      position: absolute;
      display: none;
      top: 4px;
      left: 9px;
      width: 5px;
      height: 10px;
      transform: rotate(45deg);
      border-bottom: 2px solid white;
      border-right: 2px solid white;
    }
  }
}
</style>
