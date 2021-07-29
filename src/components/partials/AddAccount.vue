<template>
  <StModal
    light
    :steps="activeStep === 'add-account' ? 0 : steps"
    :current-step="currentStep"
    :visible="isVisible"
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
            v-show="isScanning"
            :visible="currentStep === 2"
            @close="isScanning = false"
            class="scan-modal"
          >
            <template #header>Scan Private Key</template>
            <template #body>
              <div class="stream">
                <qr-stream @decode="onDecode" class="mb">
                  <div class="frame" />
                </qr-stream>
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
              <StTooltip tooltip="Scan private key">
                <svg
                  @click="startScanner"
                  width="18"
                  height="18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clip-rule="evenodd"
                    d="M7 7H1V1h6v6z"
                    stroke="#6B2AF7"
                    stroke-width="2"
                  />
                  <path
                    d="M11 0v3h3V1h3v4M7 18v-2H4v1H1v-3M11 18v-2h3v1h3v-3M11 13H7v-2H4M10 7h8M14 9v2h3V9M1 10v2M11 9v1.636"
                    stroke="#6B2AF7"
                    stroke-width="2"
                  />
                </svg>
              </StTooltip>
            </StInput>
          </StFormItem>
          <div class="button button-import">
            <StButton @click="accountImport">Import</StButton>
          </div>
        </template>
        <template v-if="currentStep === 3">
          <h5>Importing Private Key</h5>
          <p class="medium">Please be patient and don’t exit the application</p>
        </template>
        <template v-if="currentStep === 4">
          <h5>Success</h5>
          <p class="medium">Your account has been successfully imported.</p>
          <p class="medium">You may now access your funds.</p>
        </template>
      </div>
    </template>
  </StModal>
</template>

<script>
import { useMainStore } from '@/store';
import { computed, ref, watchEffect, watch } from 'vue';
import CryptoService from '@/services/crypto';
import { useValidation, ValidationError } from 'vue3-form-validation';
import emitter from '@/services/emitter';
import { QrStream } from 'vue3-qr-reader';

export default {
  name: 'StAccountModal',
  components: {
    QrStream,
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

    // WATCH
    watchEffect(() => {
      if (currentStep.value === 3) {
        setTimeout(() => {
          nextStep();
        }, 2000);
      }
      if (currentStep.value === 4) {
        setTimeout(() => {
          currentStep.value = 1;
          activeStep.value = 'add-account';
          closeModal();
        }, 2000);
      }
    });

    // COMPUTED
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
          let { accounts } = await CryptoService.scanWallet();
          existingAccounts = accounts;
          wallet = await CryptoService.getWalletFromDb();
          isLastAccountEmpty.value = accounts.some((el) => el.utxo === 0);
          // console.log('exx', existingAccounts);
          // let next = await CryptoService.getNextAccountPath();
          // // get current last existing account
          // const { xpub: lastAccountPk } = CryptoService.getChildFromRoot(
          //   next - 1 >= 0 ? next - 1 : 0,
          //   0,
          //   0
          // );
          // let lastHdAccount = await mainStore.rpc('gethdaccount', [
          //   lastAccountPk,
          // ]);
          // if (lastHdAccount.length === 0) {
          //   isLastAccountEmpty.value = true;
          // }
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
          await CryptoService.importAccount(
            accountName.value,
            privateKey.value
          );
          emitter.emit('accounts:refresh');
          nextStep();
        } catch (e) {
          if (e instanceof ValidationError) {
            console.log(e);
          }
        }
      }
    }

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
      accountName.value = '';

      await CryptoService.storeAccountInDb(account);
      emitter.emit('accounts:refresh');
      // mainStore.STOP_GLOBAL_LOADING();
      closeModal();
    }

    function startScanner() {
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

    return {
      // VARIABLES
      currentStep,
      activeStep,
      accountName,
      understand,
      privateKey,
      copyPending,
      isScanning,

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
  min-height: 520px;
  box-sizing: border-box;
}
:deep .st-modal__body {
  margin-top: 36px;
  margin-bottom: 0;
}
.account-modal__hide-header :deep .st-modal__header {
  display: none;
}
.account-modal__hide-header :deep .st-modal__body {
  margin-top: 0;
  text-align: center;
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
  padding-bottom: 12px;
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
</style>
