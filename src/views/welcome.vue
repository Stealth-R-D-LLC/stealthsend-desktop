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
      <StInput
        v-model="password"
        label="Password"
        placeholder="Enter new password"
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
      <PaymentCode v-model="paymentCode"></PaymentCode>
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
import PaymentCode from '@/components/elements/PaymentCode';
import { add, format } from 'mathjs';

export default {
  name: 'StWelcome',
  components: {
    PaymentCode,
  },
  setup() {
    const mainStore = useMainStore();

    const recoverWallet = ref(false);
    const mnemonic = ref(
      'caution quantum bright middle grocery cross blouse walk piece copper already inhale'
    );
    const recovered = ref({});
    const password = ref('');
    const paymentCode = ref('');

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

      CryptoService.seed = bytes.toString('hex');
      CryptoService.master = master;
      await CryptoService.storeWalletInDb(password.value);

      await restoreAccounts();

      setTimeout(() => {
        goToDashboard();
        mainStore.STOP_GLOBAL_LOADING();
      }, 3000);
    }

    async function restoreAccounts() {
      mainStore.START_GLOBAL_LOADING();

      let next = await CryptoService.getNextAccountPath();
      const { address, path, pk, wif } = CryptoService.getChildFromRoot(
        next,
        0,
        0
      );

      const hdAccount = await mainStore.rpc('gethdaccount', [pk]);

      // break out of recursion if last account doesn't have transactions
      if (hdAccount.length === 0) {
        return;
      }

      let accUtxo = 0;

      for (let tx of hdAccount) {
        accUtxo = add(accUtxo, tx.account_balance_change);
        accUtxo = format(accUtxo, { precision: 14 });
      }

      let account = {
        pk: pk,
        address: address,
        label: `Account ${next}`,
        utxo: accUtxo,
        isArchived: false,
        asset: 'XST',
        wif: wif,
        path: path,
      };

      await CryptoService.storeAccountInDb(account);

      await restoreAccounts();

      mainStore.STOP_GLOBAL_LOADING();
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
      paymentCode,

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
