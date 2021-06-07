<template>
  <div class="transactions-container">
    <div class="controls">
      <StFormItem label="Search">
        <StInput
          label="Search"
          v-model="query"
          placeholder="You may enter an Account, Address, Amount or Label"
          ><svg
            width="18"
            height="19"
            viewBox="0 0 18 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.2222 14L17 18"
              stroke="#6B2AF7"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <ellipse
              cx="8.50003"
              cy="9"
              rx="6.61111"
              ry="7"
              stroke="#4E00F6"
              stroke-width="2"
            />
          </svg>
        </StInput>
      </StFormItem>
      <StFormItem label="Range">
        <date-picker
          placeholder="Filter list using date range"
          v-model="date"
          value-type="format"
          range
        ></date-picker>
      </StFormItem>
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
import { ref, computed, onMounted, watchEffect } from 'vue';
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import isWithinInterval from 'date-fns/isWithinInterval';
import isSameDay from 'date-fns/isSameDay';
import { useMainStore } from '@/store';
import { useRoute } from 'vue-router';
import StFormItem from '@/components/elements/StFormItem.vue';

export default {
  name: 'Transactions',
  components: {
    TransactionList,
    DatePicker,
    StFormItem,
  },
  beforeRouteLeave() {
    //const mainStore = useMainStore();
    //mainStore.SET_ACTIVE_TRANSACTION_ADDRESS('')
    // called when the route that renders this component is about to
    // be navigated away from.
    // has access to `this` component instance.
  },
  beforeRouteEnter(to, from, next) {
    const mainStore = useMainStore();

    next((vm) => {
      vm.query = mainStore.activeTransactionAddress;
    });
    // called before the route that renders this component is confirmed.
    // does NOT have access to `this` component instance,
    // because it has not been created yet when this guard is called!
  },
  setup() {
    const transactions = ref([]);
    let query = ref('');
    const date = ref([]);

    const route = useRoute();

    onMounted(() => {
      query.value = '';

      if (route.params.address) {
        query.value = route.params.address;
      }
    });

    watchEffect(() => {
      query.value = route.params.address;
    });

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

      if (query && query.value.length > 0) {
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

<style scoped>
.transactions-container {
  /* height: calc(100vh - 82px); */
}
.controls {
  margin: 0 24px;
  display: grid;
  grid-template-columns: 9fr 3fr;
  grid-gap: 0 47px;
}
.st-form-item {
  margin: 40px 0 10px;
}
</style>
