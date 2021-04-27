<template>
  <div class="add-account-container">
    <p>
      You can create unlimited number of accounts; they are all derived from the
      same Recovery Phrase.
    </p>
    <p>
      Your previously created Recovery Phrase protects all of your accounts.
    </p>
    <StButton @click="isAccountModalVisible = true"
      >Generate new account</StButton
    >
    <StModal
      :visible="isAccountModalVisible"
      @close="isAccountModalVisible = false"
    >
      <template #header> Generate account </template>
      <template #body>
        <template v-if="hasZeroBalance">
          You can only have one account with a zero balance. Please add XST to
          your existing account prior to opening a new one.
        </template>
        <template v-else>
          <StInput
            v-model="accountName"
            label="Accout name"
            placeholder="Account name"
          ></StInput>
        </template>
      </template>
      <template #footer>
        <StButton v-if="!hasZeroBalance" @click="generateAccount"
          >Generate</StButton
        >
      </template>
    </StModal>
  </div>
</template>

<script>
import CryptoService from '@/services/crypto';
import { useMainStore } from '@/store'

import { computed } from 'vue';

import { ref } from 'vue';
export default {
  name: 'StAddAccount',
  components: {},
  setup() {
            const mainStore = useMainStore()

    const hasZeroBalance = computed(() => {
      return false; // TODO: hardcoded
      // return globalState.state.accounts.some((el) => el.balance === 0)
    });

    let isAccountModalVisible = ref(false);
    let account = {};

    const accountName = ref('');

    async function getNextAccountPath() {
      let accounts = await CryptoService.getAccounts();
      let largest = 0;
      for (let acc of accounts) {
        if (parseInt(acc.path) > largest) {
          largest = parseInt(acc.path);
        }
      }
      return largest + 1;
    }

    async function generateAccount() {
      isAccountModalVisible.value = false;
      mainStore.START_GLOBAL_LOADING();

      let next = await getNextAccountPath();
      const { address, path, pk, wif } = CryptoService.getChildFromRoot(
        next,
        0,
        0
      );
      account = {
        pk: pk,
        address: address,
        label: accountName.value,
        utxo: 0,
        isArchived: false,
        asset: 'XST',
        wif: wif,
        path: path,
      };

      CryptoService.storeAccountInDb(account);
      mainStore.STOP_GLOBAL_LOADING();
    }

    return {
      accountName,
      isAccountModalVisible,
      generateAccount,
      hasZeroBalance,
    };
  },
};
</script>

<style lang="postcss" scoped></style>
