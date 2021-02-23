<template>
  <span class="st-clipboard" @click="copyToClipboard"
    >Copy to clipboard (click me)</span
  >
</template>

<script>
import { useClipboard } from '@vueuse/core'
export default {
  name: 'StCopyToClipboard',
  props: {
    content: {
      type: String,
      required: true
    }
  },
  emits: ['click'],
  setup(props, ctx) {
    const { copy } = useClipboard()
    function copyToClipboard() {
      copy(props.content)
      ctx.emit('click')
    }
    return { copyToClipboard }
  }
}
</script>

<style lang="postcss" scoped>
.st-clipboard:hover {
  cursor: pointer;
}
</style>
