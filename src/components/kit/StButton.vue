<template>
  <button
    class="st-button"
    :class="{
      'st-button--primary': color === 'primary',
      'st-button--secondary': color === 'secondary',
      disabled: disabled,
    }"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'StButton',
  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: () => {
        return false
      },
    },
    color: {
      type: String,
      required: false,
      default: () => {
        return 'primary'
      },
      validator: (value) => {
        return ['primary', 'secondary'].includes(value)
      },
    },
  },
  emits: ['click'],
  setup(props, ctx) {
    function handleClick() {
      ctx.emit('click')
    }
    return {
      handleClick,
    }
  },
}
</script>

<style scoped lang="postcss">
.st-button {
  /* box-sizing: border-box; */
  padding: 12px;
  font-family: 'Source Sans Pro';
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
  line-height: 26px;
  text-align: center;
  min-width: 140px;
  outline: none;

  &--primary {
    border: 1px solid var(--marine600);
    background-color: var(--marine500);
    background: linear-gradient(
      153.43deg,
      var(--marine500) 0%,
      var(--marine600) 100%
    );
    color: var(--white);

    &:hover {
      background-color: var(--marine400);
      cursor: pointer;
    }
  }

  &--secondary {
    border: none;
    background-color: transparent;
    color: var(--marine500);

    &:hover {
      cursor: pointer;
      color: var(--marine400);
    }
  }
}

.disabled {
  opacity: 0.5;
  &:hover {
      cursor: not-allowed;
  }
}
</style>
