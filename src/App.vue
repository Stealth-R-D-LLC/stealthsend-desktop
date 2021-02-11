<template>
  <div class="default-layout">
    <MenuBar></MenuBar>
    <main class="default-layout__main">
      <TopBar></TopBar>
      <p>aaa</p>
      <StButton @click="clickHandler">Button</StButton>
      <StInput></StInput>
    </main>
  </div>
</template>

<script>
import MenuBar from '/~/components/layout/MenuBar.vue'
import TopBar from '/~/components/layout/TopBar.vue'
import StButton from '/~/components/kit/StButton.vue'
import StInput from '/~/components/kit/StInput.vue'

export default {
  name: 'App',
  components: {
    StButton,
    StInput,
    MenuBar,
    TopBar,
  },
  setup() {
    function clickHandler() {
      console.log('--> clicked!')
    }
    return {
      clickHandler,
    }
  },
}
</script>
