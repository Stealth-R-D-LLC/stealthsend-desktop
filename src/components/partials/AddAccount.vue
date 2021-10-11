<template>
  <StModal
    light
    :steps="activeStep === 'add-account' ? 0 : steps"
    :current-step="currentStep"
    :visible="isVisible"
    :has-click-outside="true"
    @close="closeModal"
    class="account-modal"
    :class="{ 'account-modal__hide-header': currentStep > 2 }"
  >
    <template #header>Account Wizard</template>
    <template #body>
      <div class="account-tabs" v-if="currentStep < 3">
        <a
          :class="{ active: activeStep === 'add-account' }"
          @click="changeStep('add-account')"
          >Add New Account</a
        >
        <a
          :class="{ active: activeStep === 'import-account' }"
          @click="changeStep('import-account')"
          >Import Account</a
        >
      </div>
      <div class="add-account" v-if="activeStep === 'add-account'">
        <div class="add-account__content">
          <div class="desc" :class="{ 'desc-red': isLastAccountEmpty }">
            <p v-if="isLastAccountEmpty">
              You can only have one account with a zero balance. Please add XST
              to your previous account prior to opening a new one.
            </p>
            <p v-else>
              You can create an unlimited number of accounts; they are all
              derived from the same Recovery Phrase. Your previously created
              Recovery Phrase protects all of your accounts.
            </p>
          </div>
          <StFormItem
            :disabled="isLastAccountEmpty"
            label="Account Name"
            :class="{
              'st-form-item__error': form.accountName.$value.length > 50,
            }"
            :filled="form.accountName.$value"
            :error-message="form.accountName.$errors"
          >
            <StInput
              v-model="form.accountName.$value"
              placeholder="Enter Account Name"
              :disabled="isLastAccountEmpty"
            ></StInput>
            <template v-if="form.accountName.$value.length > 50" #description>
              <span class="error">Name too long</span>
            </template>
          </StFormItem>
        </div>
        <div class="add-account__actions">
          <div class="buttons">
            <StButton type="type-b" @click="closeModal">Cancel</StButton>
            <StButton
              @click="generateAccount"
              :disabled="!accountName.length || isLastAccountEmpty"
              >Add</StButton
            >
          </div>
        </div>
      </div>
      <div v-if="activeStep === 'import-account'">
        <template v-if="currentStep === 1">
          <div class="desc">
            <p>
              If you wish to import an existing XST address, you will need to
              use the corresponding Private Key.
            </p>
            <p>
              Note that imported accounts are not included in the accounts
              accessed through your Recovery Phrase. You will need to use their
              associated Private Key only.
            </p>
          </div>
          <StCheckbox class="custom-checkbox" v-model="understand"
            >I understand</StCheckbox
          >
          <div class="button">
            <StButton @click="nextStep" :disabled="!understand"
              >Proceed</StButton
            >
          </div>
        </template>
        <template v-if="currentStep === 2">
          <StModal
            light
            :visible="isScanning"
            @close="isScanning = false"
            class="scan-modal"
          >
            <template #header>Scan XST Address</template>
            <template #body>
              <div class="no-camera" v-show="!cameraAllowed">
                <SvgIcon name="icon-no-camera" />
                <h6>There is no connected camera</h6>
              </div>
              <div v-show="isCameraLoading" class="loading-gif">
                <img src="../../../static/xstloader.gif" alt="Test gif" />
              </div>
              <div v-show="!isCameraLoading">
                <div v-show="cameraAllowed" class="stream">
                  <qr-stream @decode="onDecode" class="mb">
                    <div class="frame" />
                  </qr-stream>
                </div>
              </div>
            </template>
          </StModal>
          <StFormItem
            label="Account Name"
            :filled="form.accountName.$value"
            :class="{
              'st-form-item__error': form.accountName.$value.length > 50,
            }"
            :error-message="form.accountName.$errors"
          >
            <StInput
              v-model="form.accountName.$value"
              placeholder="Enter Account Name"
            />
            <template v-if="form.accountName.$value.length > 50" #description>
              <span class="error">Name too long</span>
            </template>
          </StFormItem>
          <StFormItem
            class="st-form-item__key"
            label="Private Key"
            :filled="form.privateKey.$value"
            :error-message="form.privateKey.$errors"
          >
            <StInput
              v-model="form.privateKey.$value"
              placeholder="Scan or paste your private key"
            >
              <SvgIcon name="icon-qr-code" @click="startScanner" />
            </StInput>
          </StFormItem>
          <div class="button button-import">
            <StButton @click="accountImport">Import</StButton>
          </div>
        </template>
        <template v-if="currentStep === 3">
          <h5>Importing Private Key</h5>
          <p class="medium">Please be patient and don’t exit the application</p>
          <div class="progress">
            <!-- <SvgIcon name="icon-loader" class="progress-animated" /> -->
            <CircleProgress></CircleProgress>
            <div class="overlay-progress"></div>
          </div>
        </template>
        <template v-if="currentStep === 4">
          <h5>Success</h5>
          <p class="medium">Your account has been successfully imported.</p>
          <p class="medium">You may now access your funds.</p>
          <div class="progress no-background">
            <SvgIcon name="icon-loader-success" />
          </div>
          <StButton type="type-a" @click="openAccountDetails"
            >View Account</StButton
          >
        </template>
      </div>
    </template>
  </StModal>
</template>

<script>
import { useMainStore } from '@/store';
import { computed, ref, watch } from 'vue';
import CryptoService from '@/services/crypto';
import { useValidation, ValidationError } from 'vue3-form-validation';
import CircleProgress from '../partials/CircleProgress.vue';
import emitter from '@/services/emitter';
import { QrStream } from 'vue3-qr-reader';
import router from '@/router';
import SvgIcon from '../partials/SvgIcon.vue';
import { useRoute } from 'vue-router';

export default {
  name: 'StAccountModal',
  components: {
    QrStream,
    SvgIcon,
    CircleProgress,
  },
  setup() {
    // VARIABLES
    const mainStore = useMainStore();
    const currentStep = ref(1);
    const activeStep = ref('add-account');
    const accountName = ref('');
    const understand = ref(false);
    const privateKey = ref('');
    const copyPending = ref(false);
    const isScanning = ref(false);
    const QRData = ref(null);
    const cameraAllowed = ref(false);
    const isCameraLoading = ref(false);

    const route = useRoute();

    const {
      form,
      errors,
      // add,
      // submitting,
      validateFields,
      resetFields,
    } = useValidation({
      accountName: {
        $value: accountName,
        $rules: [
          (accountName) => {
            if (accountName.length <= 0) {
              return 'Name is required';
            }
            if (existingAccounts.some((el) => el.label === accountName)) {
              return 'Account name already exists.';
            }
            if (accountName.length > 50) {
              return 'Name too long';
            }
          },
        ],
      },
      privateKey: {
        $value: privateKey,
        $rules: [
          (privateKey) => {
            if (
              existingAccounts.some((el) => {
                if (!el.isImported) {
                  return false;
                }
                const decryptedWIF = CryptoService.AESDecrypt(
                  el.wif,
                  wallet.password
                );
                return decryptedWIF && decryptedWIF === privateKey;
              })
            ) {
              return 'Account already imported.';
            }
            if (activeStep.value === 'import-account') {
              if (!CryptoService.isWIFValid(privateKey)) {
                return 'Invalid private key';
              }
            }
          },
        ],
      },
    });

    const isVisible = computed(() => {
      return mainStore.modals.account;
    });
    const steps = computed(() => {
      let steps = null;
      if (activeStep.value === 'add-account') {
        steps = 1;
      } else if (activeStep.value === 'import-account') {
        steps = 3;
      }
      return steps;
    });

    let existingAccounts = [];
    let wallet = {};
    let isLastAccountEmpty = ref(false);
    watch(
      () => isVisible.value,
      async () => {
        if (isVisible.value) {
          console.log('scan wallet 10');

          await CryptoService.scanWallet();
          existingAccounts = mainStore.wallet.accounts;
          wallet = await CryptoService.getWalletFromDb();
          isLastAccountEmpty.value = mainStore.wallet.accounts.some(
            (el) => el.utxo === 0
          );
        }
      }
    );

    // METHODS
    function closeModal() {
      mainStore.SET_MODAL_VISIBILITY('account', false);
      activeStep.value === 'add-account';
      currentStep.value = 1;
      accountName.value = '';
      understand.value = false;
      privateKey.value = '';
      resetFields();
    }
    function changeStep(name) {
      currentStep.value = 1;
      accountName.value = '';
      understand.value = false;
      privateKey.value = '';
      activeStep.value = name;
    }
    function nextStep() {
      if (understand.value) {
        currentStep.value += 1;
      }
    }
    async function accountImport() {
      if (currentStep.value === 2) {
        try {
          await validateFields();
          nextStep();
          await CryptoService.importAccount(
            accountName.value,
            privateKey.value
          );

          console.log('scan wallet 11');
          await CryptoService.scanWallet();
          let account = mainStore.wallet.accounts.find(
            (obj) => obj.label === accountName.value
          );
          mainStore.SET_ACCOUNT_DETAILS(account);
          nextStep();
        } catch (e) {
          if (e instanceof ValidationError) {
            console.log(e);
          }
        }
      }
    }

    emitter.on('accounts-refresh-done', () => {
      console.log('acc ref done');
      nextStep();
      emitter.off('accounts-refresh-done');
    });

    async function generateAccount() {
      let account = {};

      await validateFields();

      let next = await CryptoService.getNextAccountPath();

      // get current last existing account
      const { xpub: lastAccountPk } = CryptoService.getChildFromRoot(
        next - 1 >= 0 ? next - 1 : 0,
        0,
        0
      );

      await mainStore.rpc('gethdaccount', [lastAccountPk]);

      const { address, path, xpub, wif } = CryptoService.getChildFromRoot(
        next,
        0,
        0
      );
      account = {
        xpub: xpub,
        address: address,
        label: accountName.value,
        utxo: 0,
        isArchived: false,
        isFavourite: false,
        isImported: false,
        asset: 'XST',
        wif: wif,
        path: path,
      };

      await CryptoService.storeAccountInDb(account);
      await CryptoService.scanWallet();
      closeModal();
      accountName.value = '';
    }

    function startScanner() {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        let camera = devices.filter((obj) => obj.kind === 'videoinput');
        if (camera[0].kind === 'videoinput' && camera[0].label) {
          cameraAllowed.value = true;
          isCameraLoading.value = true;
          setTimeout(() => (isCameraLoading.value = false), 2000);
        } else {
          cameraAllowed.value = false;
        }
      });
      QRData.value = null;
      isScanning.value = true;
      form.privateKey.$value = '';
    }

    function onDecode(data) {
      QRData.value = data;
      if (QRData.value) {
        isScanning.value = false;
        let privateKey = QRData.value.replace(/[^a-z0-9]/gi, '');
        form.privateKey.$value = privateKey;
      }
    }

    async function openAccountDetails() {
      if (route.name !== 'AccountDetails') {
        router.push('/account/details');
      }
      closeModal();
    }

    return {
      // VARIABLES
      currentStep,
      activeStep,
      accountName,
      understand,
      privateKey,
      copyPending,
      isScanning,
      cameraAllowed,
      isCameraLoading,

      // COMPUTED
      isVisible,
      steps,

      // METHODS
      closeModal,
      changeStep,
      nextStep,
      generateAccount,
      accountImport,
      startScanner,
      onDecode,
      openAccountDetails,

      form,
      errors,
      isLastAccountEmpty,
    };
  },
};
</script>

<style scoped>
:deep .st-modal-container {
  width: 480px;
  height: 520px;
  min-height: 520px;
  box-sizing: border-box;
}
:deep .st-modal__body {
  margin-top: 36px;
  margin-bottom: 0;
  height: 100%;
}
.account-modal__hide-header :deep .st-modal__header {
  display: none;
}
.account-modal__hide-header :deep .st-modal__body {
  margin-top: 0;
  text-align: center;
}
.account-modal :deep .st-modal__footer {
  display: none;
}
.account-modal__hide-header h5 {
  margin-bottom: 36px;
}
.account-tabs {
  margin-bottom: 36px;
  display: flex;
  align-items: center;
}
.account-tabs a {
  position: relative;
  cursor: pointer;
  min-width: 160px;
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.32px;
  color: var(--grey900);
  padding-bottom: 9px;
  font-family: var(--secondary-font);
  border-bottom: 3px solid var(--grey200);
  transition: 0.3s;
}
.account-tabs a + a {
  margin-left: 24px;
}
.account-tabs a:hover {
  text-shadow: 0.5px 0 var(--grey900);
}
.account-tabs a:hover:after {
  width: 100%;
}
.account-tabs a:after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -3px;
  height: 3px;
  width: 0;
  background-color: var(--marine500);
  transition: 0.3s;
}
.account-tabs a.active {
  text-shadow: 0.5px 0 var(--grey900);
}
.account-tabs a.active:after {
  background-color: var(--marine500);
  width: 100%;
}
.desc {
  margin-bottom: 24px;
  padding: 16px;
  background-color: var(--background100);
  border-radius: 4px;
}
.desc-red {
  background-color: var(--red50) !important;
}
.desc-red p {
  color: var(--red600);
}
.add-account__actions {
  position: absolute;
  left: 32px;
  right: 32px;
  bottom: 60px;
}
.add-account__actions .buttons button {
  margin: 0;
}
.st-form-item .st-input {
  margin-bottom: 0;
}
.buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 62px;
}
:deep .custom-checkbox.st-checkbox {
  margin-top: 24px;
  padding-left: 36px;
  font-size: 12px;
  line-height: 20px;
  font-family: var(--secondary-font);
}
:deep .custom-checkbox .st-checkbox__checkmark {
  border-radius: 4px;
  width: 16px;
  height: 16px;
}
:deep .custom-checkbox .st-checkbox__checkmark .check {
  top: 2px;
  left: 6px;
  width: 3px;
  height: 7px;
}
.button {
  margin-top: 56px;
  width: 100%;
  text-align: center;
}
.button-import {
  margin-top: 97px;
}
.button .st-button {
  min-width: 177px;
}
:deep .st-modal__stepper {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 32px;
}
:deep .disabled {
  opacity: 1;
  background: linear-gradient(
      153.43deg,
      rgba(184, 183, 187, 0.15) 0%,
      rgba(229, 228, 232, 0.15) 83.33%
    ),
    var(--grey100);
  border: 1px solid rgba(207, 205, 209, 0.25);
  color: var(--grey300);
}

:deep .st-form-item__message--is-error {
  line-height: 18px;
}
.st-form-item__key :deep .st-input input {
  padding-right: 27px;
}
:deep .st-form-item .st-form-item__error,
.error {
  position: absolute;
  left: 0;
  right: 0;
  text-align: left;
}
.scan-modal {
  background-color: transparent;
  backdrop-filter: unset;
}
/* svg path,
svg circle {
  transition: 0.3s;
} */
.progress-animated {
  position: relative;
  top: -2px;
  left: -2px;
  width: 104px;
  height: 104px;
}
.progress {
  margin: 96px auto 44px;
  position: relative;
  width: 100px;
  height: 100px;
  /* background: rgba(195, 169, 251, 0.3); */
  border-radius: 100px;
}
.overlay-progress {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  line-height: 28px;
  letter-spacing: 0.12px;
  font-family: var(--secondary-font);
  background-color: #fff;
  border-radius: 100%;
  position: absolute;
  top: 2px;
  right: 0px;
  bottom: 5px;
  left: 1px;
  width: 98px;
  height: 97px;
}
.no-camera {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100% - 80px);
}
.no-camera svg {
  display: block;
  margin: 0 auto 24px;
  width: 140px;
}
.no-camera svg path {
  fill: var(--gray900);
}
.loading-gif {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loading-gif img {
  display: block;
  height: 28px;
  position: absolute;
}

:deep.circle-progress__wrapper .rightcircle {
  border-top: 2px solid var(--marine200);
  border-right: 2px solid var(--marine200);
  right: 0;
}
:deep.circle-progress__wrapper .leftcircle {
  border-bottom: 2px solid var(--marine200);
  border-left: 2px solid var(--marine200);
  left: 0;
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}
</style>
