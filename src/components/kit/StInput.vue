<template>
  <fieldset class="st-input" :class="{ 'has-error': hasError }">
    <input
      ref="input"
      :type="type"
      :disabled="disabled"
      :placeholder="placeholder"
      autocomplete="off"
      class="st-input__inner"
      :class="{ 'is-disabled': disabled, 'is-dirty': modelValue.length > 0 }"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <label>{{ hasError ? errorMessages : label }}</label>
  </fieldset>
</template>

<script>
export default {
  name: 'StInput',
  props: {
    icon: {
      type: String,
      required: false,
      default: () => {
        return ''
      },
    },
    modelValue: {
      type: String,
      required: false,
      default: () => {
        return ''
      },
    },
    disabled: {
      type: Boolean,
      required: false,
      default: () => {
        return false
      },
    },
    type: {
      type: String,
      required: false,
      default: () => {
        return 'text'
      },
    },
    placeholder: {
      type: String,
      required: false,
      default: () => {
        return ''
      },
    },
    hasError: {
      type: Boolean,
      required: false,
      default: () => {
        return false
      },
    },
    errorMessages: {
      type: String,
      required: false,
      default: () => {
        return null
      },
    },
    label: {
      type: String,
      required: false,
      default: () => {
        return 'No label'
      },
    },
  },
  emits: ['update:modelValue'],
}
</script>

<style scoped lang="postcss">
.st-input {
  position: relative;
  padding: 0;
  border: none;
  margin: 16px 0;
  overflow: visible;
  height: 30px;

  &:focus-within::after {
    width: 100%;
  }

  &:after {
    content: '';
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    padding: 0;
    width: 60px;
    background-color: var(--marine500);
    height: 2px;
    border: none;
    font-size: 1px;
    transition: all 200ms ease-out;
  }

  &.has-error {
    label {
      color: var(--danger) !important;
    }
    &:after {
      background-color: var(--danger) !important;
    }
  }

  label {
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: 0 -150%;
    transition: transform 300ms ease;
    pointer-events: none;
    color: var(--text);
    font-size: 14px;
    letter-spacing: 0.16px;
    line-height: 20px;
    transition: all 0.25s ease-in-out;
  }

  input {
    box-sizing: border-box;
    width: 100%;
    padding: 5px 0 8px;
    border: none;
    border-radius: 0;
    outline: none;
    cursor: text;
    position: relative;
    background: transparent;
    border-bottom: 2px solid var(--grey100);

    &:hover {
      /* color */
      border-bottom: 2px solid var(--grey200);
    }

    &:focus {
      &::-webkit-input-placeholder {
        opacity: 1;
        color: var(--grey100);
      }
    }
    &::-webkit-input-placeholder {
      -webkit-transition: 300ms ease;
      transition: 300ms ease;
    }
    &::-webkit-input-placeholder {
      opacity: 0;
      -webkit-transition: 300ms ease;
      transition: 300ms ease;
    }
    &:not(:-moz-placeholder-shown) + .st-input__label {
      color: var(--text);
      transform: translate3d(0, -12px, 0) scale(0.75);
    }
  }
}

.st-input input:focus ~ label,
.st-input input.is-dirty ~ label {
  /* transform: scale(0.6); */
  top: -20px;
  position: absolute;
  color: var(--marine500); 
  font-weight: 600;
  letter-spacing: 0.16px;
  line-height: 20px;
  font-size: 12px;
}

</style>
