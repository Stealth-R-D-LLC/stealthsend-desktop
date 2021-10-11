<template>
  <div class="side">
    <StCards :amount="wallet?.utxo" @change="switcherChange"></StCards>
    <div class="side__accounts">
      <Card
        v-for="account in sortedAccounts"
        :key="account.address"
        :account="account"
        :type="step"
        :rates="constraints"
        @click="openAccount(account)"
      >
      </Card>
    </div>
  </div>
</template>

<script>
import StCards from '@/components/elements/StCards.vue';
import Card from '@/components/elements/Card';
import CryptoService from '@/services/crypto';
import { ref, computed } from 'vue';
import { useMainStore } from '@/store';
import router from '@/router';

export default {
  components: {
    StCards,
    Card,
  },
  setup() {
    const mainStore = useMainStore();

    const constraints = computed(() => {
      if (!CryptoService.constraints) return null;
      return CryptoService.constraints;
    });

    const wallet = computed(() => {
      return mainStore.wallet;
    });

    const sortedAccounts = computed(() => {
      if (!wallet.value) return [];
      // sort logic: by favorite position (imported or regular), then regular unfavorited accounts, then imported accounts
      let tmpAccounts = wallet.value.accounts;
      const favourite = tmpAccounts
        .filter((el) => el.isFavourite)
        .sort((a, b) => a.favouritePosition - b.favouritePosition);
      const rest = tmpAccounts
        .filter((el) => !el.isFavourite)
        .sort((a, b) => {
          return a.isImported === b.isImported ? 0 : a.isImported ? 1 : -1;
        });
      return favourite.concat(rest);
    });

    const step = ref(0);
    function switcherChange(value) {
      step.value = value;
    }

    function openAccount(account) {
      mainStore.SET_ACCOUNT_DETAILS(account);
      router.push('/account/details');
    }

    return {
      openAccount,
      switcherChange,
      step,
      constraints,
      sortedAccounts,
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
.side__accounts:hover::-webkit-scrollbar-thumb {
  background: var(--grey100);
}
.side__accounts::-webkit-scrollbar-thumb {
  background: transparent;
}
</style>
