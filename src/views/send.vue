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
    <StButton @click="sendOpet">sendOpet</StButton>
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

    async function sendOpet() {
      let addressOutputs = {
        address: 'miM6d6S71YX9JrRgVfKUeFxGpqdd8o3fKD',
        amount: 1.23,
        balance: 1.23,
        blockhash:
          '5c9c980ee4f84c800f38726d72c9ce91a90360dfb92696ee9cc0d9baefaf82e4',
        blocktime: 1616065534,
        confirmations: 2200,
        height: 4481928,
        isspent: 'false',
        txid:
          'f04a6f1eacd9f0d2c0f9997473f50d2282b6af6ec3acbb17a73ba66e8e7c604b',
        vout: 1,
        vtx: 0,
      }

      let TransactionBuilder = bitcoin.TransactionBuilder
      let rawTransaction = new TransactionBuilder(CryptoService.network)
      rawTransaction.addInput(addressOutputs.txid, addressOutputs.vout)
      let recipient = {
        address: 'mhjpLAjaHHWnBQHGVtJHPesZQvAhJGYzDX',
        amount: 0.05 * 1e6,
      }
      let change = {
        address: 'miM6d6S71YX9JrRgVfKUeFxGpqdd8o3fKD',
        amount: 1.17 * 1e6,
      }
      // add the output for recipient
      rawTransaction.addOutput(recipient.address, recipient.amount)

      // add the output for the change, send the change back to yourself.
      // Outputs - inputs = transaction fee, so always double-check your math!
      rawTransaction.addOutput(change.address, change.amount)
      const child = CryptoService.master.derivePath(`m/44'/1'/0'/0/0`)


    const keyPair = bitcoin.ECPair.fromWIF(child.toWIF(), CryptoService.network);
      console.log('wif', child.toWIF());

      rawTransaction.sign(0, keyPair)

      console.dir(rawTransaction)
      const rawTransactionToHex = rawTransaction.build()
      rawTransactionToHex.toHex()
      console.log(rawTransactionToHex.toHex())

      const res = await globalState.rpc('sendrawtransaction', [rawTransactionToHex.toHex()])
      console.log('res', res);

      const txid = await globalState.rpc('gettransaction', [res])
      console.log('txid', txid);


      // pingati stalno dok ne dobijem N confirmacija (1)
      // namjerno pogresnu da vidis kak izgleda
    }

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
      let unspentOutput = {
        address: 'miM6d6S71YX9JrRgVfKUeFxGpqdd8o3fKD',
        amount: 1.07,
        balance: 2.3,
        blockhash:
          '5c9c980ee4f84c800f38726d72c9ce91a90360dfb92696ee9cc0d9baefaf82e4',
        blocktime: 1616065534,
        confirmations: 2200,
        height: 4481928,
        isspent: 'false',
        txid:
          'b8b2f84ec9433f025cd265f2f7fdc1a7568876acd46799b6bb7010c8cea689e4',
        vout: 1,
        vtx: 0,
      }

      // There are three elements involved in a bitcoin transaction:
      // 1 - a transaction input - the bitcoin address FROM which the money was sent
      // 2 - a transaction output - the bitcoin address TO which the money will be sent
      // 3 -  amount

      const psbt = new bitcoin.Psbt(CryptoService.network)
      psbt.setVersion(2) // These are defaults. This line is not needed.

      // TODO: somehow locally get transaction in hex
      // const tx = await globalState.rpc('gettransaction', [unspentOutput.txid])

      // TODO: somehow locally get transaction in hex
      const txidHex = await globalState.rpc('getrawtransaction', [
        unspentOutput.txid,
      ])

      // console.log('1', tx)
      console.log('2', Buffer.from(txidHex, 'hex'))
      console.log('3', txidHex)
      console.log('4', unspentOutput.txid)
      console.log('5', unspentOutput.txid.toString('hex'))
      //       psbt.addInput({
      //   hash: unspentOutput.txid,
      //   index: 0,
      //   nonWitnessUtxo: Buffer.from(txidHex, 'hex'),
      //   // redeemScript: Buffer.from(tx.vin[0].scriptSig.hex, 'hex')
      // })
      // psbt.addInput({
      //   hash: unspentOutput.txid,
      //   index: 1,
      //   nonWitnessUtxo: Buffer.from(txidHex, 'hex'),
      //   // redeemScript: Buffer.from(tx.vin[0].scriptSig.hex, 'hex')
      // })

      psbt.addOutput({
        address: 'mhjpLAjaHHWnBQHGVtJHPesZQvAhJGYzDX', // destination address
        value: 0.05 * 1e6, // value in satoshi
      })

      psbt.addOutput({
        address: 'miM6d6S71YX9JrRgVfKUeFxGpqdd8o3fKD', // change address
        value: 1.17 * 1e6,
      })

      psbt.addInput({
        hash: unspentOutput.txid,
        index: 1,
        nonWitnessUtxo: Buffer.from(txidHex, 'hex'),
        // redeemScript: Buffer.from(tx.vin[0].scriptSig.hex, 'hex')
      })

      // TODO: hardcoded, has to be retrieved from every account
      const child = CryptoService.master.derivePath(`m/44'/1'/0'/0/0`)

      // const pk = child.privateKey
      console.log('pk: ', child)

      const signed = psbt.signInput(0, child)
      psbt.validateSignaturesOfInput(0)
      psbt.finalizeAllInputs()

      console.log('signed', signed)

      const sent = await globalState.rpc('sendrawtransaction', [signed.hex])

      console.log('sent: ', sent)
    }

    return {
      XST_USD,
      sendForm,
      send,
      sendOpet,
    }
  },
}
</script>

<style lang="scss" scoped></style>
