<template>
  <Side></Side>
  <div class="dashboard-container">
    <TopBar></TopBar>
    <TransactionList :transactions="transactions"></TransactionList>
  </div>
</template>

<script>
import { ref } from 'vue';
import TopBar from '@/components/layout/TopBar.vue';
import TransactionList from '@/components/partials/TransactionList.vue';
import Side from './components/side';
import CryptoService from '@/services/crypto';

export default {
  name: 'StDahboard',
  components: {
    TopBar,
    Side,
    TransactionList,
  },
  setup() {
    console.log('Init crypto service!');

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
