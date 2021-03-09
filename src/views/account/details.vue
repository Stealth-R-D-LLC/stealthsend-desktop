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
