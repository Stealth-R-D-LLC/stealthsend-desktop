<template>
  <div class="add-account-container">
    Add account
    <pre>
    {{ wallet }}
    </pre>
    <StModal
      :visible="isEntropyModalVisible"
      @close="isEntropyModalVisible = false"
    >
      <template #header> Generate master seed </template>
      <template #body>
        You are about to generate your master seed. Please move your mouse for a
        few moments to generate better entropy for the seed generation.
      </template>
      <template #footer>
        <button @click="generateSeed">Generate</button>
      </template>
    </StModal>
    <button @click="isEntropyModalVisible = true">Generate master seed</button>
    <button @click="genAdd">Generate address</button>
    <!-- <button @click="generateMnemonic">generate mnemonic</button>
    <button @click="generateRandomAddress">generate random address</button>
    <button @click="storeWalletInDb">storeWalletInDb</button>
    <button @click="getWalletFromDb">getWalletFromDb</button> -->
    <!-- <button @click="wifToPk">wif to pk</button> -->
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
    let isEntropyModalVisible = ref(false)
    // const isSeedModalVisible = ref(false)
    const wallet = ref({})
    let i = 0;
    function genAdd() {
      // "i" should be the length of generated addresses
      console.log("child addr:", CryptoService.generateChildAddress(i++))
    }
    async function generateSeed() {
      isEntropyModalVisible.value = false
      globalState.startGlobalLoading()
      // isEntropyModalVisible.value = true
      await CryptoService.generateMnemonicAndSeed()
      // console.log('mnemonic: ', CryptoService.mnemonic)
      // console.log('seed: ', CryptoService.seed)
      // console.log('master: ', CryptoService.master)
      wallet.value = await CryptoService.storeWalletInDb()
      wallet.value['mnemonic'] = CryptoService.mnemonic
      // wallet.value = CryptoService.getWalletFromDb()
      // isEntropyModalVisible.value = false
      // isSeedModalVisible.value = true
      globalState.stopGlobalLoading()
    }

    // function storeWalletInDb() {
    //   CryptoService.storeWalletInDb()
    // }
    function wifToPk() {
      CryptoService.WIFtoPK()
    }
    // function getWalletFromDb() {
    //   CryptoService.getWalletFromDb().then((res) => {
    //     console.log('db: ', res)
    //   })
    // }
    // function generateMnemonic(entropy) {
    //   CryptoService.generateMnemonicAndSeed(entropy) // without custom entropy

    //   console.log('mnemonic: ', CryptoService.mnemonic)
    //   console.log('master: ', CryptoService.master)
    //   console.log('is mnemonic valid: ', CryptoService.isMnemonicValid())
    // }
    function generateRandomAddress() {
      console.log('random address: ', CryptoService.generateRandomAddress())
    }
    return {
      generateSeed,
      // storeWalletInDb,
      // getWalletFromDb,
      // generateMnemonic,
      generateRandomAddress,
      wifToPk,

      isEntropyModalVisible,
      // isSeedModalVisible,
      wallet,
      genAdd
    }
  }
}
</script>

<style lang="postcss" scoped></style>
