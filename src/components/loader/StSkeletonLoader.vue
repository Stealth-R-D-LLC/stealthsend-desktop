<template>
  <div class="loader">
    <template v-if="props.type === 'cards'">
      <div v-for="card in 10" :key="card" class="loader__cards gradient" />
    </template>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.gradient {
  animation-duration: 2s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: placeHolderShimmer;
  animation-timing-function: linear;
  background: #eaeaea;
  background: linear-gradient(to right, #eaeaea 8%, #d5d5d5 38%, #eaeaea 54%);
  background-size: 1000px 640px;
  position: relative;
  border-radius: 4px;
}

@keyframes placeHolderShimmer {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
}

.loader .loader__cards {
  width: 100%;
  height: 132px;
}
.loader .loader__cards:not(:last-child) {
  margin-bottom: 10px;
}
</style>
