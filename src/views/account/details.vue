<template>
  <div class="account-details-container">
    <h1>Account details</h1>
    <pre>
      {{account}}
    </pre>
    <card
      class="list-item"
      :archiveable="false"
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
    <img :src="qrSrc" />
    Address: {{ account.address }}
    template
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
import VanillaQR from 'vanillaqr'
import StCopyToClipboard from '@/components/kit/StClipboard.vue'
import StTooltip from '@/components/kit/StTooltip.vue'

export default {
  name: 'StAccountDetails',
  components: {
    Card,
    StTable,
    StCopyToClipboard,
    StTooltip
  },
  setup() {
    const account = computed(() => {
      return globalState.state.accountDetails
    })

    const addressInfo = ref({})
    const trxOutputs = ref([])
    const trxInputs = ref([])
    const qrSrc = ref('')

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

      var qr = new VanillaQR({
        url: account.value.address
      })
      qrSrc.value = qr.toImage('png').src
    }
    return {
      account,
      addressInfo,
      trxOutputs,
      copyPending,
      handleCopy,
      trxInputs,
      qrSrc
    }
  }
}
</script>

<style lang="scss" scoped></style>
