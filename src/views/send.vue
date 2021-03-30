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

    /*
console.log('/// TRANSACTION BUILDER ///')
console.log('Trying to create 1-to-1 Raw Transaction');
let trx = new bitcoin.TransactionBuilder(network, 3000000);
let trxId = '65bb364cd24d42d147a0c0c15dd4ae66e4931bcd5de313f120ce6a4631e3d393';
let vOut = 1;
let sequence = 4294967295;
let prevOutScript = '76a9144e1b865eed74ce6cfc61c02a9aa18b5a4047867988ac';
let fromAddressPrivateKeyWIF = 'cPyweJi2XUL14bj7prYPDM1jrJZZQRvsGkBKuzjtd6ksDpfutukt';
let toAddress = 'mhdA5F46Npznb6sXtLxMvD59Raj3jqfM6w';
let toAmount = 0.03 * 1e6;
let changeAddress = 'mndwyUkxE69QPVavKeK56PotK9GKoki2aX';
let changeAmount = 1 * 1e6;
trx.setVersion(2);
trx.addInput(trxId, vOut, sequence, Buffer.from(prevOutScript, 'hex'));
trx.addOutput(toAddress, toAmount);
trx.addOutput(changeAddress, changeAmount);
trx.sign(0, bitcoin.ECPair.fromWIF(fromAddressPrivateKeyWIF, network))
console.dir(trx.build().toHex());
    */

    async function sendOpet() {
      let addressOutputs = {
        address: 'mmDr34PKbdure6eVUnjqTu4EAo3WjWvZ9p',
        amount: 0.19,
        balance: 0.25,
        blockhash:
          "45d63fdfe7ff0c273b659e8f397beecc989ddcb45c5f3cbfac469888383ddcd7",
        blocktime: 1617088334,
        confirmations: 2200,
        height: 4481928,
        isspent: 'false',
        txid:
          'eeca9988b5e0255e1185355ceaf44fea71bf70aec2cf4a7f212ee04ff6fefafa',
        vout: 0,
        vtx: 0,
      }

      let TransactionBuilder = bitcoin.TransactionBuilder
      let rawTransaction = new TransactionBuilder(CryptoService.network)
      let prevOutScript = '76a9143e9475809082fff3f4f8bda7d2fb8873d5876f0f88ac'
      rawTransaction.addInput(
        addressOutputs.txid,
        0,
        null,
        Buffer.from(prevOutScript, 'hex')
      )
      let recipient = {
        address: 'mhjpLAjaHHWnBQHGVtJHPesZQvAhJGYzDX',
        amount: 0.05 * 1e6,
      }
      let change = {
        address: 'mmDr34PKbdure6eVUnjqTu4EAo3WjWvZ9p',
        amount: 0.1 * 1e6,
      }
      // rawTransaction.addInput("6893ba14a9c77648788bfefd56229bdbc7f5a212d2f15801eacee305d740636a", 0)

      // add the output for recipient
      rawTransaction.addOutput(recipient.address, recipient.amount)

      // add the output for the change, send the change back to yourself.
      // Outputs - inputs = transaction fee, so always double-check your math!
      rawTransaction.addOutput(change.address, change.amount)
      const child = CryptoService.master.derivePath(`m/44'/1'/0'/0/0`)

      const keyPair = bitcoin.ECPair.fromWIF(
        child.toWIF(),
        CryptoService.network
      )
      // console.log('wif', child.toWIF());

      rawTransaction.sign(0, keyPair)

      console.dir(rawTransaction)
      const rawTransactionToHex = rawTransaction.build().toHex()
      console.log(rawTransactionToHex)

      const res = await globalState.rpc('sendrawtransaction', [
        rawTransactionToHex,
      ])
      console.log('res', res)

      // const txid = await globalState.rpc('gettransaction', [res])
      // console.log('txid', txid);

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
