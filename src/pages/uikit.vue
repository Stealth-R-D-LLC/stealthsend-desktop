<template>
  <div class="uikit-container">
    <h1>UI Kit</h1>
    <h2>Buttons</h2>
    <StButton color="secondary" @click="clickHandler('aaaaa')">Dash</StButton>
    <StButton @click="clickHandler('bbbbbaaaaaaaaaaaaaaaa')">Settings</StButton>
    <br />
    <br />
    <h2>Inputs</h2>
    <StInput v-model="bla" placeholder="aaaa"></StInput>
    <StInput
      v-model="bla"
      has-error
      :error-messages="'custom error message'"
    ></StInput>
        <br />
    <br />
    <h2>Link</h2>
    <StLink to="settings">hoveraj me burki</StLink>
    <br>
    <StLink @click="clickHandler('bla')">ovaj samo ima emit</StLink>

  </div>
</template>

<script>
import StButton from '/~/components/kit/StButton.vue'
import StInput from '/~/components/kit/StInput.vue'
import StLink from '/~/components/kit/StLink.vue'
import { ref } from 'vue'
export default {
  components: {
    StButton,
    StInput,
    StLink
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
