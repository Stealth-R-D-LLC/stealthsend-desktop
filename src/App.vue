<template>
  <div class="default-layout">
    <MenuBar></MenuBar>
    <main class="default-layout__main">
      <TopBar></TopBar>
      <DefaultLayout></DefaultLayout>
    </main>
  </div>
</template>

<script>
import MenuBar from '/~/components/layout/MenuBar.vue'
import DefaultLayout from '/~/components/layout/Default.vue'
import TopBar from '/~/components/layout/TopBar.vue'
import { useRouter } from 'vue-router'

export default {
  name: 'App',
  components: {
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


