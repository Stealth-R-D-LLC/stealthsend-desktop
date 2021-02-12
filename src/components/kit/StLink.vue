<template>
  <div></div>
</template>

<script>
export default {
  props: {
    action: {
      type: String,
      required: false,
      default: () => {
        return ''
      },
    },
  },
  setup() {
    return {}
  },
}
</script>

<style lang="postcss" scoped></style>
