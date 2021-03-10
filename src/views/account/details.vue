<template>
  <div class="account-details-container">
    <h1>Account details</h1>
    <pre>
          {{ account }}
          {{ addressInfo }}
      </pre
    >
    <StTable
      :data="trxOutputs"
      :columns="[
        { key: 'txid', title: 'TRX ID' },
        { key: 'amount', title: 'Amount' },
        { key: 'confirmations', title: 'Confirmations' },
        { key: 'balance', title: 'Balance' }
      ]"
    ></StTable>
  </div>
</template>

<script>
import globalState from '@/store/global'
import StTable from '@/components/kit/StTable.vue'
import { computed, ref } from 'vue'

export default {
  name: 'StAccountDetails',
  components: {
    StTable
  },
  setup() {
    const account = computed(() => {
      return globalState.state.accountDetails
    })

    const addressInfo = ref({})
    const trxOutputs = ref({})
    globalState
      .rpc('getaddressinfo', ['mtZNzEATaAyQinTEGu3Ye7EAM5fk75R4b7'])
      .then((res) => {
        addressInfo.value = res
      })
      .catch((err) => {
        return err
      })
    globalState
      .rpc('getaddressoutputs', ['mtZNzEATaAyQinTEGu3Ye7EAM5fk75R4b7'])
      .then((res) => {
        trxOutputs.value = res
      })
      .catch((err) => {
        return err
      })
    return {
      account,
      addressInfo,
      trxOutputs
    }
  }
}
</script>

<style lang="scss" scoped></style>
