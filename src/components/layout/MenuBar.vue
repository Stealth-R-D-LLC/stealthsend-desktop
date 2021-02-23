<template>
  <aside class="default-layout__aside">
    <nav>
      <ul>
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

<style scoped>
/* background: pink;
 */
.default-layout__aside nav {
  margin-top: 80px;
}
.default-layout__aside li {
  margin-top: 20px;
  padding: 0 18px;
}
.default-layout__aside .item {
  padding: 12px 0;
  width: 100%;
}
.default-layout__aside .router-link-exact-active {
  background-color: var(--marine200);
}
</style>
