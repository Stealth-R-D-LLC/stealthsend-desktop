<template>
  <div class="lock-layout">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.lock-layout {
  height: 100%;
}
</style>
