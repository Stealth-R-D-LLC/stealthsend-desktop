<template>
  <div class="lock-container">
    <img src="@/assets/welcome.png" alt="welcome" />
    <!-- <video id="bgAnimation" width="320" height="240" autplay muted>
      <source
        src="@/assets/animation/backgroundAnimation.mp4"
        type="video/mp4"
      />
      <source
        src="@/assets/animation/backgroundAnimation.ogg"
        type="video/ogg"
      />
      Not supported
    </video> -->
    <div class="overlay"></div>
    <div class="lock-container__inner">
      <lottie
        :options="lottieOptions"
        :height="158"
        class="logo"
        @animCreated="handleAnimation"
      />
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
                <svg
                  v-if="!showPassword"
                  @click="showPassword = true"
                  width="22"
                  height="12"
                  viewBox="0 0 22 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11 11C14.3137 11 17.3137 9.33333 20 6C17.3137 2.66667 14.3137 1 11 1C7.68629 1 4.68629 2.66667 2 6C4.68629 9.33333 7.68629 11 11 11Z"
                    stroke="#4E00F6"
                    stroke-width="2"
                  />
                  <circle
                    r="1"
                    transform="matrix(-1 0 0 1 11 6)"
                    fill="#4E00F6"
                    stroke="#4E00F6"
                    stroke-width="2"
                  />
                </svg>
                <svg
                  v-else
                  @click="showPassword = false"
                  :class="{ 'icon-active': showPassword }"
                  width="22"
                  height="16"
                  viewBox="0 0 22 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 3C7.68629 3 4.68629 4.66667 2 8C4.68629 11.3333 7.68629 13 11 13C14.3137 13 17.3137 11.3333 20 8C19.3945 7.24866 18.7731 6.58199 18.1357 6"
                    stroke="#4E00F6"
                    stroke-width="2"
                  />
                  <path d="M7 8L12 8" stroke="#4E00F6" stroke-width="2" />
                  <path d="M19 1L5 15" stroke="#4E00F6" stroke-width="2" />
                </svg>
              </StInput>
              <template #description>
                <a class="forgot" @click="forgotPassword = true"
                  >Forgot Password</a
                >
              </template>
            </StFormItem>
            <StButton type="type-d" @click="validatePassword"
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
            All of your accounts and your private keys are backed up by your
            Recovery Phrase. If you can't remember your password, the only way
            to regain access to your StealthSend application is to clear all
            application data and restore from Recovery Phrase. After you restore
            your backup you will be able to choose a new password.
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
            <svg
              class="progress-animated"
              version="1.1"
              id="circle"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 100 100"
              xml:space="preserve"
            >
              <circle
                fill="none"
                stroke="#A67FFA"
                stroke-width="1"
                stroke-mitterlimit="0"
                cx="50"
                cy="50"
                r="48"
                stroke-dasharray="360"
                stroke-linecap="round"
                transform="rotate(-90 ) translate(-100 0)"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="50;430"
                  dur="5.2s"
                ></animate>
              </circle>
            </svg>
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
import { ref, onMounted } from 'vue';
import router from '@/router';
import CryptoService from '@/services/crypto';
import { useValidation } from 'vue3-form-validation';
import db from '@/db';
import Lottie from 'vue-lottie/src/lottie.vue';
import * as animationData from '@/assets/animation/logo.json';
import { useMainStore } from '@/store';

export default {
  name: 'StLock',
  components: {
    Lottie,
  },
  setup() {
    const isAnimated = ref(false);
    const password = ref('');
    const showPassword = ref(false);
    const forgotPassword = ref(false);
    const isCleared = ref(false);
    const timeout = ref(null);
    const counterTimeout = ref(null);
    const counter = ref(6);
    const animation = ref(null); // for saving the reference to the animation
    const lottieOptions = ref({
      animationData: animationData.default,
      render: 'svg',
      loop: false,
      autoplay: true,
    });

    const mainStore = useMainStore();

    const {
      form,
      // errors,
      // add,
      // submitting,
      validateFields,
      resetFields,
    } = useValidation({
      password: {
        $value: password,
        $rules: [
          async (password) => {
            if (!password) {
              return 'Password is required.';
            }
            let isValid = await CryptoService.validatePassword(password);
            if (!isValid) {
              return 'Incorrect password.';
            }
          },
        ],
      },
    });

    onMounted(() => {
      mainStore.TOGGLE_DRAWER(false);
      mainStore.SET_OFF_CANVAS_DATA(null);
      setTimeout(() => {
        isAnimated.value = true;
        setTimeout(() => {
          let password = document.getElementById('password');
          if (password) {
            password.getElementsByClassName('st-input__inner')[0].focus();
          }
        }, 500);
      }, 3500);
      mainStore.checkRpcStatus();
    });

    async function validatePassword() {
      if (await validateFields()) {
        try {
          await CryptoService.unlock(password.value);
          router.push('/dashboard');
          resetFields();
        } catch (e) {
          console.log('e', e);
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

    function handleAnimation(anim) {
      animation.value = anim;
    }

    return {
      counter,
      isCleared,
      clearData,
      cancelClearData,
      forgotPassword,
      showPassword,
      isAnimated,
      password,
      validatePassword,
      form,
      handleAnimation,
      lottieOptions,
    };
  },
};
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
.lock-container video,
.lock-container img {
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
.logo {
  min-height: 158px;
  max-width: 197px;
  margin: 0 0 20px;
}
.lock-container .box-animated {
  height: 100%;
}
h4 {
  margin-top: 20px;
  margin-bottom: 100px;
  color: var(--white);
}
h5 {
  margin-bottom: 36px;
  color: var(--white);
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
svg path,
svg circle {
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
  color: var(--white);
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
  background-color: var(--white);
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
</style>
