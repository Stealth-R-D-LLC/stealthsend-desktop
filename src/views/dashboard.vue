<template>
  <div class="dashbaord-container">
    <transition-group v-if="accounts.length !== 0" name="list" tag="div">
      <card
        v-for="account in accounts"
        :key="account"
        class="list-item"
        :account="account"
        @click="openAccountDetails"
        @archived="archiveAccount"
      >
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
import router from '../router'
export default {
  name: 'StDahboard',
  components: {
    Card
  },
  setup() {
    // console.log('Init crypto service!')
    // CryptoService.init()

    const accounts = computed(() => {
      return globalState.state.accounts.filter((el) => !el.isArchived)
    })

    const openAccountDetails = (account) => {
      globalState.setAccountDetails(account)
      router.push('/account/details')
    }

    const archiveAccount = (account) => {
      CryptoService.archiveAccount(account)
    }
    return {
      openAccountDetails,
      accounts,
      archiveAccount
    }
  }
}
</script>
