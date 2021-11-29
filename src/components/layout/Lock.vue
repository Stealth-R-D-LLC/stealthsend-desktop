<template>
  <div class="lock-layout">
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script></script>

<style scoped>
.lock-layout {
  height: 100%;
}
</style>
