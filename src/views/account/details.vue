<template>
  <div class="account-details-container">
      <h1>Account details</h1>
    <pre>
          {{ account }}
          {{addressInfo}}
      </pre
    >
  </div>
</template>

<script>
import globalState from '@/store/global'
import { computed, ref } from 'vue'

export default {
  name: 'StAccountDetails',
  setup() {
    const account = computed(() => {
      return globalState.state.accountDetails
    })

    const addressInfo = ref({})
    globalState.rpc('getaddressinfo', ['mtZNzEATaAyQinTEGu3Ye7EAM5fk75R4b7']).then(res => {
      addressInfo.value = res
    }).catch(err => {
      return err
    })
    return {
      account,
      addressInfo
    }
  }
}
</script>

<style lang="scss" scoped></style>
