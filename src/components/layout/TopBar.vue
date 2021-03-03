<template>
  <header class="default-layout__header">
    <!-- Welcome, Matej {{version}} -->
  </header>
</template>

<script>
import pkgjson from '../../../package.json'
export default {
  setup() {
    let version = pkgjson.version
    return { version }
  }
}
</script>