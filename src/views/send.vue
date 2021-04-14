<template>
  <div class="send-container">
    <StMultiselect
      v-model="sendForm.account"
      :options="accounts"
      track-by="_id"
      value-prop="address"
      label="label"
      :object="true"
      placeholder="Select account"
      @select="getUnspentOutputs"
    />
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
    <StButton @click="send">send</StButton>
    <StButton @click="testCoinSelection">testCoinSelection</StButton>
  </div>
</template>

<script>
const XST_USD = 0.17401; // hardcoded obviously
import { reactive, ref } from 'vue';
import CryptoService from '@/services/crypto';
import * as bitcoin from 'bitcoinjs-lib';
import { Buffer } from 'buffer';
import globalState from '@/store/global';
import useCoinControl from '@/composables/useCoinControl';

export default {
  setup() {
    const sendForm = reactive({
      account: '',
      amount: '',
      address: '',
      label: '',
    });

    let unspentOutputs = [];

    const accounts = ref([]);
    async function getAccounts() {
      accounts.value = await CryptoService.getAccounts();
    }
    getAccounts();

    async function getUnspentOutputs() {
      const outputs = await globalState.rpc('getaddressoutputs', [
        sendForm.account.address,
        1,
        100,
      ]);

      unspentOutputs = outputs.filter((el) => el.isspent === 'false');

      console.log('unspent: ', unspentOutputs);
    }

    function testCoinSelection() {
      const dummyOutputs = [
        { amount: 0.1, txid: '101' },
        { amount: 0.3, txid: '102' },
        { amount: 0.5, txid: '103' },
        { amount: 0.85, txid: '104' },
      ];

      useCoinControl(dummyOutputs, sendForm.amount);
    }

    async function send() {
      // const fee = 0.01
      // get it from getaddressoutputs RPC -> param is address from where the funds are sent. we use 1 or more objects
      let addressOutputs = {
        txid:
          '3826b72aa30fea423796d9cf7f500fb362cbabb9ee8de8d12a6bf26a3bda6e1a',
        height: 4859577,
        vtx: 0,
        vout: 0,
        address: 'msETpzsL7jwgEAqPEQ8W1o7NCM2v6qPzNL',
        amount: 0.19,
        balance: 0.29,
        blockhash:
          'ac686c57f8b7fa5f094aad5e74821a36ddf72093b313e18b41b852dc7f88840c',
        confirmations: 16666,
        blocktime: 1618213064,
        isspent: 'false',
      };

      let rawTransaction = new bitcoin.TransactionBuilder(
        CryptoService.network,
        3000000
      );
      // prevoutscript is retrieved when we go to gettransaction RPC with our txid from the addressoutputs
      let prevOutScript = '76a914808317660e320209a79fd06405d184bbc85c74bd88ac';
      rawTransaction.addInput(
        addressOutputs.txid,
        0,
        null,
        Buffer.from(prevOutScript, 'hex')
      );
      // calculated
      let recipient = {
        address: 'mpjUrpqjW18irDo1jgxPg2JLyQLGzK6Agk',
        amount: sendForm.amount * 1e6,
      };
      let change = {
        address: 'msETpzsL7jwgEAqPEQ8W1o7NCM2v6qPzNL',
        amount: 0.13 * 1e6, // account amount - (send amount + fee)
      };
      // rawTransaction.addInput("6893ba14a9c77648788bfefd56229bdbc7f5a212d2f15801eacee305d740636a", 0)

      // add the output for recipient
      rawTransaction.addOutput(recipient.address, recipient.amount);

      // add the output for the change, send the change back to yourself.
      // Outputs - inputs = transaction fee, so always double-check your math!
      rawTransaction.addOutput(change.address, change.amount);
      // careful how to derive the path. depends on the account of the address
      const child = CryptoService.master.derivePath(`m/44'/1'/1'/0/0`);

      const keyPair = bitcoin.ECPair.fromWIF(
        child.toWIF(),
        CryptoService.network
      );
      console.log('wif', child.toWIF());

      rawTransaction.sign(0, keyPair);

      console.dir(rawTransaction);
      const rawTransactionToHex = rawTransaction.build().toHex();
      console.log(rawTransactionToHex);

      const res = await globalState.rpc('sendrawtransaction', [
        rawTransactionToHex,
      ]);
      console.log('res', res);
    }
    return {
      XST_USD,
      sendForm,
      // send,
      send,
      accounts,
      getUnspentOutputs,
      testCoinSelection,
    };
  },
};
</script>

<style lang="scss" scoped></style>
