<template>
  <div class="transactions-container">
    <div class="controls">
      <StInput
        label="Search"
        placeholder="You may enter an Account, Address, Amount or Label"
      ></StInput>
      <date-picker v-model="date" value-type="format"></date-picker>
    </div>
    <TransactionList
      :transactions="computedTransactions"
      has-table-header
    ></TransactionList>
  </div>
</template>

<script>
import TransactionList from '@/components/partials/TransactionList.vue';
import CryptoService from '@/services/crypto';
import { ref, computed } from 'vue';
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import compareAsc from 'date-fns/compareAsc';


export default {
  name: 'Transactions',
  components: {
    TransactionList,
    DatePicker,
  },
  setup() {
    const transactions = ref([]);
    const date = ref(null);
    async function scanWallet() {
      const hdWallet = await CryptoService.scanWallet();
      transactions.value = hdWallet.txs;
    }

    const computedTransactions = computed(() => {
      console.log('aaa');
      compareAsc(
        new Date(),
        new Date(transactions.value[0].txinfo.blocktime * 1000)
      );
      let tx = [...transactions.value];

      return tx;
    });

    scanWallet();
    return {
      transactions,
      date,
      computedTransactions,
    };
  },
};
</script>

<style scoped></style>
