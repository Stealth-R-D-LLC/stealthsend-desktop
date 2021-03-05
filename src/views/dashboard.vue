<template>
  <div class="dashbaord-container">
    <transition-group v-if="accounts.length !== 0" name="list" tag="div">
      <card v-for="account in accounts" :key="account.title" class="list-item">
        <template #title>{{ account.title }}</template>
        <template #type>{{ account.type }}</template>
        <template #amount-crypto>{{ account.crypto }}</template>
        <template #amount-fiat>{{ account.fiat }}</template>
      </card>
    </transition-group>
    <p v-else>
      You don't have any accounts in your wallet. 
    </p>
  </div>
</template>

<script>
import Card from '../components/elements/Card'
import { ref } from 'vue'
export default {
  name: 'StDahboard',
  components: {
    Card
  },
  setup() {
    // CryptoService.init()
    const accounts = ref([])
    // const accounts = ref([
    //   {
    //     title: 'Main account',
    //     type: 'XST / USD',
    //     crypto: '3,321,321.00',
    //     fiat: '$123,456.00'
    //   },
    //   {
    //     title: 'Main account 2',
    //     type: 'XST / USD',
    //     crypto: '3,321,321.00',
    //     fiat: '$123,456.00'
    //   },
    //   {
    //     title: 'Main account 3',
    //     type: 'XST / USD',
    //     crypto: '3,321,321.00',
    //     fiat: '$123,456.00'
    //   }
    // ])
    return {
      accounts
    }
  }
}
</script>