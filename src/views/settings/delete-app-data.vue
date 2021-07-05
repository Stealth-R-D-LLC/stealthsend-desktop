<template>
  <div class="st-settings-child st-password-container">
    <div class="st-settings-child__overflow">
      <h2 class="title">Delete App Data</h2>
      <p class="subtitle">Reset StealthSend</p>
      <div class="content" :class="{ content__full: isCleared }">
        <template v-if="!isCleared">
          <p class="desc">
            All of your accounts and your private keys are backed up by your
            Recovery Phrase.
          </p>
          <p class="desc">
            If you clear your Stealthsend application data, the only way to
            regain access to your Stealth accounts is to restore from the
            Recovery Phrase.
          </p>
          <div class="box-grey">
            <p class="bold">Important note</p>
            <p>
              Locally stored data such as account names, transaction labels and
              contacts cannot be recovered after clearing tha app data.
            </p>
            <p>Are you sure you want to proceed and delete all app data?</p>
          </div>
        </template>
        <template v-else>
          <div class="progress-container">
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
                    dur="5.6s"
                  ></animate>
                </circle>
              </svg>
              <div class="overlay-progress">{{ counter }}s</div>
            </div>
          </div>
        </template>
        <div class="button-container">
          <StButton v-if="!isCleared" @click="clearAppData"
            >Clear App Data</StButton
          >
          <StButton v-else @click="cancelClearAppData">Cancel</StButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import db from '@/db';
import router from '@/router';
export default {
  setup() {
    const isCleared = ref(false);
    const timeout = ref(null);
    const counterTimeout = ref(null);
    const counter = ref(5);

    function countdown() {
      counter.value -= 1;
      counterTimeout.value = setTimeout(() => countdown(), 1000);
    }
    function clearAppData() {
      isCleared.value = true;
      countdown();
      timeout.value = setTimeout(async () => {
        await db.dropInstance();
        localStorage.clear();
        isCleared.value = false;
        clearTimeout(counterTimeout.value);
        counter.value = 5;
        router.push('/welcome');
      }, 5000);
    }
    function cancelClearAppData() {
      clearTimeout(timeout.value);
      clearTimeout(counterTimeout.value);
      counter.value = 5;
      isCleared.value = false;
    }

    return {
      // VARIABLES
      counter,
      isCleared,

      // FUNCTIONS
      countdown,
      clearAppData,
      cancelClearAppData,
    };
  },
};
</script>

<style scoped>
.subtitle {
  margin-bottom: 28px;
}
.content {
  height: calc(100% - 88px);
}
.content__full {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.content .desc + .desc {
  margin-top: 24px;
}
.box-grey {
  margin-top: 28px;
  padding: 24px;
  background-color: var(--background100);
  border-radius: 4px;
}
.box-grey p + p {
  margin-top: 24px;
}
.button-container {
  margin-top: 62px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.progress-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.progress-animated {
  position: relative;
  top: -2px;
  left: -2px;
  width: 104px;
  height: 104px;
}
.progress {
  margin: 0 auto;
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
</style>
