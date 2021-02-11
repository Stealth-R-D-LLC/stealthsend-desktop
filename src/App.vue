<template>
  <div class="default-layout">
    <header class="default-layout__header">headeraaa</header>
    <main class="default-layout__main">
      <aside class="default-layout__aside">lijesvo</aside>
      <div class="default-layout__main">
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
      </div>
    </main>
  </div>
</template>

<script>
import StButton from '/~/components/kit/StButton.vue'

export default {
  name: 'App',
  components: {
    StButton,
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
