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
          <router-link class="item" to="/settings"
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

<style scoped lang="postcss">
.default-layout__aside {
  /* background: pink; */
  nav {
    margin-top: 80px;
  }

  li {
    margin-top: 20px;
    padding: 0 18px;
  }

  .item {
    padding: 12px 0;
    width: 100%;
  }

  .router-link-exact-active {
    background-color: var(--marine200);
  }
}
</style>
