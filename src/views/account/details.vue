<template>
  <div class="account-details-container">
    <h1>Account details</h1>
    <card
      class="list-item"
      :account="{
        label: account.label,
        balance: addressInfo.balance,
        isArchived: account.isArchived
      }"
    ></card>
    <StTooltip
      :tooltip-text="copyPending ? 'Copied to clipboard!' : 'Click to copy'"
    >
      <StCopyToClipboard
        :content="account.address"
        @click="handleCopy"
      ></StCopyToClipboard>
    </StTooltip>

    Address: {{ account.address }}
    <StTable
      :data="trxOutputs"
      :columns="[
        { key: 'txid', title: 'TRX ID' },
        { key: 'amount', title: 'Amount' },
        { key: 'confirmations', title: 'Confirmations' },
        { key: 'balance', title: 'Balance' }
      ]"
    ></StTable>
    <StTable
      :data="trxInputs"
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
import Card from '../../components/elements/Card'

export default {
  name: 'StAccountDetails',
  components: {
    Card,
    StTable
  },
  setup() {
    const account = computed(() => {
      return globalState.state.accountDetails
    })

    const addressInfo = ref({})
    const trxOutputs = ref({})
    const trxInputs = ref({})

    let copyPending = ref(false)
    function handleCopy() {
      copyPending.value = true
      setTimeout(() => {
        copyPending.value = false
      }, 2000)
    }

    if (account.value) {
      globalState
        .rpc('getaddressinfo', [account.value.address])
        .then((res) => {
          addressInfo.value = res
        })
        .catch((err) => {
          return err
        })
      globalState
        .rpc('getaddressinputs', [account.value.address, 1, 10])
        .then((res) => {
          trxInputs.value = res
        })
        .catch((err) => {
          return err
        })
      globalState
        .rpc('getaddressoutputs', [account.value.address])
        .then((res) => {
          trxOutputs.value = res
        })
        .catch((err) => {
          return err
        })
    }
    return {
      account,
      addressInfo,
      trxOutputs,
      copyPending,
      handleCopy,
      trxInputs
    }
  }
}
</script>

<style lang="scss" scoped></style>
