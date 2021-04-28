<template>
  <Side></Side>
  <div class="dashboard-container">
    <TopBar></TopBar>
    <Filters @change="orderTransactions"></Filters>
    <template v-for="date in txDates" :key="date">
      <p class="tx-date">
        <span
          v-if="
            ['TODAY', 'YESTERDAY'].includes(todayOrYesteday(date).toUpperCase())
          "
          class="relative"
        >
          {{ todayOrYesteday(date) }},
        </span>
        {{ date }}
      </p>
      <StTable
        :data="txs[date]"
        :has-header="false"
        :columns="[
          { key: 'blocktime', title: 'Time' },
          { key: 'account', title: 'Account' },
          { key: 'amount', title: 'Amount' },
          { key: 'amountFiat', title: 'Amount (USD)' },
        ]"
        @rowClick="openTransaction"
      >
        <template #amount="{ item }">
          <span :class="[item.amount > 0 ? 'expense' : 'income']">
            {{ item.amount > 0 ? '+' : '-' }}
            {{ formatAmount(Math.abs(item.amount)) }} XST
          </span>
        </template>
        <template #amountFiat="{ item }">
          <span :class="[item.amount > 0 ? 'expense' : 'income']">
            {{ item.amount > 0 ? '+' : '-' }}
            {{ formatAmount(Math.abs(item.amount * XST_USD_RATE), true) }} USD
          </span>
        </template>
        <template #blocktime="{ item }">
          {{ formatBlocktime(item.blocktime) }}
        </template>
      </StTable>
    </template>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import TopBar from '@/components/layout/TopBar.vue';
import Side from './components/side';
import CryptoService from '@/services/crypto';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import isYesterday from 'date-fns/isYesterday';
import useHelpers from '@/composables/useHelpers';
import Filters from '@/components/elements/StFilters';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'

import router from '@/router';
export default {
  name: 'StDahboard',
  components: {
    TopBar,
    Side,
    Filters,
  },
  setup() {
    console.log('Init crypto service!');
    const accounts = ref([]);

    async function getAccounts() {
      accounts.value = await CryptoService.getAccounts();
    }

    const utxo = ref(0);
    const txs = ref([]);
    let transactions = []
    async function scanWallet() {
      const hdWallet = await CryptoService.scanWallet();
      console.log('scanned wallet: ', hdWallet);
      utxo.value = hdWallet.utxo;
      transactions = hdWallet.txs
      accounts.value = hdWallet.accounts;
      orderTransactions()
    }

    function orderTransactions(filter = 'All') {
      // sort transactions by blocktime
      const transactionsTmp = transactions
        .map((el) => {
          const obj = Object.assign({}, el);
          obj['blocktimeDate'] = format(
            fromUnixTime(el['blocktime']),
            'd MMM, Y'
          );
          return obj;
        })
        .sort((a, b) => (a.blocktime < b.blocktime ? 1 : -1));
        // filter transactions based on selected filter
        let filtered = filterTransactions(filter, transactionsTmp)
        // group transactions by date
        txs.value = groupBy(filtered, 'blocktimeDate');
    }

    function filterTransactions(filter, transactions) {
      let filtered = []
      if (filter === '1d') {
        filtered = transactions.filter(el => isToday(new Date(el.blocktimeDate)))
      } else if (filter === '3d') {
        filtered = transactions.filter(el => differenceInCalendarDays( new Date(), fromUnixTime(el.blocktime)) <= 3)
      }

      else {
        filtered = [...transactions]
      }
      return filtered
    }

    function openTransaction(trx) {
      console.log('trx', trx);
      router.push(`/transaction/${trx.txid}`);
    }

    const archiveAccount = (account) => {
      CryptoService.archiveAccount(account);
    };

    function todayOrYesteday(date) {
      let relative = '';
      if (isToday(new Date(date))) relative = 'Today';
      if (isYesterday(new Date(date))) relative = 'Yesterday';
      return relative;
    }

    const txDates = computed(() => {
      if (txs.value.length === 0) return [];
      return Object.keys(txs.value);
    });

    const XST_USD_RATE = computed(() => {
      return CryptoService.constraints.XST_USD || 1;
    });

    getAccounts();
    scanWallet();

    const { formatBlocktime, groupBy, formatAmount } = useHelpers();

    return {
      archiveAccount,
      utxo,
      txs,
      openTransaction,
      todayOrYesteday,
      XST_USD_RATE,
      formatAmount,
      txDates,
      formatBlocktime,
      groupBy,
      filterTransactions,
      orderTransactions
    };
  },
};
</script>

<style scoped>
.income {
  font-weight: bold;
  color: var(--danger);
}
.expense {
  font-weight: bold;
  color: var(--success);
}
.dashboard-container {
  padding: 24px;
}

.dashboard-container .tx-date {
  font-family: var(--secondary-font);
  font-style: normal;
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.12px;
  color: var(--text);
  margin: 22px 0;
}

.dashboard-container .tx-date .relative {
  font-weight: bold;
}
</style>
