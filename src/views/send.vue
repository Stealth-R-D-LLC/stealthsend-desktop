<template>
  <div class="send-container">
    <StInput v-model="sendForm.amount" label="Amount" placeholder="0.00 XST" type="text"></StInput>
    <StInput v-model="sendForm.address" label="Address" placeholder="Enter a valid XST address" type="text"></StInput>
    <StInput v-model="sendForm.label" label="Label" placeholder="Enter a label to your transaction" type="text"></StInput>
        <p>Value: {{sendForm.amount * XST_USD}}</p>
        <p>Network fee: 0.01 XST</p>
    <StButton @click="send">Send</StButton>
  </div>
</template>

<script>
const XST_USD = 0.174010 // hardcoded obviously
import {reactive} from 'vue'
export default {
  setup() {
    const sendForm = reactive({
      amount: '',
      address: '',
      label: ''
    })

    function send() {
      console.log('sending...', sendForm);
      // https://gist.githubusercontent.com/StealthSend/d24a338b85b5be26073213c44210a11e/raw/3e4827fc354c45d73755dbae63c7d81e2d50a33b/stealth-mainnet-address-regex.txt
      // get current account
      // validate fields (caution with xst address)
      // currency input for amount
      // check if insufficient funds
    }

    return {
      XST_USD,
      sendForm,
      send
    }
  }
}
</script>

<style lang="scss" scoped></style>
