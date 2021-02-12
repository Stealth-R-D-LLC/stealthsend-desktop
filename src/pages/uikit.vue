<template>
  <div class="uikit-container">
    <h1>UI Kit</h1>
    <h2>Buttons</h2>
    <StButton color="secondary" @click="clickHandler('aaaaa')">Dash</StButton>
    <StButton @click="clickHandler('bbbbbaaaaaaaaaaaaaaaa')">Settings</StButton>
    <br />
    <br />
    <h2>Inputs</h2>
    {{ bla }}
    <StInput v-model="bla" placeholder="aaaa"></StInput>
    <StInput
      v-model="bla"
      has-error
      :error-messages="'custom error message'"
    ></StInput>
  </div>
</template>

<script>
import StButton from '/~/components/kit/StButton.vue'
import StInput from '/~/components/kit/StInput.vue'
import { ref } from 'vue'
export default {
  components: {
    StButton,
    StInput,
  },
  setup() {
    const bla = ref('')
    function clickHandler(test) {
      console.log('---> ', test)
    }
    return {
      clickHandler,
      bla,
    }
  },
}
</script>

<style scoped></style>
