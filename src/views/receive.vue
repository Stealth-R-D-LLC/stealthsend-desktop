<template>
  <div class="receive-container">
    receive choose account for deposit
    <StMultiselect
      v-model="account"
      :options="accounts"
      track-by="_id"
      value-prop="address"
      label="label"
      :object="true"
      placeholder="Select account"
      @select="changeAccount"
    />
    <div v-if="depositAddress">
      <pre>Address: {{ depositAddress }}</pre>
      <img :src="qrSrc" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import VanillaQR from 'vanillaqr'
import CryptoService from '@/services/crypto'
export default {
  setup() {
    const accounts = ref([])
    const account = ref(null)
    async function getAccounts() {
      accounts.value = await CryptoService.getAccounts()
    }
    getAccounts()

    const depositAddress = ref('')
    const qrSrc = ref('')
    function changeAccount(acc) {
      const { account, change, address } = CryptoService.breakAccountPath(
        acc.path
      )
      CryptoService.accountDiscovery(account)
      const child = CryptoService.getChildFromRoot(account, change, address + 5)
      depositAddress.value = child.address
      var qr = new VanillaQR({
        url: depositAddress.value,
      })
      qrSrc.value = qr.toImage('png').src
    }

    return {
      accounts,
      account,
      depositAddress,
      changeAccount,
      qrSrc,
    }
  },
}
</script>

<style lang="scss" scoped></style>
