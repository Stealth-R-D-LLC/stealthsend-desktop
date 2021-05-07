<template>
  <StModal
    show-back-button
    :steps="3"
    :current-step="currentStep"
    :visible="isVisible"
    class="receive-modal"
    @close="closeModal"
  >
    <template #header>Receive XST</template>
    <template #body>
      <template v-if="currentStep === 1">
        <div class="form-item account">
          <label for="multiselect">Account</label>
          <StMultiselect
            v-model="account"
            :options="accounts"
            track-by="_id"
            value-prop="address"
            label="label"
            :object="true"
            :can-deselect="false"
            placeholder="Select account"
            @change="changeAccount"
          >
            <template #singlelabel="{ value }">
              <div class="multiselect-single-label">
                <p class="account-label">
                  {{ value.label }}
                </p>
                <p class="account-utxo">
                  {{ value.utxo }}
                </p>
              </div>
            </template>

            <template #option="{ option }">
              {{ option.label }} ({{ option.utxo }})
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
        <StButton color="white" @click="changeStep(2)"
          >Generate QR Code</StButton
        >
      </template>
      <template v-if="currentStep === 2">
        <StButton color="white" @click="changeStep(3)"
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
import { computed, ref, watch } from 'vue';
import VanillaQR from 'vanillaqr';
import CryptoService from '@/services/crypto';

export default {
  name: 'StReceiveModal',
  setup() {
    const mainStore = useMainStore();

    const isVisible = computed(() => {
      return mainStore.modals.receive;
    });

    watch(
      () => isVisible.value,
      () => {
        scanWallet();
      }
    );

    const currentStep = ref(1);

    function closeModal() {
      mainStore.SET_MODAL_VISIBILITY('receive', false);
      // reset all variables
      account.value = null;
      accounts.value = [];
      currentStep.value = 1;
      depositAddress.value = '';
      qrSrc.value = '';
    }

    const accounts = ref([]);
    const account = ref(null);

    async function scanWallet() {
      console.log('majku bozju');
      const hdWallet = await CryptoService.scanWallet();
      accounts.value = hdWallet.accounts;

      // select first option
      // account.value = hdWallet.accounts[0]
      // // manually start finding address for preselected account
      // changeAccount(account.value)
      // console.log('scan?');
    }

    scanWallet();

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

    function changeStep(step) {
      console.log('change step: ', step);
      currentStep.value = step;
    }

    //     onMounted(() => {
    //       console.log('mounted=======');
    //   scanWallet();
    // })

    return {
      isVisible,
      closeModal,

      accounts,
      account,
      depositAddress,
      changeAccount,
      qrSrc,

      currentStep,
      changeStep,

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

.form-item.account {
  position: relative;
  margin-top: 92px;
}

.form-item.account label {
  position: absolute;
  top: -46px;
}
.multiselect-single-label {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  position: absolute;
  top: -24px;
}
.multiselect-single-label .account-utxo {
  margin-top: 6px;
  font-size: 12px;
  font-family: Noto Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 24px;
  /* identical to box height, or 200% */

  letter-spacing: 0.12px;
}
.multiselect-single-label .account-label {
  font-size: 12px;
  font-family: Noto Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 24px;
  height: 48px;
  top: -14px;
  /* identical to box height, or 200% */

  letter-spacing: 0.12px;
}
</style>

<style>
.receive-modal .st-modal__footer {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
