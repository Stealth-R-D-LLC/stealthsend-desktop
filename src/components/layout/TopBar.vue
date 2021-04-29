<template>
  <header class="default-layout__header">
    <div class="header-left">
      <StIcon name="chart"></StIcon>
      <StIcon name="tx-list"></StIcon>
    </div>
    <div class="header-right">
      <StIcon name="sync-status"></StIcon>
      <StIcon name="support"></StIcon>
      <StIcon name="notifications"></StIcon>
      <StIcon name="qr"></StIcon>
      <StIcon name="settings"></StIcon>
    </div>
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
  display: flex;
  justify-content: space-between;
}

.default-layout__header svg{
  margin: 0 10px;
}

.default-layout__header svg:hover{
  cursor: pointer
}


</style>
