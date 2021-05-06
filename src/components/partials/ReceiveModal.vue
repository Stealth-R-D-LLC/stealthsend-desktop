<template>
  <StModal
    show-back-button
    :steps="3"
    :current-step="currentStep"
    :visible="isVisible"
    @close="closeModal"
  >
    <template #header>Receive XST</template>
    <template #body>
      <template v-if="currentStep === 1">
        <div class="form-item">
          <StMultiselect
            v-model="account"
            :options="accounts"
            track-by="_id"
            value-prop="address"
            label="label"
            :object="true"
            :can-deselect="false"
            placeholder="Select account"
            @select="changeAccount"
          >
          
    <template #singlelabel="{ value }">
      <div class="multiselect-single-label">
         {{ value.label }} ({{value.utxo}})
      </div>
    </template>

    <template #option="{ option }">
      {{ option.label }} ({{option.utxo}})
    </template>
          </StMultiselect>
        </div>
        <div class="form-item">
          <StInput
            v-model="amount"
            label="Amount"
            color="dark"
            placeholder="Amount"
          ></StInput>
        </div>
        <div class="form-item">
          <StInput
            v-model="depositAddress"
            placeholder="Deposit address"
            label="Address"
            color="dark"
            disabled
          ></StInput>
        </div>
      </template>
      <template v-if="currentStep === 2">
        <StInput
          v-model="depositAddress"
          placeholder="Deposit address"
          label="Address"
          color="dark"
          disabled
        ></StInput>
        <StTooltip
          :tooltip-text="copyPending ? 'Copied to clipboard!' : 'Click to copy'"
        >
          <StClipboard
            :content="depositAddress"
            @click="handleCopy"
          ></StClipboard>
        </StTooltip>
        <img :src="qrSrc" />
      </template>
      <template v-if="currentStep === 3">
        <StInput
          v-model="email"
          label="Email"
          color="dark"
          placeholder="Email"
        ></StInput>
        <p>
          Using this option you will share receive details via default email
          client
        </p>
      </template>
    </template>
    <template #footer class="flex-center-all">
      <template v-if="currentStep === 1">
        <StButton color="white" @click="currentStep = 2"
          >Generate QR Code</StButton
        >
      </template>
      <template v-if="currentStep === 2">
        <StButton color="white" @click="currentStep = 3"
          >Share via Email</StButton
        >
      </template>
      <template v-if="currentStep === 3">
        <StButton color="white" @click="closeModal">Send Email</StButton>
      </template>
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

    const currentStep = ref(1);

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
        noBorder: true,
        colorDark: '#140435',
        colorLight: '#FAF9FC',
        size: 260,
      });
      qrSrc.value = qr.toImage('png').src;
    }

    let copyPending = ref(false);
    function handleCopy() {
      copyPending.value = true;
      setTimeout(() => {
        copyPending.value = false;
      }, 2000);
    }

    return {
      isVisible,
      closeModal,

      accounts,
      account,
      depositAddress,
      changeAccount,
      qrSrc,

      currentStep,

      handleCopy,
      copyPending,
    };
  },
};
</script>

<style scoped>
.form-item {
  margin: 44px 0;
}
</style>
