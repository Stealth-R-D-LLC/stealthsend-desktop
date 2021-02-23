<template>
  <div class="add-account-container">
    Add account
    <button @click="generateMnemonic">generate mnemonic</button>
    <button @click="generateRandomAddress">generate random address</button>
    <button @click="storePKinDB">store pk in db</button>
    <button @click="getPKfromDB">getPKfromDB</button>
    <button @click="wifToPk">wif to pk</button>
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
    function wifToPk() {
      CryptoService.WIFtoPK()
    }
    function getPKfromDB() {
      CryptoService.getPk().then((res) => {
        console.log('db: ', res)
      })
    }
    function generateMnemonic() {
      CryptoService.generateMnemonicAndSeed()
      console.log('mnemonic: ', CryptoService.mnemonic)
      console.log('master: ', CryptoService.master)
      console.log('is mnemonic valid: ', CryptoService.isMnemonicValid())
    }
    function generateRandomAddress() {
      console.log('random address: ', CryptoService.generateRandomAddress())
    }
    return {
      storePKinDB,
      getPKfromDB,
      generateMnemonic,
      generateRandomAddress,
      wifToPk
    }
  }
}
</script>

<style lang="postcss" scoped></style>
