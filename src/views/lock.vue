<template>
  <div class="lock-container">
    <video
      id="bgAnimation"
      width="320"
      height="240"
      poster="@/assets/animationFrame.png"
      autoplay
      muted
    >
      <source src="backgroundAnimation.mp4" type="video/mp4" />
    </video>
    <div v-if="isVideoLoaded" class="overlay" />
    <div class="lock-container__inner">
      <SvgIcon name="icon-stealth-logo" v-if="isLock" class="lock-logo" />
      <img v-else class="logo" src="@/assets/logo.gif" alt="welcome" />

      <div class="box" :class="{ 'box-animated': isAnimated }">
        <template v-if="isAnimated">
          <h4>Welcome back</h4>
          <form class="form" @submit.prevent>
            <StFormItem
              color="dark"
              label="Password"
              :filled="password"
              :error-message="form.password.$errors"
            >
              <StInput
                id="password"
                v-model="password"
                placeholder="Please enter your Password"
                :type="showPassword ? 'text' : 'password'"
              >
                <StTooltip
                  class="tooltip"
                  :tooltip="!showPassword ? 'Show Password' : 'Hide Password'"
                >
                  <SvgIcon
                    name="icon-eye-opened"
                    v-if="!showPassword"
                    @click="showPassword = true"
                  />

                  <SvgIcon
                    name="icon-eye-closed"
                    v-else
                    @click="showPassword = false"
                    :class="{ 'icon-active': showPassword }"
                  />
                </StTooltip>
              </StInput>
              <p
                v-if="
                  form.password.$errors &&
                  !form.password.$errors.includes('Incorrect Password.')
                "
              ></p>
              <a class="forgot" @click="forgotPassword = true"
                >Forgot Password</a
              >
            </StFormItem>
            <StButton size="normal" type="type-d" @click="validatePassword"
              >Continue</StButton
            >
          </form>
        </template>
      </div>
    </div>
    <StModal light :visible="forgotPassword" @close="cancelClearData">
      <template #header>Reset StealthSend</template>
      <template #body>
        <template v-if="!isCleared">
          <p>
            All of your accounts are backed up by your Recovery Phrase. If you
            can't remember your password, the only way to regain access to your
            StealthSend application is to clear all application data and restore
            from Recovery Phrase. After you restore your backup you will be able
            to choose a new password.
          </p>
          <div class="info">
            <p>
              Locally stored data such as account names, transaction labels and
              contacts will not be recovered.
            </p>
            <p class="bold">
              Are you sure you want to proceed and delete all app data?
            </p>
          </div>
        </template>
        <template v-else>
          <div class="progress">
            <SvgIcon name="icon-loader" class="progress-animated" />
            <div class="overlay-progress">{{ counter }}s</div>
          </div>
          <p class="reset">Resetting in...</p>
        </template>
      </template>
      <template #footer>
        <template v-if="!isCleared">
          <StButton
            class="no-margin"
            type="type-b"
            @click="forgotPassword = false"
            >Cancel</StButton
          >
          <StButton class="no-margin" @click="clearData"
            >Clear App Data</StButton
          >
        </template>
        <StButton class="cancel-button" v-else @click="cancelClearData"
          >Cancel</StButton
        >
      </template>
    </StModal>
  </div>
</template>
<script>
export default {
  name: 'StLock',
};
</script>
<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import router from '@/router';
import CryptoService from '@/services/crypto';
import { useValidation } from 'vue3-form-validation';
import db from '@/db';
/* import Lottie from 'vue-lottie/src/lottie.vue'; */
/* import * as animationData from '@/assets/animation/logo.json'; */
import { useMainStore } from '@/store';
import SvgIcon from '../components/partials/SvgIcon.vue';
const isAnimated = ref(false);
const password = ref('');
const showPassword = ref(false);
const forgotPassword = ref(false);
const isCleared = ref(false);
const timeout = ref(null);
const counterTimeout = ref(null);
const counter = ref(6);
const isVideoLoaded = ref(false);
const wrongAttempts = ref(0);
const cooldown = ref(0);
const mainStore = useMainStore();

const {
  form,
  // errors,
  // add,
  // submitting,
  formFields,
  validateFields,
  resetFields,
} = useValidation(
  {
    password: {
      $value: password,
      $rules: [
        async (password) => {
          if (wrongAttempts.value >= 5) {
            return `Too many attempts. Try again in 30 seconds.`;
          }
          if (!password) {
            return '';
          }
          let isValid = await CryptoService.validatePassword(password);
          if (!isValid) {
            return 'Incorrect Password.';
          }
        },
      ],
    },
  },
  false
);

const isLock = computed(() => {
  return mainStore.isLock;
});

watch(
  () => wrongAttempts.value,
  () => {
    if (wrongAttempts.value === 5) {
      cooldown.value = 30;
      setInterval(() => {
        if (cooldown.value > 0) {
          cooldown.value -= 1;
          if (cooldown.value === 0) {
            wrongAttempts.value = 0;
          }
        }
      }, 1000);
    }
  }
);

onMounted(() => {
  mainStore.STOP_GLOBAL_LOADING(); // just in case
  mainStore.SET_WALLET(null);
  let video = document.getElementById('bgAnimation');
  video.addEventListener('loadeddata', () => {
    isVideoLoaded.value = true;
    setTimeout(() => mainStore.SET_IS_LOCK(true), 3180);
  });
  wrongAttempts.value = 0;
  mainStore.TOGGLE_DRAWER(false);
  mainStore.SET_OFF_CANVAS_DATA(null);
  if (isLock.value) {
    isAnimated.value = true;
    setTimeout(() => {
      let password = document.getElementById('password');
      if (password) {
        password.getElementsByClassName('st-input__inner')[0].focus();
      }
    }, 1);
  } else {
    setTimeout(() => {
      isAnimated.value = true;
      setTimeout(() => {
        let password = document.getElementById('password');
        if (password) {
          password.getElementsByClassName('st-input__inner')[0].focus();
        }
      }, 500);
    }, 3500);
  }
  mainStore.checkRpcStatus();
});

async function validatePassword() {
  if (wrongAttempts.value >= 5) {
    try {
      await validateFields();
    } catch (e) {
      console.log(e);
    } finally {
      for (const formField of formFields.value.values()) {
        formField.touched = false;
      }
    }

    return;
  }
  try {
    await validateFields();
    await CryptoService.unlock(password.value);
    router.push('/dashboard');
    resetFields();
  } catch (e) {
    wrongAttempts.value += 1;
    setTimeout(() => {
      password.value = '';
      document
        .getElementById('password')
        .getElementsByClassName('st-input__inner')[0]
        .focus();
    }, 500);
    console.log(e);
  } finally {
    for (const formField of formFields.value.values()) {
      formField.touched = false;
    }
  }
}

function countdown() {
  counter.value -= 1;
  counterTimeout.value = setTimeout(() => countdown(), 950);
}

function clearData() {
  isCleared.value = true;
  countdown();
  timeout.value = setTimeout(async () => {
    await db.dropInstance();
    localStorage.clear();
    forgotPassword.value = false;
    isCleared.value = false;
    clearTimeout(counterTimeout.value);
    counter.value = 6;
    router.push('/welcome');
  }, 5000);
}

function cancelClearData() {
  clearTimeout(timeout.value);
  clearTimeout(counterTimeout.value);
  counter.value = 6;
  isCleared.value = false;
  forgotPassword.value = false;
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.lock-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
}
.lock-container video {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: left;
  z-index: -2;
  pointer-events: none;
}
.lock-container .overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  pointer-events: none;
  background-color: rgba(20, 4, 53, 0.6);
}
.lock-container .lock-container__inner {
  padding: 20px 20px 60px 20px;
  width: 100%;
  height: calc(100% - 80px);
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  transition: width 0.3s;
}
.lock-container .box {
  text-align: center;
  width: 328px;
  max-width: 100%;
  height: 0;
  transition: 0.7s;
}
.lock-logo {
  margin-top: 60px;
  margin-bottom: 59px;
  min-height: 40px;
}
.logo {
  min-height: 158px;
  max-width: 197px;
  margin: -2px 0 0;
}
.lock-container .box-animated {
  height: 100%;
}
h4 {
  margin-top: 20px;
  margin-bottom: 100px;
  color: #fff;
}
h5 {
  margin-bottom: 36px;
  color: #fff;
}
:deep .st-input input {
  background-position: 92% 49% !important;
}
.form {
  height: calc(100% - 157px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.form fieldset {
  display: flex;
  flex-direction: column;
}

.form fieldset .forgot {
  order: 2;
}

.form fieldset .st-form-item__error {
  order: 1;
}
:deep svg path,
:deep svg circle {
  transition: 0.3s;
}
.icon-active path + path {
  stroke: var(--marine500) !important;
}
:deep .st-input .st-icon {
  cursor: pointer;
}
:deep .st-form-item__message {
  top: 100% !important;
  margin-top: 0 !important;
}
.forgot {
  cursor: pointer;
  margin-right: auto;
  display: block;
  width: fit-content;
  color: var(--grey400);
  font-family: var(--secondary-font);
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.12px;
  transition: 0.3s;
}
.forgot:hover {
  color: #fff;
}
:deep .st-modal-container {
  width: 416px !important;
}
:deep .st-modal__body {
  margin-bottom: 75px !important;
}
:deep .st-modal__footer {
  display: flex;
  align-content: center;
  justify-content: space-between;
}
.cancel-button {
  min-width: 169px !important;
}
.info {
  margin-top: 24px;
  padding: 16px;
  background-color: var(--background100);
}
.info p + p {
  margin-top: 24px;
}
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
  background: rgba(195, 169, 251, 0.3);
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
  top: 1px;
  right: 1px;
  bottom: 1px;
  left: 1px;
}
.reset {
  text-align: center;
  margin-bottom: 128px;
}
:deep .st-form-item__error {
  text-align: left;
}
</style>
