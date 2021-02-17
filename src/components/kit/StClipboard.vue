<template>
  <span class="st-clipboard" @click="copy">Copy to clipboard (click me)</span>
</template>

<script>
export default {
  name: 'StCopyToClipboard',
  props: {
    content: {
      type: String,
      required: true,
    },
  },
  emits: ['click'],
  setup(props, ctx) {
    function copy() {
      navigator.clipboard.writeText(props.content).then(
        () => {
          ctx.emit('click')
        },
        (err) => {
          console.warn('Async: Could not copy to clipboard: ', err)
        }
       )
    }
    return { copy }
  },
}
</script>

<style lang="postcss" scoped>
.st-clipboard {
  &:hover {
    cursor: pointer;
  }
}
</style>
