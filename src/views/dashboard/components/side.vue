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
import { ref, computed, watch } from 'vue';
import { useMainStore } from '@/store';
import router from '@/router';

export default {
  components: {
    StSwitcher,
    Card,
  },
  setup() {
    const mainStore = useMainStore();

    const accounts = ref([]);

    const utxo = ref(0);
    const txs = ref([]);

        watch(
      () => mainStore.modals.receive,
      (newVal) => {
        // if receive any modal is now closed
        if (!newVal) {
          scanWallet();
        }
      }
    );

    watch(
      () => mainStore.modals.send,
      (newVal) => {
        // if send any modal is now closed
        if (!newVal) {
          scanWallet();
        }
      }
    );

    watch(
      () => mainStore.modals.account,
      (newVal) => {
        // if account any modal is now closed
        if (!newVal) {
          scanWallet();
        }
      }
    );

    async function scanWallet() {
      const hdWallet = await CryptoService.scanWallet();
      console.log('scanned wallet: ', hdWallet);
      utxo.value = Number(hdWallet.utxo);
      txs.value = hdWallet.txs;
      accounts.value = hdWallet.accounts;
    }
    scanWallet();

    const constraints = computed(() => {
      if (!CryptoService.constraints) return null;
      return CryptoService.constraints;
    });

    const openAccountDetails = (account) => {
      mainStore.SET_ACCOUNT_DETAILS(account);
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
      constraints,
    };
  },
};
</script>

<style scoped>
.side {
  min-width: 346px;
  width: 346px;
  padding: 32px 24px 0;
  background: var(--background100);
}

.side__accounts {
  overflow: auto;
  height: calc(100vh - 210px);
  margin: 8px 0 0;
  width: calc(100% + 5px);
  padding-right: 10px;
}
.side__accounts::-webkit-scrollbar {
  width: 4px;
}
.side__accounts::-webkit-scrollbar-thumb {
  background: var(--grey100);
}
</style>
