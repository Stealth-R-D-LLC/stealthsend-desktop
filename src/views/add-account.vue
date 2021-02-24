<template>
  <div class="add-account-container">
    Add account
    <button @click="henerateEntropyWithMouse">henerateEntropyWithMouse</button>
    <button @click="generateMnemonic">generate mnemonic</button>
    <button @click="generateRandomAddress">generate random address</button>
    <button @click="storeWalletInDb">storeWalletInDb</button>
    <button @click="getWalletFromDb">getWalletFromDb</button>
    <button @click="wifToPk">wif to pk</button>
  </div>
</template>

<script>
import CryptoService from '../services/crypto'

export default {
  name: 'StAddAccount',
  setup() {
    function henerateEntropyWithMouse() {
      const entropy = []
      let captureStart = false

      document.addEventListener('mousemove', function(e) {
        const MAX_LEN = 16 // size of entropy's array
        if (entropy.length >= MAX_LEN) return
        const now = Date.now()
        if (now >= 1 && now % 10 !== 0) return
        if (!captureStart) {
          return setTimeout(() => {
            captureStart = true
          }, 3000) // capturing starts in 3 seconds to set the mouse cursor at random position...
        }
        const iw = window.innerWidth
        const ih = window.innerHeight
        const iwPlusIh = iw + ih
        const px = e.pageX
        const py = e.pageY
        const pxPlusPy = px + py
        const ret = Math.round((pxPlusPy / iwPlusIh) * 255)
        entropy.push(ret)
        // console.log('0-255:', ret)
        if (entropy.length >= MAX_LEN) {
        //   console.log('entropy:', entropy)
          shuffle(entropy)
          console.log('suffledEntropy:', entropy)
          //     const account = WalletUtil.generateAccount({ entropy });
          //     console.log("account:", JSON.stringify(account, null, 2));
        }

        function shuffle(array) {
          let currentIndex = array.length,
            temporaryValue,
            randomIndex
          // While there remain elements to shuffle...
          while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex -= 1
            // And swap it with the current element.
            temporaryValue = array[currentIndex]
            array[currentIndex] = array[randomIndex]
            array[randomIndex] = temporaryValue
          }
          return array
        }
      })
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
      henerateEntropyWithMouse,
      storeWalletInDb,
      getWalletFromDb,
      generateMnemonic,
      generateRandomAddress,
      wifToPk
    }
  }
}
</script>

<style lang="postcss" scoped></style>
