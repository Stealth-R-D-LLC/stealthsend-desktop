<template>
  <div class="transactions-container">
    <div class="controls">
      <StFormItem label="Search" :filled="query">
        <StInput
          label="Search"
          v-model="query"
          placeholder="You may enter an Account, Address, Amount, Label, or Transaction ID"
        >
          <SvgIcon name="icon-search" />
        </StInput>
      </StFormItem>

      <StFormItem label="Range">
        <date-picker
          :class="{ 'mx-datepicker__filled': date.length }"
          placeholder="Select start and end date"
          v-model="date"
          value-type="format"
          range
          @clear="
            (clear) => {
              date = [];
            }
          "
        ></date-picker>
        <SvgIcon name="icon-calendar" class="calendar" />
      </StFormItem>
    </div>
    <TransactionList
      class="transactions-table"
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
import emitter from '@/services/emitter';
import SvgIcon from '../components/partials/SvgIcon.vue';

export default {
  name: 'Transactions',
  components: {
    TransactionList,
    DatePicker,
    SvgIcon,
  },
  // beforeRouteLeave() {
  //const mainStore = useMainStore();
  //mainStore.SET_ACTIVE_TRANSACTION_ADDRESS('')
  // called when the route that renders this component is about to
  // be navigated away from.
  // has access to `this` component instance.
  // },
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
    const query = ref('');
    const date = ref([]);

    const route = useRoute();
    const mainStore = useMainStore();

    const currentRoute = computed(() => {
      return route.name;
    });

    onMounted(() => {
      query.value = '';

      if (route.params.address) {
        query.value = route.params.address;
      }
    });

    watchEffect(() => {
      if (currentRoute.value === 'TransactionsQuery') {
        setTimeout(() => {
          query.value = route.params.address;
        }, 1);
      } else {
        setTimeout(() => {
          query.value = route.params.address;
        }, 1);
      }
    });

    function findLabelForTx(tx) {
      return mainStore.txWithLabels[tx] || 'No label';
    }

    async function scanWallet() {
      const hdWallet = await CryptoService.scanWallet();
      transactions.value = hdWallet.txs;
    }

    scanWallet();

    const computedTransactions = computed(() => {
      let filtered = [...transactions.value];
      if (filtered.length === 0) return [];
      let q = query?.value?.toLowerCase();
      if (q && q.length > 2) {
        filtered = filtered.filter((el) => {
          return (
            el?.account?.toLowerCase().indexOf(q) > -1 ||
            String(el.amount).indexOf(q) > -1 ||
            el?.txid?.toLowerCase().indexOf(q) > -1 ||
            findLabelForTx(el.txid)?.toLowerCase().indexOf(q) > -1 ||
            el.outputs?.some(
              (el) => el?.address?.toLowerCase().indexOf(q) > -1
            ) ||
            el.txinfo.destinations?.some((el) =>
              el.addresses.some((addr) => addr?.toLowerCase().indexOf(q) > -1)
            )
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

    emitter.on('transactions:refresh', () => {
      scanWallet();
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
@import '../css/components/datepicker.css';

.controls {
  margin: 14px 24px 0;
  display: grid;
  grid-template-columns: 9fr 3fr;
  grid-gap: 0 47px;
}
.st-form-item .st-input {
  margin-bottom: 0px;
}
.calendar {
  pointer-events: none;
  position: absolute;
  top: calc(50% + 7px);
  right: 0;
}
.transactions-table :deep td:nth-child(2) {
  width: 85px;
}
.transactions-table :deep td:nth-child(3) {
  width: 140px;
}
.transactions-table :deep td:nth-child(3) div {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-all;
}
.transactions-table :deep td:nth-child(4),
:deep th:nth-child(4) {
  display: revert;
}
@media only screen and (max-width: 1299px) {
  .transactions-table :deep td:nth-child(4),
  :deep th:nth-child(4) {
    display: none;
  }
}
.transactions-table :deep td:nth-child(4) {
  width: 300px;
}
.transactions-table :deep td:nth-child(5) {
  width: 230px;
  /* overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-all; */
}
.transactions-table :deep td:nth-child(5) div {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-all;
}
.transactions-table :deep td:nth-child(6) {
  width: 121px;
}
.transactions-table :deep td:nth-child(7) {
  width: 121px;
}
.transactions-table :deep td:nth-child(7) .move-left {
  transform: translateX(-100px) !important;
}
:deep .overflow {
  height: calc(100vh - 225px);
}
</style>
