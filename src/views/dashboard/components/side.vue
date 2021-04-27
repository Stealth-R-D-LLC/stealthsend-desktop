<template>
  <div class="side">
    <StSwitcher :amount="utxo" @change="switcherChange"></StSwitcher>
    <div class="side__accounts">
      <Card
        v-for="account in accounts"
        :key="account.address"
        class="list-item"
        :account="account"
        :type="step"
        :rates="constraints"
        @click="openAccountDetails"
        @archived="archiveAccount"
      >
      </Card>
    </div>
  </div>
</template>

<script>
import StSwitcher from '@/components/elements/StSwitcher.vue';
import Card from '@/components/elements/Card';
import CryptoService from '@/services/crypto';
import { ref, computed } from 'vue';
import globalState from '@/store/global';
import router from '@/router';

export default {
  components: {
    StSwitcher,
    Card,
  },
  setup() {
    const accounts = ref([]);
    const utxo = ref(0);
    const txs = ref([]);

    async function scanWallet() {
      const hdWallet = await CryptoService.scanWallet();
      console.log('scanned wallet: ', hdWallet);
      utxo.value = Number(hdWallet.utxo);
      txs.value = hdWallet.txs;
      accounts.value = hdWallet.accounts;
    }
    scanWallet();

        const constraints = computed(() => {
          if (!CryptoService.constraints) return null
          return CryptoService.constraints
        })

    const openAccountDetails = (account) => {
      globalState.setAccountDetails(account);
      router.push('/account/details');
    };
    const archiveAccount = (account) => {
      CryptoService.archiveAccount(account);
    };

    const step = ref(0);
    function switcherChange(value) {
      step.value = value;
    }

    return {
      openAccountDetails,
      accounts,
      archiveAccount,
      switcherChange,
      step,
      utxo,
      constraints
    };
  },
};
</script>

<style scoped>
.side {
  padding: 32px 24px;
  background: var(--background100);
}

.side__accounts {
  margin: 8px 0;
}
</style>
