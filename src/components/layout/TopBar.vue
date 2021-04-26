<template>
  <header class="default-layout__header">
    ovdje ide header koji nema smisla
  </header>
</template>

<script>
import pkgjson from '../../../package.json';
export default {
  setup() {
    let version = pkgjson.version;
    return { version };
  },
};
</script>

<style scoped>
 .default-layout__header {
   border-bottom: 1px solid var(--grey100);
 }
</style>