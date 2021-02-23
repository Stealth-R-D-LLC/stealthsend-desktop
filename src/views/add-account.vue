<template>
  <div class="add-account-container">
    Add account
    <button @click="generate">generate</button>
    <button @click="storePKinDB">store pk in db</button>
    <button @click="getPKfromDB">getPKfromDB</button>
  </div>
</template>

<script>
import CryptoService from '../services/crypto'

export default {
  name: 'StAddAccount',
  setup() {
    function storePKinDB() {
      CryptoService.storePKinDB()
    }
    function getPKfromDB() {
      CryptoService.getPk().then((res) => {
        console.log('db: ', res)
      })
    }
    function generate() {
      CryptoService.generateMnemonicAndSeed()
      console.log('mnemonic: ', CryptoService.mnemonic)
      console.log('is mnemonic valid: ', CryptoService.isMnemonicValid())
      console.log('random address: ', CryptoService.generateRandomAddress())
    }
    return {
      storePKinDB,
      getPKfromDB,
      generate
    }
  }
}
</script>

<style lang="postcss" scoped></style>
