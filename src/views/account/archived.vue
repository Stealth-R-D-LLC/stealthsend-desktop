<template>
  <div class="archived-accounts-container">
    <transition-group v-if="accounts.length !== 0" name="list" tag="div">
      <StCard
        v-for="account in accounts"
        :key="account"
        class="list-item"
        :account="account"
        @unarchived="unarchieve"
      >
      </StCard>
    </transition-group>
  </div>
</template>

<script>
import { useMainStore } from '@/store';

// import StCard from '@/components/elements/Card'
import { computed } from 'vue';
import CryptoService from '@/services/crypto';

export default {
  name: 'StArchivedAccounts',
  // components: {
  //     Card
  // },
  setup() {
    const mainStore = useMainStore();

    const accounts = computed(() => {
      return mainStore.state.accounts.filter((el) => el.isArchived);
    });
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
