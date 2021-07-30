<template>
  <div class="st-settings-child st-password-container">
    <!-- CONFIRM PASSWORD MODAL -->
    <StModal light :visible="isVisible" @close="closeModal">
      <template #header>
        <div>
          <h6>Password Required</h6>
          <p>Enter your password to authorize this action</p>
        </div>
      </template>
      <template #body>
        <StFormItem
          class="item-center"
          label="Password"
          position="center"
          :filled="form.password.$value"
          :error-message="form.password.$errors"
        >
          <StInput
            id="password"
            v-model="form.password.$value"
            type="password"
            placeholder="Please enter your password"
            @keyup.enter="nextStep"
          />
        </StFormItem>
      </template>
    </StModal>
    <div class="st-settings-child__overflow">
      <h6 v-if="currentStep < 4 && !checkMnemonic" class="title">
        Recovery Phrase
      </h6>
      <h6 v-if="checkMnemonic && currentStep !== 4" class="title">
        Checking Recovery Phrase
      </h6>
      <h6 v-if="currentStep === 4 && isValidMnemonic" class="title">
        Congratulations
      </h6>
      <h6 v-if="currentStep === 4 && !isValidMnemonic" class="title">Error</h6>
      <template v-if="!checkMnemonic">
        <p v-if="currentStep === 1" class="subtitle">
          Backup your Recovery Phrase
        </p>
        <p v-else-if="currentStep === 2" class="subtitle">
          Carefully record all {{ walletMnemonic.length }} words
        </p>
        <p v-else-if="currentStep === 3" class="subtitle">
          To verify your Recovery Phrase enter the words in the order received
        </p>
        <p v-else-if="currentStep === 4 && isValidMnemonic" class="subtitle">
          Recovery Phrase successfully verified
        </p>
        <p v-else-if="currentStep === 4 && !isValidMnemonic" class="subtitle">
          Recovery Phrase is not valid
        </p>
      </template>
      <p v-if="checkMnemonic && currentStep !== 4" class="subtitle">
        Please be patient and don’t turn off the computer or exit the
        application
      </p>
      <div
        class="content"
        :class="{
          'content-loading': checkMnemonic,
          'content-3': currentStep === 3,
        }"
      >
        <!-- RECOVERY PHRASE STEP 1 -->
        <template v-if="currentStep === 1">
          <div class="grey-box">
            <p class="info bold">Notice</p>
            <p class="info">
              You are about to backup the Recovery Phrase of your StealthSend
              application.
            </p>
            <p class="info">
              This phrase allows anyone knowing it to spend all funds from your
              wallet.
            </p>
            <p class="info">
              You will see a list of words. Write them down and store them in a
              safe place.
            </p>
            <StCheckbox v-model="understand" class="custom-checkbox"
              >I understand</StCheckbox
            >
          </div>
        </template>
        <!-- WALLET MNEMONIC LIST -->
        <template v-if="currentStep === 2">
          <div class="grey-box">
            <div class="grey-box__inner">
              <a
                class="mnemonic"
                v-for="(word, index) in walletMnemonic"
                :key="index"
              >
                <span class="bold">{{ index + 1 }}.&nbsp;</span> {{ word }}
              </a>
            </div>
          </div>
        </template>
        <!-- VERIFY WALLET MNEMONIC -->
        <template v-if="currentStep === 3">
          <template v-if="!checkMnemonic">
            <div class="grey-box">
              <div v-if="selectedMnemonic.length" class="grey-box__inner">
                <a
                  class="mnemonic"
                  v-for="word in selectedMnemonic"
                  :key="word"
                >
                  {{ word }}
                  <svg
                    @click="removeSelectedWord(word)"
                    width="8"
                    height="8"
                    viewBox="0 0 8 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1L7 7"
                      stroke="#1C1A1C"
                      stroke-width="1.5"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M1 7L7 1"
                      stroke="#1C1A1C"
                      stroke-width="1.5"
                      stroke-linejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <StFormItem
              :label="`Word ${selectedMnemonic.length + 1} (of ${
                walletMnemonic.length
              })`"
            >
              <StInput
                id="mnemonic"
                v-model="mnemonic"
                :placeholder="`Enter ${selectedMnemonic.length + 1}. word`"
                @keyup.enter="selectWord(mnemonic)"
              >
                <svg
                  @click="mnemonic = ''"
                  width="19"
                  height="18"
                  viewBox="0 0 19 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.4541 3L15.4541 15"
                    stroke="#4E00F6"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M3.4541 15L15.4541 3"
                    stroke="#4E00F6"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                </svg>
                <svg
                  @click="selectWord(mnemonic)"
                  width="17"
                  height="12"
                  viewBox="0 0 17 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.4541 1L5.90865 10L1.4541 5"
                    stroke="#4E00F6"
                    stroke-width="2"
                  />
                </svg>
              </StInput>
              <p v-if="isError" class="mnemonic-error">
                Selected word is not in wordlist
              </p>
              <div v-else class="searched-words">
                <transition-group name="fade">
                  <a
                    v-for="word in searchedWords"
                    :key="word"
                    @click="selectWord(word)"
                    >{{ word }}</a
                  >
                </transition-group>
              </div>
            </StFormItem>
          </template>
          <template v-else>
            <img src="../../../static/xstloader.gif" alt="checkPhrase" />
          </template>
        </template>
        <template v-if="currentStep === 4">
          <template v-if="isValidMnemonic">
            <div class="grey-box">
              <p class="info">
                Keep your Recovery Phrase in a safe place, the safety of your
                XST is based on it.
              </p>
              <StCheckbox v-model="savedPhrase" class="custom-checkbox"
                >I have stored the Recovery Phrase in a safe place</StCheckbox
              >
            </div>
          </template>
        </template>
      </div>
      <div class="footer">
        <StButton
          v-if="currentStep === 1"
          :disabled="!understand"
          @click="openModal"
          >Show Recovery Phrase</StButton
        >
        <StButton v-else-if="currentStep === 2" @click="nextStep"
          >Start Verification</StButton
        >
        <!-- TODO: ADD ACTION ON CONFIRM BUTTON -->
        <StButton
          :disabled="!savedPhrase"
          v-if="currentStep === 4 && isValidMnemonic"
          @click="goBack"
          >Confirm</StButton
        >
        <StButton v-if="currentStep === 4 && !isValidMnemonic" @click="goBack"
          >Back</StButton
        >
        <div class="step-container">
          <span
            v-for="(n, index) in 4"
            :key="index"
            class="step"
            :class="{ 'step-active': currentStep === index + 1 }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watchEffect } from 'vue';
import * as bip39 from 'bip39';
import CryptoService from '@/services/crypto';
import { useValidation } from 'vue3-form-validation';
export default {
  setup() {
    // VARIABLES
    const currentStep = ref(1);
    const understand = ref(false);
    const isVisible = ref(false);
    const password = ref('');
    const isValid = ref(false);
    const wordlist = ref(bip39.wordlists.EN);
    let walletMnemonic = ref([]);
    const selectedMnemonic = ref([]);
    const mnemonic = ref('');
    const isError = ref(false);
    const isValidMnemonic = ref(false);
    const checkMnemonic = ref(false);
    const savedPhrase = ref(false);

    const { form, validateFields, resetFields } = useValidation({
      password: {
        $value: password,
        $rules: [
          async (password) => {
            if (!password) {
              return 'Password is required.';
            }
            isValid.value = await CryptoService.validatePassword(password);
            if (!isValid.value) {
              return 'Incorrect password.';
            }
          },
        ],
      },
    });

    // WATCH
    watchEffect(async () => {
      if (currentStep.value === 3) {
        setTimeout(
          () =>
            document
              .getElementById('mnemonic')
              .getElementsByClassName('st-input__inner')[0]
              .focus(),
          1
        );
      }
      if (currentStep.value === 2) {
        const wallet = await CryptoService.getWalletFromDb();
        walletMnemonic.value = await CryptoService.AESDecrypt(
          wallet.mnemonic,
          wallet.password
        );
      }
    });

    // COMPUTED
    const searchedWords = computed(() => {
      if (mnemonic.value.length < 2) return;
      return wordlist.value
        .filter((word) => word.startsWith(mnemonic.value))
        .slice(0, 3);
    });

    // FUNCTIONS
    async function nextStep() {
      // Trigger validation for password
      await validateFields();
      if (isValid.value) {
        isVisible.value = false;
        currentStep.value += 1;
      }
    }
    function goBack() {
      currentStep.value = 1;
      understand.value = false;
      password.value = '';
      selectedMnemonic.value = [];
    }
    function selectWord(word) {
      if (wordlist.value.includes(word)) {
        // Push mnemonic in array
        selectedMnemonic.value.push(word);
      } else {
        // Error if selected word is not in wordlist
        isError.value = true;
        setTimeout(() => (isError.value = false), 3000);
      }
      // Check mnemonic length and go to next step
      if (selectedMnemonic.value.length === walletMnemonic.value.length) {
        // check if mnemonic is valid
        isValidMnemonic.value = CryptoService.isMnemonicValid(
          selectedMnemonic.value.join(' ')
        );

        checkMnemonic.value = true;
        setTimeout(() => {
          nextStep();
          setTimeout(() => (checkMnemonic.value = false), 100);
        }, 4200);
      }
      mnemonic.value = '';
    }
    // Remove word from selected words
    function removeSelectedWord(word) {
      selectedMnemonic.value.splice(selectedMnemonic.value.indexOf(word), 1);
    }
    function closeModal() {
      isVisible.value = false;
      password.value = '';
      resetFields();
    }
    function openModal() {
      isVisible.value = true;
      setTimeout(
        () =>
          document
            .getElementById('password')
            .getElementsByClassName('st-input__inner')[0]
            .focus(),
        1
      );
      resetFields();
    }

    return {
      // VARIABLES
      currentStep,
      understand,
      isVisible,
      password,
      form,
      validateFields,
      walletMnemonic,
      selectedMnemonic,
      wordlist,
      mnemonic,
      isError,
      checkMnemonic,
      isValidMnemonic,
      savedPhrase,

      // COMPUTED
      searchedWords,

      // FUNCTIONS
      nextStep,
      selectWord,
      goBack,
      removeSelectedWord,
      closeModal,
      openModal,
    };
  },
};
</script>

<style scoped>
.title {
  margin-bottom: 12px;
}
.subtitle {
  margin-bottom: 28px;
}
.content {
  height: calc(100% - 180px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.content-3 {
  height: calc(100% - 140px) !important;
}
.content-loading {
  display: flex;
  align-items: center;
  justify-content: center;
}
.grey-box {
  margin-bottom: 40px;
  width: 100%;
  max-width: 568px;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 24px;
  min-height: 74px;
  background-color: var(--background100);
}
.grey-box .info {
  margin-bottom: 24px;
}
.grey-box__inner {
  display: grid;
  align-items: center;
  grid-template-columns: repeat(6, 2fr);
  grid-gap: 33px 10px;
}
:deep .custom-checkbox.st-checkbox {
  margin-top: 32px;
  padding-left: 36px;
  font-size: 12px;
  line-height: 20px;
}
:deep .custom-checkbox.st-checkbox .st-checkbox__label {
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
:deep .st-button {
  padding: 5px 64px !important;
}
:deep .st-modal .st-modal-wrapper .st-modal-container {
  box-sizing: border-box;
  width: 480px;
  height: 284px;
}
:deep .st-modal .st-modal-wrapper .st-modal-container .st-modal__header {
  font-weight: 400;
  font-size: initial;
  line-height: initial;
  letter-spacing: initial;
  font-family: initial;
}
:deep .st-modal .st-modal-wrapper .st-modal-container .st-modal__body {
  margin: 58px 0 72px 0;
}
:deep .st-modal .st-modal-wrapper .st-modal-container .st-modal__header h6 {
  margin-bottom: 12px;
}
.item-center :deep .label label {
  right: 0;
  text-align: center;
}
.item-center :deep .st-input .st-input__inner {
  text-align: center;
}
.mnemonic {
  position: relative;
  width: fit-content;
  display: flex;
  align-items: center;
  padding: 0 8px;
  background: linear-gradient(
      153.02deg,
      rgba(221, 222, 242, 0.15) 0%,
      rgba(205, 206, 236, 0.15) 83.23%
    ),
    var(--purple100);
  border: 1px solid rgba(205, 206, 236, 0.25);
  border-radius: 2px;
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.12px;
  white-space: nowrap;
  font-family: var(--secondary-font);
  color: var(--grey1000);
}
.mnemonic:first-child::after {
  display: none !important;
}
.mnemonic:nth-child(6n + 1)::after {
  content: '';
  position: absolute;
  left: 0;
  top: -17px;
  right: 0;
  background-color: var(--grey100);
  display: block;
  height: 1px;
  width: 520px;
}
.mnemonic:nth-child(6n + 1) {
  margin-right: auto;
}
.mnemonic:nth-child(6n + 2),
.mnemonic:nth-child(6n + 3),
.mnemonic:nth-child(6n + 4),
.mnemonic:nth-child(6n + 5) {
  margin: 0 auto;
}
.mnemonic:nth-child(6n + 6) {
  margin-left: auto;
}
.mnemonic svg {
  cursor: pointer;
  display: none;
  margin-left: 8px;
}
.mnemonic:last-child svg {
  display: block !important;
}
.searched-words {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
}
.searched-words a {
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.12px;
  color: var(--grey900);
  font-family: var(--secondary-font);
}
.mnemonic-error {
  text-align: left;
  color: var(--red300);
}
:deep .st-form-item {
  max-width: 424px;
  margin-bottom: 0;
}
:deep .st-form-item svg {
  cursor: pointer;
}
:deep .st-icon svg:last-child {
  margin-left: 28px;
}
.footer {
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.step-container {
  margin-top: 24px;
  display: flex;
}
.step-container .step {
  margin: 0 4px;
  width: 4px;
  height: 4px;
  border-radius: 4px;
  background-color: var(--grey100);
}
.step-container .step-active {
  background-color: var(--grey300) !important;
}
</style>
