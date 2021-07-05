<template>
  <div class="side">
    <StCards :amount="utxo" @change="switcherChange"></StCards>
    <div class="side__accounts">
      <Card
        v-for="account in accounts"
        :key="account.address"
        :account="account"
        :type="step"
        :rates="constraints"
      >
      </Card>
    </div>
  </div>
</template>

<script>
import StCards from '@/components/elements/StCards.vue';
import Card from '@/components/elements/Card';
import CryptoService from '@/services/crypto';
import { ref, computed, watch } from 'vue';
import { useMainStore } from '@/store';

export default {
  components: {
    StCards,
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
      accounts.value = hdWallet.accounts.filter((el) => !el.isArchived);
    }
    scanWallet();

    const constraints = computed(() => {
      if (!CryptoService.constraints) return null;
      return CryptoService.constraints;
    });

    const step = ref(0);
    function switcherChange(value) {
      step.value = value
    }

    return {
      accounts,
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
  box-sizing: border-box;
  min-width: 392px;
  width: 392px;
  padding: 36px 24px 0;
  background: var(--background100);
}

.side__accounts {
  overflow: auto;
  height: calc(100vh - 222px);
  margin: 20px 0 0;
  width: calc(100% + 4px);
  padding-right: 10px;
}
.side__accounts::-webkit-scrollbar {
  width: 4px;
}
.side__accounts::-webkit-scrollbar-thumb {
  background: var(--grey100);
}
</style>
