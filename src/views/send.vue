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
import { Buffer } from 'buffer'

import globalState from '@/store/global'

export default {
  setup() {
    const sendForm = reactive({
      amount: '',
      address: '',
      label: '',
    })

    async function send() {
      console.log('sending...', sendForm)
      // https://gist.githubusercontent.com/StealthSend/d24a338b85b5be26073213c44210a11e/raw/3e4827fc354c45d73755dbae63c7d81e2d50a33b/stealth-mainnet-address-regex.txt
      // get current account
      // validate fields (caution with xst address)
      // currency input for amount
      // check if insufficient funds

      // In bitcoin transactions, you don’t actually spend the balance of the address
      // instead, you spend transactions received by your address
      // also referred to as UTXO
      // To create a transaction, we’ll need such UTXO to use as input to our next transaction
      let unspentOutput =
          {
            address: 'muztTCCEETc22FF8imGoGgG7MqVVaMaXef',
            amount: 0.06,
            balance: 0.1,
            blockhash:
              "f01712d93bfd9a84ca3f07ac5b7325e888a460e1d3934cf8bc8b1fcf920454b0",
            blocktime: 1616065534,
            confirmations: 2200,
            height: 4481928,
            isspent: 'false',
            txid:
              '8c2d88672aa3fad6fbd9a002607c1b4eaa0f397f0ae55026375106a6eaf02bf9',
            vout: 0,
            vtx: 0,
          }

      // There are three elements involved in a bitcoin transaction:
      // 1 - a transaction input - the bitcoin address FROM which the money was sent
      // 2 - a transaction output - the bitcoin address TO which the money will be sent
      // 3 -  amount

      const psbt = new bitcoin.Psbt({ network: CryptoService.network })
      psbt.setVersion(2); // These are defaults. This line is not needed.

      // TODO: somehow locally get transaction in hex
      const tx = await globalState.rpc('gettransaction', [unspentOutput.txid])

      // TODO: somehow locally get transaction in hex
      const txidHex = await globalState.rpc('createrawtransaction', [
        [
          {
            vout: unspentOutput.vout,
            txid: unspentOutput.txid,
          },
        ],
        {
          mhjpLAjaHHWnBQHGVtJHPesZQvAhJGYzDX: 0.05,
        },
      ])


      console.log('1', tx);
      console.log('2', Buffer.from(txidHex, 'hex'));
      console.log('3', txidHex);
      console.log('4', unspentOutput.txid);
      console.log('5', unspentOutput.txid.toString('hex'));
      psbt.addInput({
        hash: unspentOutput.txid,
        index: unspentOutput.vout,
        nonWitnessUtxo: Buffer.from(txidHex, 'hex'),
        // redeemScript: Buffer.from(tx.vin[0].scriptSig.hex, 'hex')
      })

      psbt.addOutput({
        address: 'mhjpLAjaHHWnBQHGVtJHPesZQvAhJGYzDX', // destination address
        value: 0.05 * 1e8, // value in satoshi (0.5 BTC)
      })

      psbt.addOutput({
        address: 'muztTCCEETc22FF8imGoGgG7MqVVaMaXef', // change address
        value: 0.05 * 1e8,
      })

      // TODO: hardcoded, has to be retrieved from every account
      const child = CryptoService.master.derivePath(`m/44'/1'/0'/0/0`)

      // const pk = child.privateKey
      console.log('pk: ', child)

      const signed = psbt.signInput(0, child);
      psbt.validateSignaturesOfInput(0);
      psbt.finalizeAllInputs();

      console.log('signed', signed);

      const sent = await globalState.rpc('sendrawtransaction', [signed.hex])

      console.log('sent: ', sent);
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
