<template>
  <fieldset
    class="st-amount"
    :class="{
      'has-error': hasError,
      'st-amount--is-not-empty':
        (formattedValue && formattedValue.replace('$', '') > 0) ||
        (formattedValue && formattedValue.replace('XST', '') > 0),
    }"
  >
    <input
      ref="inputRef"
      :type="type"
      :disabled="disabled"
      autocomplete="off"
      :placeholder="placeholder"
      class="st-amount__inner"
      :class="{
        'is-disabled': disabled,
        'is-dirty':
          (formattedValue && Number(formattedValue.replace('$', '')) > 0) ||
          (formattedValue && Number(formattedValue.replace('XST', '')) > 0),
      }"
      :value="value"
    />
    <div v-if="$slots.default" class="st-icon"><slot /></div>
  </fieldset>
</template>

<script>
export default {
  setup() {
    return {};
  },
};
</script>

<style scoped></style>
