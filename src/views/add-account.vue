<template>
  <div class="add-account-container">
    Add account
    <pre>
    {{ wallet }}
    </pre>
    <StModal
      :visible="isAccountModalVisible"
      @close="isAccountModalVisible = false"
    >
      <template #header> Generate account </template>
      <template #body>
        You are about to generate a new account.
      </template>
      <template #footer>
        <button @click="generateAccount">Start</button>
      </template>
    </StModal>
    <button @click="isAccountModalVisible = true">Generate new account</button>
  </div>
</template>

<script>
import CryptoService from '../services/crypto'
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
    const wallet = ref({})

    async function generateAccount() {
      isAccountModalVisible.value = false
      globalState.startGlobalLoading()
      const {address, pk, sk} = CryptoService.getChildFromRoot(0,0,0)
      wallet.value = {address}
      console.log('address: ', address);
      console.log('pk: ', pk);
      console.log('sk: ', sk);
      globalState.stopGlobalLoading()
    }


    // function getWalletFromDb() {
    //   CryptoService.getWalletFromDb().then((res) => {
    //     console.log('db: ', res)
    //   })
    // }


    return {
      isAccountModalVisible,
      wallet,
      generateAccount
    }
  }
}
</script>

<style lang="postcss" scoped></style>
