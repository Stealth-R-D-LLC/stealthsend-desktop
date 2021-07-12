<template>
  <div class="dashboard-container">
    <div class="dashboard-container__overflow">
      <template v-if="!refreshChart">
        <Chart
          v-if="componentVisibility.chart"
          :class="{ 'full-height': !componentVisibility.txDashboard }"
        ></Chart>
      </template>
      <TransactionList
        v-if="componentVisibility.txDashboard"
        class="dashboard-table"
        :has-table-header="false"
        :transactions="transactions"
      ></TransactionList>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import TransactionList from '@/components/partials/TransactionList.vue';
import Chart from '@/views/dashboard/components/chart';
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

    const refreshChart = computed(() => {
      return mainStore.resetChart;
    });

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
      refreshChart,
      componentVisibility,
      transactions,
      utxo,
    };
  },
};
</script>

<style scoped>
.dashboard-container {
  padding: 24px 10px 24px 12px;
  height: calc(100vh - 145px);
}
.dashboard-container__overflow {
  overflow: auto;
  overflow-x: hidden;
  height: 100%;
}
.dashboard-container__overflow::-webkit-scrollbar {
  width: 4px;
}
.dashboard-container__overflow::-webkit-scrollbar-thumb {
  background: var(--grey100);
}
:deep .st-transaction-list {
  padding: 16px 10px 16px 12px;
  background-color: #ffffff;
}
:deep .st-transaction-list .overflow {
  padding: 0;
  overflow: initial;
  height: initial;
}

.dashboard-table :deep td:nth-child(2) {
  width: 85px;
}
.dashboard-table :deep td:nth-child(3) {
  width: 140px;
}
.dashboard-table :deep td:nth-child(3) div {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.dashboard-table :deep td:nth-child(4),
.dashboard-table :deep td:nth-child(5) {
  display: none;
}
.dashboard-table :deep td:nth-child(6) {
  width: 129px;
}
.dashboard-table :deep td:nth-child(7) {
  width: 94px;
}
</style>
