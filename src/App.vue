<template>
  <div class="body__inner" style="background: pink">
    <div class="body__inner--bla">aaa</div>
    <TopBar />
    <transition name="fade" appear>
      <div>aaa222aaaaaaa222aaaaaaa222aaaaaaa222aaaaaaa222aaaaaaa222aaaaaaa222aaaaaaa222aaaaaaa222aaaaaaa222aaaa</div>
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
