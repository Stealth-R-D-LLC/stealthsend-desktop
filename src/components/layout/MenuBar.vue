<template>
  <aside class="default-layout__aside" :class="{ width: isCollapsed }">
    <nav>
      <ul>
        <li @click="isCollapsed = !isCollapsed">
          <span class="item">
            <p>Collapse</p>
          </span>
        </li>
        <li>
          <router-link class="item" to="/dashboard">
            <p>Account Balances</p>
          </router-link>
        </li>
        <li>
          <router-link class="item" to="/uikit">
            <p>UI Kit</p>
          </router-link>
        </li>
        <li>
          <router-link class="item" to="/settings"><p>Send</p></router-link>
        </li>
        <li>
          <router-link class="item" to="/settings"><p>Receive</p></router-link>
        </li>
        <li>
          <router-link class="item" to="/add-account"
            ><p>Add Account</p></router-link
          >
        </li>
        <li>
          <router-link class="item" to="/settings"><p>Archive</p></router-link>
        </li>
        <li>
          <router-link class="item" to="/settings"
            ><p>Address Book</p></router-link
          >
        </li>
        <li>
          <router-link class="item" to="/settings"><p>Settings</p></router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'StMenuBar',
  setup() {
    const isCollapsed = ref(false)

    return {
      isCollapsed
    }
  }
}
</script>

<style lang="postcss">
.default-layout__aside {
  transition: width 0.5s ease-out;
  animation: animate-width 1.2s 1 ease-in-out;
}
.default-layout__aside nav {
  margin-top: 136px;
}
.default-layout__aside li {
  margin-top: 20px;
  padding: 0 24px;
}
.default-layout__aside .item {
  padding: 12px 0;
  width: 100%;
  text-decoration: none;
}

.default-layout__aside .item p {
  font-size: 18px;
  line-height: 24px;
  letter-spacing: 0.12px;
  color: #fcfaff;
}
.default-layout__aside .router-link-exact-active {
  background-color: var(--marine200);
}

.width {
  width: 148px;
}

@keyframes animate-width {
  0%,40% { width: 148px; }
    100% { width: 280px;}
}
</style>
