<template>
  <div class="welcome">
    <div class="nav">
      <StButton @click="recoverWallet = true">Recover wallet</StButton>
      <StButton>Import wallet</StButton>
      <StButton>Create new wallet</StButton>
    </div>
    <div v-if="recoverWallet">
      <h1>Recover wallet</h1>
      <StInput
        v-model="mnemonic"
        label="Mnemonic"
        placeholder="Enter your mnemonic"
      ></StInput>
      <StButton @click="recover">Start Recover</StButton>
      <pre v-if="recovered"> recovered seed: {{ recovered }}</pre>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import * as bip39 from 'bip39'
import * as bip32 from 'bip32'
import globalState from '@/store/global'
// import db from '../db'
import router from '../router'
import CryptoService from '../services/crypto'

export default {
  name: 'StWelcome',
  setup() {
    const recoverWallet = ref(false)
    const mnemonic = ref(
      'excite attract off sugar mandate only captain chief follow celery elbow melt bone express cat loop mountain nephew'
    )
    const recovered = ref({})

    async function recover() {
      globalState.startGlobalLoading()
      let bytes = await bip39.mnemonicToSeed(mnemonic.value)
      const master = bip32.fromSeed(bytes).toString('hex') // root
      recovered.value = {
        seed: bytes.toString('hex'),
        master: master
      }
      CryptoService.storeWalletInDb(master, '1111111')
      setTimeout(() => {
        router.push('/dashboard')
        globalState.stopGlobalLoading()
      }, 3000)
    }
    return {
      recoverWallet,
      mnemonic,
      recover,
      recovered
    }
  }
}
</script>

<style scoped>
.welcome .nav {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100%;
}
</style>
