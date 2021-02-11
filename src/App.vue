<template>
  <div class="default-layout">
    <MenuBar></MenuBar>
    <main class="default-layout__main">
      <TopBar></TopBar>
      <DefaultLayout></DefaultLayout>
      <StButton @click="clickHandler('dashboard')">Dash</StButton>
      <StButton @click="clickHandler('settings')">Settings</StButton>
      <StInput></StInput>
    </main>
  </div>
</template>

<script>
import MenuBar from '/~/components/layout/MenuBar.vue'
import DefaultLayout from '/~/components/layout/Default.vue'
import TopBar from '/~/components/layout/TopBar.vue'
import StButton from '/~/components/kit/StButton.vue'
import StInput from '/~/components/kit/StInput.vue'
import { useRouter } from 'vue-router'

export default {
  name: 'App',
  components: {
    StButton,
    StInput,
    MenuBar,
    TopBar,
    DefaultLayout, 
  },
  setup() {
    const router = useRouter()
    function clickHandler(route) {
      router.push('/' + route)
    }
    return {
      clickHandler,
    }
  },
}
</script>
