<template>
  <div class="dashbaord-container">
    <transition-group v-if="accounts.length !== 0" name="list" tag="div">
      <card v-for="account in accounts" :key="account" class="list-item" :account="account" @archived="archiveAccount">
        <!-- <template #title>{{ account.label }}</template> -->
        <!-- <template #type>{{ !account.isArchived ? 'Active' : 'Archived' }}</template> -->
        <!-- <template #amount-crypto>{{ account.balance }}</template> -->
      </card>
    </transition-group>
    <p v-else>
      You don't have any accounts in your wallet. 
    </p>
  </div>
</template>

<script>
import globalState from '@/store/global'
import Card from '../components/elements/Card'
import { computed } from 'vue'
import CryptoService from '../services/crypto'

export default {
  name: 'StDahboard',
  components: {
    Card
  },
  setup() {
    console.log('global state', globalState.state);
    const accounts = computed(() => {
      return globalState.state.accounts.filter(el => !el.isArchived)
    })
    
    const archiveAccount = (account) => {
      // account.isArchived = true;
      console.log('archive!', account);
      CryptoService.archiveAccount(account)

    }
    return {
      accounts,
      archiveAccount
    }
  }
}
</script>