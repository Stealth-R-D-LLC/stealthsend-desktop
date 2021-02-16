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
  setup(props) {
    function copy() {
      navigator.clipboard.writeText(props.content).then(
        () => {},
        function (err) {
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
