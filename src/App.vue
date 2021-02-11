<template>
  <div class="default-layout">
    <aside class="default-layout__aside">lijesvo</aside>
    <main class="default-layout__main">
      <header class="default-layout__header">headeraaa</header>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <StButton @click="clickHandler">Button</StButton>
      <StInput></StInput>
    </main>
  </div>
</template>

<script>
import StButton from '/~/components/kit/StButton.vue'
import StInput from '/~/components/kit/StInput.vue'

export default {
  name: 'App',
  components: {
    StButton,
    StInput,
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
