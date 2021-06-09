<template>
  <div class="dashboard-container">
    <div class="dashboard-container__overflow">
      <!-- <TopBar></TopBar> -->
      <Chart v-if="componentVisibility.chart"></Chart>
      <TransactionList
        v-if="componentVisibility.txDashboard"
        has-table-header
        :transactions="transactions"
      ></TransactionList>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
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
    mainStore.SET_HEADER_STYLE('default');
    mainStore.getMarketInfo();

    const accounts = ref([]);
    const utxo = ref(0);
    const transactions = ref([]);

    const componentVisibility = computed(() => {
      return mainStore.componentVisibility;
    });

    async function scanWallet() {
      const hdWallet = await CryptoService.scanWallet();
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
      componentVisibility,
      transactions,
      utxo,
    };
  },
};
</script>

<style scoped>
.dashboard-container {
  padding: 24px 10px 24px 24px;
  height: calc(100vh - 130px);
}
.dashboard-container__overflow {
  overflow: auto;
  height: 100%;
}
.dashboard-container__overflow::-webkit-scrollbar {
  width: 4px;
}
.dashboard-container__overflow::-webkit-scrollbar-thumb {
  background: var(--grey100);
}
</style>
