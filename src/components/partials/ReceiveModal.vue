<template>
  <StModal :visible="isVisible" @close="closeModal">
    <template #header>Receive XST</template>
    <template #body>
      <StMultiselect
        v-model="account"
        :options="accounts"
        track-by="_id"
        value-prop="address"
        label="label"
        :object="true"
        placeholder="Select account"
        @select="changeAccount"
      />
      <StInput v-model="amount" label="Amount" color="dark" placeholder="Amount"></StInput>
      <StInput
        v-model="depositAddress"
        placeholder="Deposit address"
        label="Address"
        color="dark"
        disabled
      ></StInput>
        <!-- <img :src="qrSrc" /> -->
    </template>
    <template #footer class="flex-center-all">
      <StButton color="white" @click="showModal = false"
        >Generate QR Code</StButton
      >
    </template>
  </StModal>
</template>

<script>
import { useMainStore } from '@/store';
import { computed, ref } from 'vue';
import VanillaQR from 'vanillaqr';
import CryptoService from '@/services/crypto';

export default {
  name: 'StReceiveModal',
  setup() {
    const mainStore = useMainStore();

    const isVisible = computed(() => {
      return mainStore.modals.receive;
    });

    function closeModal() {
      mainStore.SET_MODAL_VISIBILITY('receive', false);
    }

    const accounts = ref([]);
    const account = ref(null);
    async function getAccounts() {
      accounts.value = await CryptoService.getAccounts();
    }
    getAccounts();

    const depositAddress = ref('');
    const qrSrc = ref('');
    async function changeAccount(acc) {
      const { account, change } = CryptoService.breakAccountPath(acc.path);
      const discoveredAddresses = await CryptoService.accountDiscovery(account);
      let nextFreeAddress = CryptoService.nextToUse(
        discoveredAddresses.freeAddresses
      );
      const next = CryptoService.breakAccountPath(nextFreeAddress);

      const child = CryptoService.getChildFromRoot(
        account,
        change,
        next.address
      );
      depositAddress.value = child.address;
      var qr = new VanillaQR({
        url: depositAddress.value,
      });
      qrSrc.value = qr.toImage('png').src;
    }

    return {
      isVisible,
      closeModal,

      accounts,
      account,
      depositAddress,
      changeAccount,
      qrSrc,
    };
  },
};
</script>

<style scoped></style>
