<template>
  <div class="add-account-container">
    Add account
    <StModal
      :visible="isEntropyModalVisible"
      @close="isEntropyModalVisible = false"
    >
      <template #header> Generate master seed </template>
      <template #body>
        You are about to generate your master seed. Please move your mouse for a
        few moments to generate better entropy for the seed generation.
      </template>
    </StModal>
    <StModal :visible="isSeedModalVisible" @close="isSeedModalVisible = false">
      <template #header> Master seed successfully generated </template>
      <template #body>
        Your master seed and mnemonic
        <pre>
          {{wallet}}
        <!-- {{ CryptoService.seed }}
        {{ CryptoService.mnemonic }} -->
        </pre>
      </template>
    </StModal>
    <button @click="openEntropyModal">Generate master seed</button>
    <button @click="generateMnemonic">generate mnemonic</button>
    <button @click="generateRandomAddress">generate random address</button>
    <button @click="storeWalletInDb">storeWalletInDb</button>
    <button @click="getWalletFromDb">getWalletFromDb</button>
    <button @click="wifToPk">wif to pk</button>
  </div>
</template>

<script>
import CryptoService from '../services/crypto'
import StModal from '@/components/kit/StModal.vue'

import { ref } from 'vue'
export default {
  name: 'StAddAccount',
  components: {
    StModal
  },
  setup() {
    const isEntropyModalVisible = ref(false)
    const isSeedModalVisible = ref(false)
    const wallet = ref({} )
    async function openEntropyModal() {
      isEntropyModalVisible.value = true
      await CryptoService.generateMnemonicAndSeed()
      console.log('mnemonic: ', CryptoService.mnemonic)
      console.log('seed: ', CryptoService.seed)
      console.log('master: ', CryptoService.master)
      wallet.value = await CryptoService.storeWalletInDb()
      // wallet.value = CryptoService.getWalletFromDb()
      console.log('---', wallet.value);
      isEntropyModalVisible.value = false
      isSeedModalVisible.value = true
    }

    function storeWalletInDb() {
      CryptoService.storeWalletInDb()
    }
    function wifToPk() {
      CryptoService.WIFtoPK()
    }
    function getWalletFromDb() {
      CryptoService.getWalletFromDb().then((res) => {
        console.log('db: ', res)
      })
    }
    function generateMnemonic(entropy) {
      CryptoService.generateMnemonicAndSeed(entropy) // without custom entropy

      console.log('mnemonic: ', CryptoService.mnemonic)
      console.log('master: ', CryptoService.master)
      console.log('is mnemonic valid: ', CryptoService.isMnemonicValid())
    }
    function generateRandomAddress() {
      console.log('random address: ', CryptoService.generateRandomAddress())
    }
    return {
      openEntropyModal,
      storeWalletInDb,
      getWalletFromDb,
      generateMnemonic,
      generateRandomAddress,
      wifToPk,

      isEntropyModalVisible,
      isSeedModalVisible,
      wallet
    }
  }
}
</script>

<style lang="postcss" scoped></style>
