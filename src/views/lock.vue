<template>
  <div class="lock-container">
    <transition name="fade">
      <StLoading :visibility="isLoading" :opaque="true"></StLoading>
    </transition>
    <div class="unlock-form">
      <StInput
        v-if="isPasswordFieldVisible"
        v-model="password"
        label="Password"
        placeholder="··········"
        type="password"
        @keyup="handlePassword"
      ></StInput>
      <br />
      <StButton
        v-if="!isPasswordFieldVisible"
        @click="isPasswordFieldVisible = true"
        >Unlock</StButton
      >
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import StLoading from '@/components/kit/StLoading.vue'
import router from '@/router'
import CryptoService from '@/services/crypto'
export default {
  name: 'StLock',
  components: {
    StLoading
  },
  setup() {
    const isLoading = ref(true)
    const isPasswordFieldVisible = ref(false)
    const password = ref('')
    setTimeout(() => {
      isLoading.value = false
    }, 1500)

    const handlePassword = async (e) => {
      let isPasswordMatch = false;
      console.log('password entered: ', password.value, e.keyCode);
      if (e.keyCode === 13) {
        // handle enter
        // TODO: validate pass
        isPasswordMatch = await CryptoService.validatePassword(password.value)
        if (isPasswordMatch) {
          router.push('/dashboard')
        } else {
          console.log('wrong password!');
        }
      }
    }
    return {
      isLoading,
      isPasswordFieldVisible,
      password,
      handlePassword
    }
  }
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
  width: 100%;
  height: 100%;
}
.unlock-form {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
