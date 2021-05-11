<template>
  <div class="dashboard-container">
    <!-- <TopBar></TopBar> -->
    <Chart></Chart>
    <TransactionList :transactions="transactions"></TransactionList>
  </div>
</template>

<script>
import { ref } from 'vue';
import TransactionList from '@/components/partials/TransactionList.vue';
import Chart from './components/chart.vue';
import CryptoService from '@/services/crypto';
import { useMainStore } from '@/store';

export default {
  name: 'StDahboard',
  components: {
    Chart,
    TransactionList,
  },
  setup() {
    const mainStore = useMainStore();
    console.log('Init crypto service!');
    mainStore.SET_HEADER_STYLE('default');
    mainStore.getMarketInfo();

    const accounts = ref([]);
    const utxo = ref(0);
    const transactions = ref([]);

    async function scanWallet() {
      const hdWallet = await CryptoService.scanWallet();
      console.log('scanned wallet: ', hdWallet);
      utxo.value = hdWallet.utxo;
      transactions.value = hdWallet.txs;
      accounts.value = hdWallet.accounts;
    }

    const archiveAccount = (account) => {
      CryptoService.archiveAccount(account);
    };

    scanWallet();

    return {
      archiveAccount,
      transactions,
      utxo,
    };
  },
};
</script>

<style scoped>
.dashboard-container {
  padding: 24px;
}
</style>
