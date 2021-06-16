<template>
  <div class="lock-container">
    <img src="@/assets/welcome.png" alt="lock" />
    <div class="overlay"></div>
    <div class="lock-container__inner">
      <div class="logo">
        <svg
          width="161"
          height="37"
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
      </div>
      <div class="box" :class="{ 'box-animated': isAnimated }">
        <template v-if="isAnimated">
          <h3>Welcome back</h3>
          <h4>Enter your password to continue</h4>
          <form class="form" @submit.prevent>
            <StFormItem color="dark" label="Password">
              <StInput
                id="password"
                v-model="password"
                placeholder="··········"
                :type="showPassword ? 'text' : 'password'"
              >
                <div v-if="password" @click="showPassword = !showPassword">
                  <svg
                    :class="{ 'icon-active': showPassword }"
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
                      stroke="#FEFEFE"
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
                </div>
              </StInput>
            </StFormItem>
            <StButton color="white" @click="handlePassword">Continue</StButton>
          </form>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import router from '@/router';
import CryptoService from '@/services/crypto';
export default {
  name: 'StLock',
  components: {},
  setup() {
    const isAnimated = ref(false);
    const password = ref('');
    const showPassword = ref(false);

    onMounted(() => {
      setTimeout(() => {
        isAnimated.value = true;
        setTimeout(
          () =>
            document
              .getElementById('password')
              .getElementsByClassName('st-input__inner')[0]
              .focus(),
          500
        );
      }, 2000);
    });

    const handlePassword = async () => {
      let isPasswordMatch = false;
      isPasswordMatch = await CryptoService.validatePassword(password.value);
      if (isPasswordMatch) {
        await CryptoService.unlock(password.value);
        router.push('/dashboard');
      } else {
        console.log('wrong password!');
      }
    };
    return {
      showPassword,
      isAnimated,
      password,
      handlePassword,
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
  overflow: hidden;
  transition: 0.7s;
}
.lock-container .box-animated {
  height: 100%;
}
h3 {
  margin-top: 79px;
  margin-bottom: 40px;
  color: var(--white);
}
h4 {
  margin-bottom: 86px;
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
  height: calc(100% - 270px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
svg path,
svg circle {
  transition: 0.3s;
}
.icon-active path {
  stroke: var(--marine500) !important;
}
.icon-active circle {
  stroke: var(--background0) !important;
}
</style>
