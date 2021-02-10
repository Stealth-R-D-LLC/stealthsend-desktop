<template>
  <div class="body__inner" style="background: pink">
    <TopBar />
    <transition name="fade" appear>
      <div>aaa222aaaa</div>
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
