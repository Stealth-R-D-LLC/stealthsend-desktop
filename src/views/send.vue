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
    <p>Network fee: 0.01 XST</p>
    <StButton @click="send">send</StButton>
    <StButton @click="coinSelection">coinSelection</StButton>
  </div>
</template>

<script>
import { reactive, ref } from 'vue';
import CryptoService from '@/services/crypto';
import globalState from '@/store/global';
import useCoinControl from '@/composables/useCoinControl';
import useTransactionBuilder from '@/composables/useTransactionBuilder';

export default {
  setup() {
    const sendForm = reactive({
      account: '',
      amount: '',
      address: 'moZgoSEL3Rvoz6p58DkJsE8NJDBryFtp9i',
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

    function coinSelection() {
      const { best } = useCoinControl(unspentOutputs, sendForm.amount);
      console.log('bestic', best);
      return best;
    }

    function send() {
      const utxo = coinSelection();
      console.log('inputs:', utxo);
      console.log('inputs length', utxo.length);

      if (utxo.length === 0) {
        console.log('ne mogu sastaviti transakciju');
        return;
      }

      useTransactionBuilder(utxo, sendForm);

    }
    return {
      sendForm,
      send,
      accounts,
      getUnspentOutputs,
      coinSelection,
    };
  },
};
</script>

<style lang="scss" scoped></style>
