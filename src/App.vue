<template>
  <div class="body__inner" style="background: pink">
    <TopBar />
    <!-- [ HERE COMES YOUR CONTENT ] -->
    <transition name="fade" appear>
      <div>aaaaaaa</div>
    </transition>
  </div>
</template>

<script>
import TopBar from '/~/components/layout/TopBar.vue'

export default {
  name: 'App',
  components: {
    TopBar,
  },
}
</script>
