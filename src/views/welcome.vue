<template>
  <div class="welcome">
    <div class="nav">
      <StButton
        @click="
          importWallet = false;
          recoverWallet = true
        "
        >Recover wallet</StButton
      >
      <StButton
        @click="
          importWallet = true;
          recoverWallet = false
        "
        >Import wallet</StButton
      >
      <StButton
        @click="
          importWallet = false;
          recoverWallet = false;
          createWallet = true
        "
        >Create new wallet</StButton
      >
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
    <div v-if="importWallet">
      <h1>Import wallet</h1>
      <StInput v-model="wif" label="WIF" placeholder="Enter your WIF"></StInput>
      <StButton @click="importWalletFromWif">Start Import from WIF</StButton>
      <pre v-if="imported"> imported from wif: {{ imported }}</pre>
    </div>
    <div v-if="createWallet">
      <h1>New wallet</h1>
      <StInput
        v-model="password"
        label="Password"
        type="password"
        placeholder="Create your password"
      ></StInput>
      <StButton :disabled="!password" @click="createNewWallet"
        >Create wallet</StButton
      >
      <pre v-if="created">
        Your stealth wallet has been created. Make sure to write down your mnemonic and keep it in a safe spot. 
        The manemonic stores all the information needed to recover your funds on-chain.
        Mnemonic: {{ created.mnemonic }}
      <StButton @click="goToDashboard"
        >Go to dashboard</StButton
      >
      </pre>
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
      const master = await bip32.fromSeed(bytes).toString('hex') // root
      console.log('1', bytes);
      console.log('2', master);
      recovered.value = {
        seed: bytes.toString('hex'),
        master: master
      }

      CryptoService.seed = bytes.toString('hex')
      CryptoService.master = master

      CryptoService.storeWalletInDb(password.value)
      setTimeout(() => {
        goToDashboard()
        globalState.stopGlobalLoading()
      }, 3000)
    }

    const importWallet = ref(false)
    const wif = ref('KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn')
    const imported = ref({})
    async function importWalletFromWif() {
      imported.value = CryptoService.WIFtoPK(wif.value)
    }

    const createWallet = ref(false)
    const created = ref(false)
    const password = ref('')
    async function createNewWallet() {
      globalState.startGlobalLoading()
      created.value = await CryptoService.generateMnemonicAndSeed()
      await CryptoService.storeWalletInDb(password.value)
      globalState.stopGlobalLoading()
    }

    function goToDashboard() {
      router.push('/dashboard')
    }
    return {
      goToDashboard,

      recoverWallet,
      mnemonic,
      recover,
      recovered,

      importWalletFromWif,
      importWallet,
      wif,
      imported,

      password,
      createWallet,
      created,
      createNewWallet
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
