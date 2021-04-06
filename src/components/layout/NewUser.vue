<template>
  <div class="new-user-layout">
    <main class="new-user-layout__main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: 'TsNewuser',
  setup() {
    return {};
  },
};
</script>

<style scoped>
.new-user-layout {
  position: relative;
}
</style>
