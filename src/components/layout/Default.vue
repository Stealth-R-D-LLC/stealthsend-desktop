<template>
  <div class="container">
    <!-- <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition> -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>
export default {
  name: 'TsDefault',
  setup() {
    return {}
  },
}
</script>

<style scoped></style>
