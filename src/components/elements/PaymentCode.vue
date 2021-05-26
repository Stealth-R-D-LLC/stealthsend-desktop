<template>
  <div class="payment-code">
    <input
      v-for="(digit, index) in digits"
      type="text"
      :key="index"
      maxlength="1"
      :class="`digit-${index}`"
      :name="`digit-${index}`"
      :data-next="index !== digits - 1 ? `digit-${index + 1}` : undefined"
      :data-previous="index !== 0 ? `digit-${index - 1}` : undefined"
      @keyup="handleKeyup"
    />
  </div>
</template>

<script>
export default {
  name: 'StPaymentCode',
  props: {
    digits: {
      type: Number,
      required: false,
      default: 5,
    },
  },
  emits: ['update:modelValue'],
  setup(_, ctx) {
    function getAllDigits() {
      // retrieve all digits entered in "boxes" for emitting purposes
      let code = '';
      document.querySelectorAll('.payment-code > input').forEach((input) => {
        if (input.value) {
          code = code + input.value;
        }
      });

      return code;
    }
    function handleKeyup(e) {
      let parent = e.srcElement.parentNode;

      // backspace or left arrow
      if (e.keyCode === 8 || e.keyCode === 37) {
        var prev = parent.querySelectorAll(
          'input.' + e.srcElement.getAttribute('data-previous')
        )[0];

        if (prev) {
          prev.focus();
        }

        // 48-57 are 0-9, 96-105 0-9 on numpad, 39 is right arrow
      } else if ((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode === 39) {
        let next = parent.querySelectorAll(
          'input.' + e.srcElement.getAttribute('data-next')
        )[0];

        if (next) {
          next.focus();
        }
        e.target.value = e.key;
      } else {
        e.preventDefault();
        e.target.value = '';
        e.target.focus();
        return false;
      }

      const code = getAllDigits();
      ctx.emit('update:modelValue', code);
    }

    return {
      handleKeyup,
    };
  },
};
</script>

<style scoped>
.payment-code input {
  width: 30px;
  height: 50px;
  border: none;
  line-height: 50px;
  text-align: center;
  font-size: 24px;
  font-weight: 200;
  margin: 0 2px;
}
</style>
