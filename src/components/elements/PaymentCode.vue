<template>
  <div :class="`payment-code payment-code--${position}`">
    <input
      v-for="(digit, index) in digits"
      type="text"
      :key="index"
      maxlength="1"
      :class="`digit-${index} digit-${position}`"
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
    position: {
      type: String,
      default: 'center',
    },
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
.payment-code--center,
.digit-center {
  text-align: center;
}
.digit-center {
  font-size: 20px;
  line-height: 28px;
}
.payment-code--left,
.digit-left {
  text-align: left;
}
.digit-left {
  font-size: 12px;
  line-height: 24px;
}
.payment-code input {
  width: 40px;
  border: none;
  outline: none;
  padding: 8px 0;
  border-bottom: 2px solid var(--grey200);
}
.payment-code input + input {
  margin-left: 16px;
}
</style>
