<template>
  <router-link v-if="to" :to="to" class="st-link" tag="a">
    <slot></slot>
  </router-link>
  <a v-else class="st-link" href="" @click.prevent="handleClick">
    <slot></slot>
  </a>
</template>

<script>
export default {
  props: {
    to: {
      type: String,
      required: false,
      default: () => {
        return null
      },
    },
  },
  emits: ['click'],
  setup(props, ctx) {
    function handleClick() {
      ctx.emit('click')
    }
    return {
      handleClick
    }

  },
}
</script>

<style lang="postcss" scoped>
.st-link {
  color: var(--marine700);
  font-size: 14px;
  letter-spacing: 0.16px;
  position: relative;
  line-height: 20px;
  text-decoration: none;
  transition: all 0.6s;
  &:before {
    content: '';
    width: 0;
    position: absolute;
    bottom: 0;
    left: 0;
    background: var(--marine700);
    transition: all 0.3s;
    height: 1px;
  }
  &:hover {
    &:before {
      width: 100%;
      left: 0;
      background: var(--marine700);
    }
  }
}
</style>
