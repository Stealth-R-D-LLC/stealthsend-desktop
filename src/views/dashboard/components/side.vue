<template>
  <div class="side">
    <StCards :amount="utxo" @change="switcherChange"></StCards>
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
import { ref, computed, watch } from 'vue';
import { useMainStore } from '@/store';
import router from '@/router';
import emitter from '@/services/emitter';
import { useRoute } from 'vue-router';

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
    const route = useRoute();

    watch(
      () => mainStore.modals.receive,
      (newVal) => {
        // if receive any modal is now closed
        if (!newVal) {
          console.log('scan wallet  27');

          scanWallet();
        }
      }
    );

    watch(
      () => mainStore.modals.send,
      (newVal) => {
        // if send any modal is now closed
        if (!newVal) {
          console.log('scan wallet  28');

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
      console.log('scan wallet  29');

      const hdWallet = await CryptoService.scanWallet();
      utxo.value = Number(hdWallet.utxo);
      txs.value = hdWallet.txs;
      accounts.value = hdWallet.accounts
        .filter((el) => !el.isArchived)
        .sort((a, b) => {
          return a.isFavourite === b.isFavourite ? 0 : a.isFavourite ? -1 : 1;
        });
    }
    console.log('scan wallet  30');

    scanWallet();

    const constraints = computed(() => {
      if (!CryptoService.constraints) return null;
      return CryptoService.constraints;
    });

    const sortedAccounts = computed(() => {
      // sort logic: by favorite position (imported or regular), then regular unfavorited accounts, then imported accounts
      let tmpAccounts = accounts.value;
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

    emitter.on('accounts:refresh', () => {
      if (route.name !== 'Dashboard') return; // don't refresh if not on this screen
      console.log('scan wallet  31');

      scanWallet();
    });
    emitter.on('transactions:refresh', () => {
      if (route.name !== 'Dashboard') return; // don't refresh if not on this screen
      console.log('scan wallet  32');

      scanWallet();
    });

    return {
      openAccount,
      accounts,
      switcherChange,
      step,
      utxo,
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
