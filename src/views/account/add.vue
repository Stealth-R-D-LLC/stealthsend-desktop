<template>
  <div class="add-account-container">
    Add account
    <pre>
    {{ account }}
    </pre>
    <StModal
      :visible="isAccountModalVisible"
      @close="isAccountModalVisible = false"
    >
      <template #header> Generate account </template>
      <template #body>
        You are about to generate a new account.
        <StInput
          v-model="accountName"
          label="Accout name"
          placeholder="Account name"
        ></StInput>
      </template>
      <template #footer>
        <button @click="generateAccount">Start</button>
      </template>
    </StModal>
    <button @click="isAccountModalVisible = true">Generate new account</button>
  </div>
</template>

<script>
import CryptoService from '@/services/crypto'
import StModal from '@/components/kit/StModal.vue'
import globalState from '@/store/global'

import { ref } from 'vue'
export default {
  name: 'StAddAccount',
  components: {
    StModal
  },
  setup() {
    let isAccountModalVisible = ref(false)
    const account = ref({})

    const accountName = ref('')
    async function generateAccount() {
      isAccountModalVisible.value = false
      globalState.startGlobalLoading()
      const { address, path } = CryptoService.getChildFromRoot(0, 0, 2)
      account.value = {
        address,
        label: accountName.value,
        balance: 0,
        isArchived: false,
        asset: 'XST',
        path: path
      }
      CryptoService.storeAccountInDb(account.value)
      globalState.stopGlobalLoading()
    }

    // function getWalletFromDb() {
    //   CryptoService.getWalletFromDb().then((res) => {
    //     console.log('db: ', res)
    //   })
    // }

    return {
      accountName,
      isAccountModalVisible,
      account,
      generateAccount
    }
  }
}
</script>

<style lang="postcss" scoped></style>
