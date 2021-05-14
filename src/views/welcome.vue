<template>
  <div class="welcome">
    <div class="nav">
      <StButton
        @click="
          importWallet = false;
          recoverWallet = true;
        "
        >Recover wallet</StButton
      >
      <StButton
        @click="
          importWallet = true;
          recoverWallet = false;
        "
        >Import wallet</StButton
      >
      <StButton
        @click="
          importWallet = false;
          recoverWallet = false;
          createWallet = true;
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
        v-model="account"
        label="Account name"
        placeholder="Enter account name"
      ></StInput>
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
import { ref } from 'vue';
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import { useMainStore } from '@/store';
import router from '../router';
import CryptoService from '../services/crypto';
import * as bitcoin from 'bitcoinjs-lib';


export default {
  name: 'StWelcome',
  setup() {
    const mainStore = useMainStore();

    const recoverWallet = ref(false);
    const mnemonic = ref(
      'core ritual tornado cart chaos rice brave mirror float utility suffer atom'
    );
    const recovered = ref({});
    const password = ref('');

    async function recover() {
      // recover an existing wallet via mnemonic
      // password is asked because we have to lock the seed in the database
      // user is createing a new password in this step
      mainStore.START_GLOBAL_LOADING();
      console.log('mnemonic:::', mnemonic);
      let bytes = await bip39.mnemonicToSeedSync(mnemonic.value);
      const master = await bip32.fromSeed(bytes, CryptoService.network); // root
      recovered.value = {
        seed: bytes.toString('hex'),
        master: master,
      };

      // Get the BIP32 root key in order to derive all addresses or make a lookup on the network
      console.log('-----------------------------------------------------');
      console.log('1) BIP32 Root Key', master.toBase58()); 
      console.log('-----------------------------------------------------');
      console.log(
        '2) Wallet Account Extended Private Key',
        master.derivePath("m/44'/1'/0'").toBase58()
      );
      console.log(
        '3) Wallet Account Extended Public Key',
        master.derivePath("m/44'/1'/0'").neutered().toBase58()
      );
      console.log(
        '4) BIP32 Extended Private Key',
        master.derivePath("m/44'/1'/0'/0").toBase58()
      );
      console.log(
        '5) First account BIP32 Extended Public Key',
        master.derivePath("m/44'/1'/0'/0").neutered().toBase58()
      );
      console.log('-----------------------------------------------------');
      // WIF hoces?
      console.log(
        '6) First account WIF',
        master.derivePath("m/44'/1'/0'/0").toWIF() // Do we need this for import or that under 7) ???
      );
      console.log(
        '7) First account address WIF',
        master.derivePath("m/44'/1'/0'/0/0").toWIF()
      );
      const accountWif = master.derivePath("m/44'/1'/0'/0").toWIF();
      console.log('accountWif', accountWif);
      console.log('Object.keys(bitcoin)', Object.keys(bitcoin));
      console.log('Object.keys(bitcoin.address)', Object.keys(bitcoin.address));
      console.log('Object.keys(bitcoin.payments)', Object.keys(bitcoin.payments));
      console.log('Object.keys(bitcoin.ECPair)', Object.keys(bitcoin.ECPair));
      
      const accountFromWif = bitcoin.ECPair.fromWIF(accountWif, CryptoService.network);
      console.log('accountFromWif', accountFromWif);
      const accountFromWifPrivateKey = accountFromWif.privateKey;
      const accountFromWifPublicKey = accountFromWif.publicKey;
      
      console.log('accountFromWifPrivateKey', accountFromWifPrivateKey.toString('hex'));
      console.log('accountFromWifPublicKey', accountFromWifPublicKey.toString('hex'));

      const hardcodedPassword = '123456'; // hardcoded for now, missing wallet account step prior to importing the mnemonic

      CryptoService.seed = bytes.toString('hex');
      CryptoService.master = master;
      console.log('password.value', hardcodedPassword);

      // await CryptoService.storeWalletInDb(password.value);
      await CryptoService.storeWalletInDb(hardcodedPassword);

      // TODO: Derive all accounts and addresses

      setTimeout(() => {
        goToDashboard();
        mainStore.STOP_GLOBAL_LOADING();
      }, 3000);
    }

    const importWallet = ref(false);
    // 800000000000000000000000000000000000000000000000000000000000000001014671FC3F
    const wif = ref('KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn');
    const imported = ref({});
    async function importWalletFromWif() {
      // wallet is simply imported via wif
      // user should be also prompted here to create a new password
      imported.value = CryptoService.WIFtoPK(wif.value);
    }

    // async function generateAccount() {
    //   console.log('AHA!');
    //   const { address, path, pk, wif } = CryptoService.getChildFromRoot(
    //     1,
    //     0,
    //     0
    //   );
    //   await CryptoService.storeAccountInDb({
    //     pk: pk,
    //     address: address,
    //     label: account.value,
    //     utxo: 0,
    //     isArchived: false,
    //     asset: 'XST',
    //     wif: wif,
    //     path: path,
    //   });
    // }

    const createWallet = ref(false);
    const created = ref(false);
    async function createNewWallet() {
      // new wallet is created
      // therefore, new password can be made
      mainStore.START_GLOBAL_LOADING();
      created.value = await CryptoService.generateMnemonicAndSeed();
      await CryptoService.storeWalletInDb(password.value);
      mainStore.STOP_GLOBAL_LOADING();
    }

    function goToDashboard() {
      router.push('/dashboard');
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
      // account,
      createWallet,
      created,
      createNewWallet,
    };
  },
};
</script>

<style scoped>
.welcome .nav {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100%;
}
</style>
