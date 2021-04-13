<template>
  <div class="dashbaord-container">
    Sum of all UTXO: {{ utxo }} XST
    <transition-group v-if="accounts.length !== 0" name="list" tag="div">
      <StCard
        v-for="account in accounts"
        :key="account"
        class="list-item"
        :account="account"
        @click="openAccountDetails"
        @archived="archiveAccount"
      >
        <!-- <template #title>{{ account.label }}</template> -->
        <!-- <template #type>{{ !account.isArchived ? 'Active' : 'Archived' }}</template> -->
        <!-- <template #amount-crypto>{{ account.balance }}</template> -->
      </StCard>
    </transition-group>
    <p v-else>You don't have any accounts in your wallet.</p>
    <StTable
      :data="txs"
      :columns="[
        { key: 'blocktime', title: 'Time' },
        { key: 'account', title: 'Account' },
        { key: 'amount', title: 'Amount' },
      ]"
      @rowClick="openTransaction"
    ></StTable>
  </div>
</template>

<script>
import StTable from '@/components/kit/StTable.vue';
import globalState from '@/store/global';
import Card from '../components/elements/Card';
import { ref } from 'vue';
import CryptoService from '../services/crypto';
import router from '../router';
export default {
  name: 'StDahboard',
  components: {
    Card,
    StTable,
  },
  setup() {
    // console.log('Init crypto service!')
    const accounts = ref([]);
    // async function getAccounts() {
    //   accounts.value = await CryptoService.getAccounts();
    // }
    // getAccounts();

    const utxo = ref(0);
    const txs = ref([]);
    async function scanWallet() {
      const hdWallet = await CryptoService.scanWallet();
      utxo.value = hdWallet.utxo;
      txs.value = hdWallet.txs;
      accounts.value = hdWallet.accounts;
    }
    scanWallet();

    // const accounts = computed(() => {
    //   return globalState.state.accounts.filter((el) => !el.isArchived)
    // })

    const openAccountDetails = (account) => {
      globalState.setAccountDetails(account);
      router.push('/account/details');
    };

    function openTransaction(trx) {
      console.log('trx', trx);
      router.push(`/transaction/${trx.txid}`);
    }

    const archiveAccount = (account) => {
      CryptoService.archiveAccount(account);
    };
    return {
      openAccountDetails,
      accounts,
      archiveAccount,

      utxo,
      txs,
      openTransaction,
    };
  },
};
</script>
