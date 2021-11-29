<template>
  <div class="side">
    <StCards :amount="amount" @change="switcherChange"></StCards>
    <div class="side__accounts">
      <StSkeletonLoader v-if="isLoading" type="cards" />
      <template v-else>
        <Card
          v-for="account in sortedAccounts"
          :key="account.address"
          :account="account"
          :type="step"
          :rates="constraints"
          @click="openAccount(account)"
        >
        </Card>
      </template>
    </div>
  </div>
</template>

<script setup>
import StCards from '@/components/elements/StCards.vue';
import Card from '@/components/elements/Card';
import CryptoService from '@/services/crypto';
import StSkeletonLoader from '@/components/loader/StSkeletonLoader.vue';
import { ref, computed } from 'vue';
import { useMainStore } from '@/store';
import router from '@/router';

const mainStore = useMainStore();

const constraints = computed(() => {
  if (!CryptoService.constraints) return null;
  return CryptoService.constraints;
});

const isLoading = computed(() => {
  return mainStore.globalLoading;
});

const wallet = computed(() => {
  return mainStore.wallet;
});

const amount = computed(() => {
  return mainStore.wallet?.utxo;
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
