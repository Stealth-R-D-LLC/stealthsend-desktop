<template>
  <div class="accounts-container">
    <transition-group v-if="accounts.length !== 0" name="list" tag="div">
      <accounts :accounts="accounts"></accounts>
    </transition-group>
  </div>
</template>

<script>
// import StCard from '@/components/elements/Card'
import { ref } from 'vue';
import CryptoService from '@/services/crypto';
import accounts from '@/components/partials/accounts.vue';

export default {
  name: 'StArchivedAccounts',
  components: {
    accounts,
  },
  setup() {
    const accounts = ref([]);

    async function scanWallet() {
      const hdWallet = await CryptoService.scanWallet();
      accounts.value = hdWallet.accounts;
    }
    scanWallet();
    function unarchieve(account) {
      CryptoService.unarchiveAccount(account);
    }
    return {
      accounts,
      unarchieve,
    };
  },
};
</script>

<style scoped>
.accounts-container {
  padding: 24px 28px;
}
</style>
