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
      <svg
        v-if="isLock"
        class="lock-logo"
        width="167"
        height="40"
        viewBox="0 0 161 37"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M3.91029 1.67772C2.69822 1.67772 1.71138 2.6443 1.71138 3.83342V32.2571C1.71138 33.4454 2.69734 34.4128 3.91029 34.4128H32.9037C34.1157 34.4128 35.1026 33.4454 35.1026 32.2571V3.83342C35.1026 2.6443 34.1166 1.67772 32.9045 1.67772H3.91029ZM32.9038 36.0453H3.91042C1.77986 36.0453 0.0463257 34.3458 0.0463257 32.2571V3.83342C0.0463257 1.74387 1.77986 0.0452576 3.91042 0.0452576H32.9047C35.0343 0.0452576 36.7679 1.74387 36.7679 3.83342V32.2571C36.7679 34.3458 35.0343 36.0453 32.9038 36.0453ZM23.8626 16.7288L20.1195 9.57777L25.5909 13.2749L23.8626 16.7288ZM25.6312 22.8152L20.1283 26.5132L23.8933 19.3613L25.6312 22.8152ZM18.4069 27.1489L13.6138 18.045L18.4069 8.94188L23.1999 18.045L18.4069 27.1489ZM11.1828 22.8152L12.9207 19.3613L16.6857 26.5132L11.1828 22.8152ZM11.1828 13.2749L16.6857 9.57777L12.9207 16.7288L11.1828 13.2749ZM18.407 6.87557L9.64287 12.8899L12.2721 18.045L9.64287 23.2001L18.407 29.2145L27.1711 23.2001L24.5418 18.045L27.1711 12.8899L18.407 6.87557ZM55.7778 18.5159C56.2484 18.6121 56.734 18.7118 57.2212 18.8226C60.286 19.5048 63.1212 20.5805 63.1212 23.8197C63.1212 29.4645 57.1643 30.0737 54.6025 30.0737C52.0942 30.0737 46.2539 29.4766 45.8393 23.9829H50.3642C50.5351 26.2907 52.6718 27.1181 54.6402 27.1181C56.344 27.1181 58.3325 26.4333 58.3325 24.5053C58.3325 22.768 56.1047 22.2182 52.1679 21.3933C49.1048 20.7395 46.2696 19.7128 46.2696 16.648C46.2696 11.8959 50.6806 10.8992 54.3799 10.8992C57.8251 10.8992 62.0248 11.8546 62.5752 16.3774H58.0512C57.8303 14.6813 56.5806 13.8548 54.2318 13.8548C51.6087 13.8548 51.0583 14.9236 51.0583 15.8198C51.0583 17.5489 53.2418 17.9963 55.7724 18.5148L55.7778 18.5159ZM71.0885 5.81835H66.2998V25.5866C66.2998 29.2862 69.2367 29.7854 72.1087 29.7854C73.3041 29.7854 74.2349 29.7382 74.9491 29.6394V26.1193C74.5162 26.1863 74.0797 26.2172 73.5565 26.2172C71.6416 26.2172 71.0885 25.6794 71.0885 23.8201V15.5762H74.9491V11.4048H71.0885V5.81835ZM81.6297 18.4746L81.6174 18.7204H90.7321L90.6813 18.4454C90.1458 15.5689 88.7795 14.2869 86.2501 14.2869C82.7717 14.2869 81.7095 16.9186 81.6297 18.4746ZM76.8411 20.5041C76.8411 14.9391 80.8603 10.8992 86.3984 10.8992C88.9855 10.8992 91.1993 11.7747 92.8023 13.4312C94.6682 15.3601 95.6427 18.2934 95.4867 21.4956H81.6184L81.6298 21.7413C81.7797 25.0225 83.4466 26.6859 86.5842 26.6859C88.7331 26.6859 90.4483 25.4728 90.9154 24.2716H95.0433C93.6305 28.1216 90.7235 30.0737 86.3984 30.0737C80.593 30.0737 76.8411 26.3182 76.8411 20.5041ZM111.51 22.5953C111.51 26.3345 109.058 27.1189 107 27.1189C104.665 27.1189 103.53 26.2631 103.53 24.5061C103.53 22.475 105.121 21.8787 106.841 21.5376C107.235 21.4674 107.64 21.4126 108.032 21.3595L108.037 21.3589L108.101 21.3503L108.111 21.3489C109.339 21.1844 110.498 21.0292 111.11 20.5083L111.51 20.1689V22.5953ZM116.299 15.9633C116.299 12.603 113.545 10.9001 108.114 10.9001C101.031 10.9001 99.5735 14.4494 99.3562 16.667H104.15C104.403 14.8008 105.649 13.8548 107.855 13.8548C109.663 13.8548 111.51 14.183 111.51 16.6128C111.51 18.5383 109.304 18.7917 106.75 19.0838C106.234 19.1431 105.65 19.211 105.069 19.2944C99.4938 20.0341 98.7418 22.4527 98.7418 24.7218C98.7418 28.0735 101.094 30.0737 105.034 30.0737C106.895 30.0737 109.496 29.6862 111.318 27.8398L111.7 27.4523L111.733 27.9876C111.762 28.461 111.863 28.9791 112.041 29.5694H116.82C116.352 28.4516 116.299 26.4858 116.299 25.6584V15.9633ZM125.455 29.5692H120.667V4.30389H125.455V29.5692ZM135.072 4.29796H130.283V25.5861C130.283 29.2866 133.22 29.7849 136.092 29.7849C137.287 29.7849 138.218 29.7377 138.932 29.6389V26.1188C138.499 26.1866 138.063 26.2176 137.54 26.2176C135.625 26.2176 135.072 25.6797 135.072 23.8204V15.5765H138.932V11.4043H135.072V4.29796ZM147.559 13.9388C148.686 12.1775 151.088 10.8999 153.273 10.8999C156.622 10.8999 160.046 11.784 160.046 18.3422V29.5692H155.258V19.2795C155.258 15.9519 154.142 14.4672 151.64 14.4672C148.609 14.4672 147.316 16.1332 147.316 20.0365V29.5692H142.528V4.30389H147.316V14.3186L147.559 13.9388Z"
          fill="white"
        />
      </svg>
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
                </StTooltip>
              </StInput>
              <a
                v-if="
                  form.password.$errors &&
                  !form.password.$errors.includes('Incorrect password.')
                "
                class="forgot"
                @click="forgotPassword = true"
                >Forgot Password</a
              >
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
import { ref, onMounted, computed, watch } from 'vue';
import router from '@/router';
import CryptoService from '@/services/crypto';
import { useValidation } from 'vue3-form-validation';
import db from '@/db';
/* import Lottie from 'vue-lottie/src/lottie.vue'; */
/* import * as animationData from '@/assets/animation/logo.json'; */
import { useMainStore } from '@/store';

export default {
  name: 'StLock',
  /* components: {
    Lottie,
  }, */
  setup() {
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
    /* const animation = ref(null); // for saving the reference to the animation
    const lottieOptions = ref({
      animationData: animationData.default,
      render: 'svg',
      loop: false,
      autoplay: true,
    }); */

    const mainStore = useMainStore();

    const {
      form,
      // errors,
      // add,
      // submitting,
      validateFields,
      resetFields,
    } = useValidation(
      {
        password: {
          $value: password,
          $rules: [
            async (password) => {
              console.log('validirma', wrongAttempts.value);
              if (wrongAttempts.value >= 5) {
                return `Too many attempts. Try again in 30 seconds.`;
              }
              if (!password) {
                return '';
              }
              console.log('tu validira valjda');
              let isValid = await CryptoService.validatePassword(password);
              if (!isValid) {
                return 'Incorrect password.';
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
        console.log('ha!', wrongAttempts.value);
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
      console.log('aaaaa');
      if (wrongAttempts.value >= 5) {
        try {
          await validateFields();
        } catch (e) {
          console.log('e', e);
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
        console.log('e', e);
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

    /* function handleAnimation(anim) {
      animation.value = anim;
    } */

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
      /* handleAnimation,
      lottieOptions, */
      isLock,
      isVideoLoaded,
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
:deep .st-form-item__error {
  text-align: left;
}
</style>
