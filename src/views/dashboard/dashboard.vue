<template>
  <Side></Side>
  <div class="dashboard-container">
    <TopBar></TopBar>
    <template v-for="date in txDates"     :key="date">
      <p class="tx-date">
        <span v-if="['TODAY', 'YESTERDAY'].includes(todayOrYesteday(date).toUpperCase())" class="relative">
          {{ todayOrYesteday(date) }},
        </span>
       {{date}}
      </p>
    <StTable

      :data="txs[date]"
      :columns="[
        { key: 'blocktime', title: 'Time' },
        { key: 'account', title: 'Account' },
        { key: 'amount', title: 'Amount' },
      ]"
      @rowClick="openTransaction"
    >
      <template #amount="{ item }">
        <span :class="[item.amount > 0 ? 'expense' : 'income']">
          {{ item.amount > 0 ? '+' : '-' }} {{ Math.abs(item.amount) }}
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
import isToday from 'date-fns/isToday'
import isYesterday from 'date-fns/isYesterday'


import router from '@/router';
export default {
  name: 'StDahboard',
  components: {
    TopBar,
    Side,
  },
  setup() {
    console.log('Init crypto service!');
    const accounts = ref([]);
    async function getAccounts() {
      accounts.value = await CryptoService.getAccounts();
    }
    getAccounts();

    const utxo = ref(0);
    const txs = ref([]);
    async function scanWallet() {
      const hdWallet = await CryptoService.scanWallet();
      console.log('scanned wallet: ', hdWallet);
      utxo.value = hdWallet.utxo;
      const transactionsTmp = hdWallet.txs.map(el => {
        const obj = Object.assign({}, el)
        obj['blocktimeDate'] = format(fromUnixTime(el['blocktime']), 'd MMM, Y')
        return obj
      }).sort((a, b) => (a.blocktime < b.blocktime) ? 1 : -1);
      txs.value = groupBy(transactionsTmp, 'blocktimeDate')
      accounts.value = hdWallet.accounts;
    }
    scanWallet();

    // const accounts = computed(() => {
    //   return globalState.state.accounts.filter((el) => !el.isArchived)
    // })

    // const openAccountDetails = (account) => {
    //   globalState.setAccountDetails(account);
    //   router.push('/account/details');
    // };

    function formatBlocktime(blocktime) {
      return format(fromUnixTime(blocktime), 'h:m:s a');
    }

    function openTransaction(trx) {
      console.log('trx', trx);
      router.push(`/transaction/${trx.txid}`);
    }

    const archiveAccount = (account) => {
      CryptoService.archiveAccount(account);
    };

    function todayOrYesteday(date) {
      let relative = ''
      if (isToday(new Date(date))) relative = 'Today'
      if (isYesterday(new Date(date))) relative = 'Yesterday'
      return relative
    }

    const txDates = computed(() => {
      if (txs.value.length === 0) return []
      return Object.keys(txs.value)
    })

  // helper for groupig transactions by date
  const groupBy = (collection, iteratee = (x) => x) => {
    const it = typeof iteratee === 'function' ? 
      iteratee : ({ [iteratee]: prop }) => prop;

    const array = Array.isArray(collection) ? collection : Object.values(collection);

    return array.reduce((r, e) => {
      const k = it(e);
      
      r[k] = r[k] || [];
      
      r[k].push(e);
      
      return r;
    }, {});
};

    return {
      // openAccountDetails,
      // accounts,
      archiveAccount,

      utxo,
      txs,
      openTransaction,
      formatBlocktime,
      todayOrYesteday,
      txDates
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
  font-family: Noto Sans;
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
