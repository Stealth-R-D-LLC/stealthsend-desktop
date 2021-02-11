<template>
  <div class="uikit-container">
    ui kit
    <StButton color="secondary" @click="clickHandler('aaaaa')">Dash</StButton>
    <StButton @click="clickHandler('bbbbb')">Settings</StButton>
    <StInput></StInput>
  </div>
</template>

<script>
import StButton from '/~/components/kit/StButton.vue'
import StInput from '/~/components/kit/StInput.vue'
export default {
      components: {
    StButton,
    StInput,
  },
  setup() {
    function clickHandler(test) {
      console.log('---> ', test)
    }
    return {
      clickHandler,
    }
  },
}
</script>

<style scoped></style>
