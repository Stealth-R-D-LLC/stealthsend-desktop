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
import emitter from '@/services/emitter';

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
      console.log('----', hdWallet.txs);
      transactions.value.push({
        outputs: [
          {
            address: 'SKwMtq2wVjEAhW7i8n7nbZUBfUy1vNPHsD',
            vout: 0,
            amount: 0.11,
            isspent: 'true',
            next_txid:
              'b5c87f9420726e9e9ec7c5b4fc8c7782b0e2f8deb874698ed8d53757d5458530',
            next_vin: 0,
          },
        ],
        output: [
          {
            addresses: ['SKwMtq2wVjEAhW7i8n7nbZUBfUy1vNPHsD'],
            reqSigs: 1,
            amount: 0.11,
            type: 'pubkeyhash',
          },
        ],
        amount: 10000000.9911,
        txid: '968c971d36b8aa3953953ed72351944921e84363a41c4313c7a21f4c0a081ee0',
        blocktime: 1623930392,
        account: 'asdfasdfasd 2lalaasdfasdfasdfasdfl',
        xpub: 'xpub6DS78ojF8u7hfhSn8L3uqSEJ5rANRkhNGPvGNArEDJ55bvXs1ruXTGBgsnU8HGqoGp3x8FyuVxcgZmgHeSoVQ6V214Z4FCKVgg2oVdBBHhf',
        txinfo: {
          blockhash:
            '9837fc212bca0e10c7ffb5cf1e5c46ca47d6f3f5a57e26d30e12b4c7a0464adf',
          blocktime: 1623930392,
          height: 3951955,
          confirmations: 981675,
          vtx: 0,
          sources: [
            {
              addresses: ['S7eadUrmfuu1cSYdJYDKtNdF2mf8hDwuNC'],
              reqSigs: 1,
              amount: 0.05,
              type: 'pubkeyhash',
            },
            {
              addresses: ['S7eadUrmfuu1cSYdJYDKtNdF2mf8hDwuNC'],
              reqSigs: 1,
              amount: 0.05,
              type: 'pubkeyhash',
            },
            {
              addresses: ['SKsG5ZQKPnFvwajdaS46zuYiaDeefE76o3'],
              reqSigs: 1,
              amount: 0.86,
              type: 'pubkeyhash',
            },
          ],
          destinations: [
            {
              addresses: ['SKwMtq2wVjEAhW7i8n7nbZUBfUy1vNPHsD'],
              reqSigs: 1,
              amount: 0.11,
              type: 'pubkeyhash',
            },
            {
              addresses: ['RySJWTot3gTELDhaZP3RYGkjBnpiwH4N8t'],
              reqSigs: 1,
              amount: 0.84,
              type: 'pubkeyhash',
            },
          ],
        },
      });
      accounts.value = hdWallet.accounts;
    }

    const archiveAccount = (account) => {
      CryptoService.archiveAccount(account);
    };

    scanWallet();

    emitter.on('transactions:refresh', () => {
      scanWallet();
    });

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
