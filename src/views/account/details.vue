<template>
  <div class="account-details-container">
      <h1>Account details</h1>
    <pre>
          {{ account }}
      </pre
    >
  </div>
</template>

<script>
import globalState from '@/store/global'
import { computed } from 'vue'

export default {
  name: 'StAccountDetails',
  setup() {
    globalState.rpc('getaddressinfo', ['mtZNzEATaAyQinTEGu3Ye7EAM5fk75R4b7'])
    const account = computed(() => {
      return globalState.state.accountDetails
    })
    return {
      account
    }
  }
}
</script>

<style lang="scss" scoped></style>
