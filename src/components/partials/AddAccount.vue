<template>
  <StModal
    light
    :steps="steps"
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
      <div v-if="activeStep === 'add-account'">
        <div class="desc">
          <p>
            You can create an unlimited number of accounts; they are all derived
            from the same Recovery Phrase. Your previously created Recovery
            Phrase protects all of your accounts.
          </p>
        </div>
        <StFormItem
          label="Account Name"
          :error-message="form.accountName.$errors"
        >
          <StInput
            v-model="form.accountName.$value"
            placeholder="Please add unique account name"
          ></StInput>
        </StFormItem>
        <div class="buttons">
          <StButton color="secondary" @click="closeModal">Cancel</StButton>
          <StButton @click="generateAccount" :disabled="!accountName.length"
            >Add</StButton
          >
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
          <StFormItem label="Account Name">
            <StInput
              v-model="accountName"
              placeholder="Please add Unique Account Name"
            />
          </StFormItem>
          <StFormItem label="Private Key">
            <StInput v-model="privateKey" placeholder="Paste your private key">
              <StTooltip
                class="tooltip"
                :tooltip-text="
                  copyPending ? 'Copied to clipboard!' : 'Click to copy'
                "
              >
                <StClipboard :content="privateKey" @click="handleCopy"
                  ><svg
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.7692 5.29395H1V17.9998H12.7692V5.29395Z"
                      stroke="#4E00F6"
                      stroke-width="2"
                    />
                    <path
                      d="M18 14.8232L18 -0.000279405"
                      stroke="#4E00F6"
                      stroke-width="2"
                    />
                    <path
                      d="M2.30762 1.05859L17.9999 1.05859"
                      stroke="#4E00F6"
                      stroke-width="2"
                    />
                  </svg>
                </StClipboard>
              </StTooltip>
            </StInput>
          </StFormItem>
          <div class="button">
            <StButton @click="nextStep">Import</StButton>
          </div>
        </template>
        <template v-if="currentStep === 3">
          <h5>Importing Private Key</h5>
          <p class="medium">
            Please be patient and don’t turn off the phone or exit the
            application
          </p>
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
import { useValidation } from 'vue3-form-validation';

export default {
  name: 'StAccountModal',
  setup() {
    // VARIABLES
    const mainStore = useMainStore();
    const currentStep = ref(1);
    const activeStep = ref('add-account');
    const accountName = ref('');
    const understand = ref(false);
    const privateKey = ref('');
    const copyPending = ref(false);

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
            if (isLastAccountEmpty) {
              return 'You can only have one account with zero balance. Please add XST to your previous account prior to opening a new one.';
            }
            if (existingAccounts.some((el) => el.label === accountName)) {
              return 'Account name already exists.';
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
    watch(
      () => isVisible.value,
      async () => {
        if (isVisible.value) {
          existingAccounts = await CryptoService.getAccounts();
          console.log('eeee', existingAccounts);
        }
      }
    );

    // METHODS
    function closeModal() {
      mainStore.SET_MODAL_VISIBILITY('account', false);
      accountName.value = '';
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
    function handleCopy() {
      copyPending.value = true;
      setTimeout(() => {
        copyPending.value = false;
      }, 2000);
    }

    let isLastAccountEmpty = false;
    async function generateAccount() {
      isLastAccountEmpty = false;
      let account = {};
      // mainStore.SET_MODAL_VISIBILITY('account', false);
      // mainStore.START_GLOBAL_LOADING();

      let next = await CryptoService.getNextAccountPath();

      // get current last existing account
      const { pk: lastAccountPk } = CryptoService.getChildFromRoot(
        next - 1 >= 0 ? next - 1 : 0,
        0,
        0
      );

      // check if last existing account has transactions
      const lastHdAccount = await mainStore.rpc('gethdaccount', [
        lastAccountPk,
      ]);

      // if does have transactions, don't create new account
      if (lastHdAccount.length === 0) {
        isLastAccountEmpty = true;
        await validateFields();
        return;
      }

      await validateFields();

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
      accountName.value = '';

      await CryptoService.storeAccountInDb(account);
      // mainStore.STOP_GLOBAL_LOADING();
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

      // COMPUTED
      isVisible,
      steps,

      // METHODS
      closeModal,
      changeStep,
      nextStep,
      generateAccount,
      handleCopy,

      form,
      errors,
      isLastAccountEmpty,
    };
  },
};
</script>

<style scoped>
:deep .st-modal-container {
  width: 416px;
  min-height: 512px;
}
:deep .st-modal__body {
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
  padding-right: 20px;
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
.buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 54px;
}
:deep .custom-checkbox.st-checkbox {
  margin-top: 24px;
  padding-left: 36px;
  font-size: 12px;
  line-height: 20px;
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
.button .st-button {
  min-width: 177px;
}
:deep .st-modal__stepper {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 32px;
}
</style>
