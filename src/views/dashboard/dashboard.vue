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
export default {
  name: 'StDahboard',
};
</script>
<script setup>
import { ref, computed, onMounted } from 'vue';
import TransactionList from '@/components/partials/TransactionList.vue';
import Chart from '@/views/dashboard/components/chart';
import CryptoService from '@/services/crypto';
import { useMainStore } from '@/store';
import emitter from '@/services/emitter';
import { useRoute } from 'vue-router';

const mainStore = useMainStore();
mainStore.SET_HEADER_STYLE('default');
mainStore.getMarketInfo();
const route = useRoute();

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
  await CryptoService.scanWallet();
  utxo.value = mainStore.wallet.utxo;
  transactions.value = mainStore.wallet.txs;
  accounts.value = mainStore.wallet.accounts;
}

onMounted(async () => {
  mainStore.START_GLOBAL_LOADING();
  await scanWallet();
  mainStore.STOP_GLOBAL_LOADING();
});

emitter.on('transactions:refresh', async () => {
  if (route.name !== 'Dashboard') return; // don't refresh if not on this screen
  utxo.value = mainStore.wallet.utxo;
  transactions.value = mainStore.wallet.txs;
  accounts.value = mainStore.wallet.accounts;
});
</script>

<style scoped>
.dashboard-container {
  padding: 24px 10px 0 12px;
  height: calc(100vh - 116px);
}
.dashboard-container__overflow {
  overflow: auto;
  overflow-x: hidden;
  height: 100%;
}
.dashboard-container__overflow::-webkit-scrollbar {
  width: 4px;
}
.dashboard-container__overflow:hover::-webkit-scrollbar-thumb {
  background: var(--grey100);
}
.dashboard-container__overflow::-webkit-scrollbar-thumb {
  background: transparent;
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
  word-break: break-all;
}
.dashboard-table :deep td:nth-child(4) {
  display: none;
}
.dashboard-table :deep td:nth-child(5) {
  white-space: inherit !important;
  width: 240px;
}
.dashboard-table :deep td:nth-child(5) div {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-all;
}
.dashboard-table :deep td:nth-child(6) {
  width: 129px;
}
.dashboard-table :deep td:nth-child(7) {
  width: 94px;
}
@media only screen and (max-width: 1299px) {
  .dashboard-table :deep td:nth-child(5) {
    display: none;
  }
}
</style>
