<template>
  <div class="st-input" :class="{ 'st-input--has-icon': icon }">
    <input
      ref="input"
      :type="type"
      :disabled="disabled"
      :placeholder="placeholder"
      autocomplete="off"
      class="st-input__inner"
      :class="{ 'is-disabled': disabled }"
      :value="value"
      @input="$emit('input', $event.target.value)"
      @change="$emit('change', $event.target.value)"
      @keyup="$emit('keyup', $event.target.value)"
    />
  </div>
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
    value: {
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
  },
  emits: ['change', 'input', 'keyup'],
}
</script>

<style scoped>

</style>