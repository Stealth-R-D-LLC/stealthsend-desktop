<template>
  <div class="accounts-container">
    <div class="accounts-container__overflow">
      <div class="accounts-container__content">
        <transition-group v-if="accounts.length !== 0" name="list" tag="div">
          <accounts :accounts="accounts"></accounts>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
// import StCard from '@/components/elements/Card'
import { ref } from 'vue';
import CryptoService from '@/services/crypto';
import accounts from '@/components/partials/accounts.vue';
import emitter from '@/services/emitter';

export default {
  name: 'StArchivedAccounts',
  components: {
    accounts,
  },
  setup() {
    const accounts = ref([]);

    async function scanWallet() {
      const hdWallet = await CryptoService.scanWallet();

      // find first account with 0 balance
      let firstZeroAccount = null;
      for (let acc of hdWallet.accounts) {
        if (acc.utxo === 0) {
          firstZeroAccount = acc;
          break;
        }
      }

      let tmpAccounts = [];
      if (firstZeroAccount) {
        tmpAccounts = [firstZeroAccount];
        for (let acc of hdWallet.accounts) {
          if (acc.address === firstZeroAccount.address) continue;
          tmpAccounts.push(acc);
        }
      } else {
        tmpAccounts = tmpAccounts.concat(hdWallet.accounts);
      }

      accounts.value = tmpAccounts;
    }
    scanWallet();
    function unarchieve(account) {
      CryptoService.unarchiveAccount(account);
    }

    emitter.on('accounts:refresh', () => {
      scanWallet();
    });
    return {
      accounts,
      unarchieve,
    };
  },
};
</script>

<style scoped>
.accounts-container {
  height: calc(100vh - 85px);
}
.accounts-container__overflow {
  height: 100%;
  overflow: auto;
}
.accounts-container__overflow::-webkit-scrollbar {
  width: 4px;
}
.accounts-container__overflow::-webkit-scrollbar-thumb {
  background: var(--grey100);
}
.accounts-container__content {
  margin-top: 140px;
  padding: 24px 28px;
  min-height: calc(100% - 192px);
  background-color: var(--background0);
}
.accounts-container__content > div {
  margin-top: -140px;
}
</style>
