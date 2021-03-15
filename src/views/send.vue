<template>
  <div class="send-container">
    <StInput
      v-model="sendForm.amount"
      label="Amount"
      placeholder="0.00 XST"
      type="text"
    ></StInput>
    <StInput
      v-model="sendForm.address"
      label="Address"
      placeholder="Enter a valid XST address"
      type="text"
    ></StInput>
    <StInput
      v-model="sendForm.label"
      label="Label"
      placeholder="Enter a label to your transaction"
      type="text"
    ></StInput>
    <p>Value: {{ sendForm.amount * XST_USD }}</p>
    <p>Network fee: 0.01 XST</p>
    <StButton @click="send">Send</StButton>
  </div>
</template>

<script>
const XST_USD = 0.17401 // hardcoded obviously
import { reactive } from 'vue'
import CryptoService from '@/services/crypto'

import * as bitcoin from 'bitcoinjs-lib'
export default {
  setup() {
    const sendForm = reactive({
      amount: '',
      address: '',
      label: '',
    })

    function send() {
      console.log('sending...', sendForm)
      // https://gist.githubusercontent.com/StealthSend/d24a338b85b5be26073213c44210a11e/raw/3e4827fc354c45d73755dbae63c7d81e2d50a33b/stealth-mainnet-address-regex.txt
      // get current account
      // validate fields (caution with xst address)
      // currency input for amount
      // check if insufficient funds

      let getAddressOutputs = {
        result: [
          {
            address: 'muXrZjF8HL58rQMxTUYQvWutPMtqKSfNrq',
            amount: 100,
            balance: 100,
            blockhash:
              '17a1edbb75dc0fbe0d21d8ef6335b4a5aea19d980d68570ea38e6fc6e3912e7f',
            blocktime: 1615471309,
            confirmations: 58771,
            height: 4378925,
            isspent: 'false',
            txid:
              '74168d8a366ba18b2733e33f93b465346095346d72e20a0b0e693e435ba62dec',
            vout: 0,
            vtx: 0,
          },
        ],
        error: null,
        id: 1,
      }

      let addressOutputs = getAddressOutputs.result
      let TransactionBuilder = bitcoin.TransactionBuilder
      let rawTransaction = new TransactionBuilder({ network: CryptoService.network })
      rawTransaction.addInput(addressOutputs[0].txid, addressOutputs[0].vout)
      let recipient = {
        address: 'mrB2LwKaEYick9dDhnUDhGJ8eapuMKpw6y',
        amount: 0.001,
      }
      let change = {
        address: 'n4SBCTpfzYyk7SD7hHr6JDjKN2BBGYWXd5',
        amount: 0.989,
      }
      // add the output for recipient
      rawTransaction.addOutput(recipient.address, recipient.amount)

      // add the output for the change, send the change back to yourself.
      // Outputs - inputs = transaction fee, so always double-check your math!
      rawTransaction.addOutput(change.address, change.amount)

      console.dir(rawTransaction)
    }

    return {
      XST_USD,
      sendForm,
      send,
    }
  },
}
</script>

<style lang="scss" scoped></style>
