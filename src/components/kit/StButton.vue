<template>
  <button class="st-button" :disabled="disabled" @click="handleClick">
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
        return 'default'
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

<style scoped>
.st-button {
  /* height: 40px; */
  padding: 10px;
  background-color: #4e00f6;
  color: #ffffff;
  font-family: 'Source Sans Pro';
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
  line-height: 26px;
  text-align: center;
}
</style>
