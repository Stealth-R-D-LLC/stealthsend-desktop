<template>
  <div class="lock-container">
    <video id="bgAnimation" width="320" height="240" autplay muted>
      <source
        src="@/assets/animation/backgroundAnimation.mp4"
        type="video/mp4"
      />
    </video>
    <div class="overlay"></div>
    <div class="lock-container__inner">
      <lottie
        :options="lottieOptions"
        :height="158"
        style="min-height: 158px"
        @animCreated="handleAnimation"
      />
      <div class="box" :class="{ 'box-animated': isAnimated }">
        <template v-if="isAnimated">
          <h4>Welcome back</h4>
          <form class="form" @submit.prevent>
            <StFormItem
              color="dark"
              label="Password"
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
                  width="44"
                  height="24"
                  viewBox="0 0 44 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clip-rule="evenodd"
                    d="M33 18c3.314 0 6.314-1.667 9-5-2.686-3.333-5.686-5-9-5s-6.314 1.667-9 5c2.686 3.333 5.686 5 9 5z"
                    stroke="#FAF9FC"
                    stroke-width="2"
                  />
                  <circle
                    r="1"
                    transform="matrix(-1 0 0 1 33 13)"
                    fill="#FAF9FC"
                    stroke="#FAF9FC"
                    stroke-width="2"
                  />
                </svg>
                <svg
                  v-else
                  @click="showPassword = false"
                  :class="{ 'icon-active': showPassword }"
                  width="26"
                  height="19"
                  viewBox="0 0 26 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 3C8.94991 3 5.28325 5.03704 2 9.11111C5.28325 13.1852 8.94991 15.2222 13 15.2222C17.0501 15.2222 20.7168 13.1852 24 9.11111C23.2599 8.1928 22.5004 7.37799 21.7214 6.66667"
                    stroke="#FEFEFE"
                    stroke-width="2"
                  />
                  <path d="M9 9L15.1111 9" stroke="#4E00F6" stroke-width="2" />
                  <path
                    d="M23.1113 1L6.00022 18.1111"
                    stroke="#4E00F6"
                    stroke-width="2"
                  />
                </svg>
              </StInput>
              <a class="forgot" @click="forgotPassword = true"
                >Forgot Password</a
              >
            </StFormItem>
            <StButton color="white" @click="validatePassword"
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
                  dur="3.2s"
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
          <StButton color="secondary" @click="forgotPassword = false"
            >Cancel</StButton
          >
          <StButton @click="clearData">Clear App Data</StButton>
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
    const counter = ref(4);
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
      document.getElementById('bgAnimation').play();
      setTimeout(() => {
        isAnimated.value = true;
        setTimeout(() => {
          let password = document.getElementById('password');
          if (password) {
            password.getElementsByClassName('st-input__inner')[0].focus();
          }
        }, 500);
      }, 3500);
    });

    async function validatePassword() {
      if (await validateFields()) {
        await CryptoService.unlock(password.value);
        router.push('/dashboard');
        resetFields();
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
        counter.value = 4;
        location.reload();
      }, 3000);
    }

    function cancelClearData() {
      clearTimeout(timeout.value);
      clearTimeout(counterTimeout.value);
      counter.value = 4;
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
  padding: 80px 20px 60px 20px;
  width: 100%;
  height: calc(100% - 140px);
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  transition: width 0.3s;
}
.lock-container .box {
  text-align: center;
  width: 370px;
  max-width: 100%;
  height: 0;
  transition: 0.7s;
}
.lock-container .box-animated {
  height: 100%;
}
h4 {
  margin-top: 79px;
  margin-bottom: 40px;
  color: var(--white);
}
h5 {
  margin-bottom: 36px;
  color: var(--white);
}
.st-button {
  margin: 0 auto;
  width: 100%;
  max-width: 184px;
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
.st-button {
  padding: 5px 64px;
}
.st-button--primary {
  min-width: 219px;
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
