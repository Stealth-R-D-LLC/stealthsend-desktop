<template>
  <Side></Side>
  <div class="dashboard-container">
    <TopBar></TopBar>
    Sum of all UTXO: {{ utxo }} XST
    <StTable
      :data="txs"
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
    </StTable>
  </div>
</template>

<script>
import { ref } from 'vue';
// import globalState from '@/store/global';
import TopBar from '@/components/layout/TopBar.vue';
import Side from './components/side';
import CryptoService from '@/services/crypto';
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
      txs.value = hdWallet.txs;
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

    function openTransaction(trx) {
      console.log('trx', trx);
      router.push(`/transaction/${trx.txid}`);
    }

    const archiveAccount = (account) => {
      CryptoService.archiveAccount(account);
    };
    return {
      // openAccountDetails,
      // accounts,
      archiveAccount,

      utxo,
      txs,
      openTransaction,
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
</style>
