<template>
  <div class="accounts-container">
    <div class="accounts-container__overflow">
      <div class="accounts-container__content">
        <accounts></accounts>
      </div>
    </div>
  </div>
</template>

<script>
import accounts from '@/components/partials/accounts.vue';
export default {
  name: 'StArchivedAccounts',
  components: {
    accounts,
  },
};
</script>

<style scoped>
.accounts-container {
  height: calc(100vh - 92px);
}
.accounts-container__overflow {
  height: 100%;
  overflow: auto;
  overflow-x: hidden;
}
.accounts-container__overflow::-webkit-scrollbar {
  width: 4px;
}
.accounts-container__overflow:hover::-webkit-scrollbar-thumb {
  background: var(--grey100);
}
.accounts-container__overflow::-webkit-scrollbar-thumb {
  background: transparent;
}
.accounts-container__content {
  background: var(--background50);
  padding: 0 28px 0;
  height: 100%;
}

.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 1s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
