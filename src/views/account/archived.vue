<template>
  <div class="archived-accounts-container">
        <transition-group v-if="accounts.length !== 0" name="list" tag="div">
      <card v-for="account in accounts" :key="account" class="list-item" :account="account" @unarchived="unarchieve">
      </card>
    </transition-group>
  </div>
</template>

<script>
import globalState from '@/store/global'
import Card from '@/components/elements/Card'
import { computed } from 'vue'
import CryptoService from '@/services/crypto'

export default {
  name: 'StArchivedAccounts',
  components: {
      Card
  },
  setup() {
    const accounts = computed(() => {
      return globalState.state.accounts.filter((el) => el.isArchived)
    })
    function unarchieve(account) {
      console.log('aa');
      CryptoService.unarchiveAccount(account)
    }
    return {
      accounts,
      unarchieve
    }
  }
}
</script>
