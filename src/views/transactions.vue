<template>
  <div class="transactions-container">
    <div class="controls">
      <StInput
        label="Search"
        v-model="query"
        placeholder="You may enter an Account, Address, Amount or Label"
      ></StInput>
      <date-picker v-model="date" value-type="format" range></date-picker>
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
import isWithinInterval from 'date-fns/isWithinInterval';
import isSameDay from 'date-fns/isSameDay';

export default {
  name: 'Transactions',
  components: {
    TransactionList,
    DatePicker,
  },
  setup() {
    const transactions = ref([]);
    const query = ref('');
    const date = ref([]);

    function findLabelForTx(tx) {
      return CryptoService.txWithLabels[tx];
    }

    async function scanWallet() {
      const hdWallet = await CryptoService.scanWallet();
      transactions.value = hdWallet.txs;
    }

    scanWallet();

    const computedTransactions = computed(() => {
      let filtered = [...transactions.value];
      if (filtered.length === 0) return [];

      if (query.value.length > 0) {
        filtered = filtered.filter((el) => {
          return (
            el.account === query.value ||
            String(el.amount) === query.value ||
            el.txid === query.value ||
            findLabelForTx(el.txid) === query.value
          );
        });
      }

      if (date.value[0] && date.value[1]) {
        if (date.value[0] === date.value[1]) {
          // both dates in range are the same
          filtered = filtered.filter((el) => {
            let target = new Date(el.blocktime * 1000);
            return isSameDay(target, new Date(date.value[0]));
          });
        } else {
          // isWithinInterval doesnt work if the range is on the same date
          filtered = filtered.filter((el) => {
            let target = new Date(el.blocktime * 1000);
            return isWithinInterval(new Date(target), {
              start: new Date(date.value[0]),
              end: new Date(date.value[1]),
            });
          });
        }
      }
      return filtered;
    });

    return {
      transactions,
      query,
      date,
      computedTransactions,
    };
  },
};
</script>

<style scoped></style>
