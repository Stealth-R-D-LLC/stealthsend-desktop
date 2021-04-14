<template>
  <aside class="default-layout__aside" :class="{ width: isCollapsed }">
    <nav>
      <ul>
        <li @click.prevent="isCollapsed = !isCollapsed">
          <a href="" class="item">
            <StHamburger :open="!isCollapsed"></StHamburger>
          </a>
        </li>
        <li>
          <router-link tag="a" class="item" to="/dashboard">
            <div class="icon">
              <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 13H1v8h8v-8zM21 13h-8v8h8v-8z"
                stroke="#FAF9FC"
                stroke-width="2"
              />
              <path
                d="M1 9h8M1 5h8"
                stroke="#FAF9FC"
                stroke-width="2"
                stroke-linecap="square"
              />
              <path d="M21 1h-8v8h8V1z" stroke="#FAF9FC" stroke-width="2" />
            </svg>
            </div>

            <span class="item__span"> Account Balances </span>
          </router-link>
        </li>
        <li>
          <router-link tag="a" class="item" to="/uikit">
          <div class="icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 17.5H22" stroke="#FAF9FC" stroke-width="2" />
              <path d="M17 12.5V22.5" stroke="#FAF9FC" stroke-width="2" />
              <path d="M0 9.5H10" stroke="#FAF9FC" stroke-width="2" />
              <path d="M0 5.5H10" stroke="#FAF9FC" stroke-width="2" />
              <path
                d="M9 13.5H1V21.5H9V13.5Z"
                stroke="#FAF9FC"
                stroke-width="2"
              />
              <path
                d="M21 1.5H13V9.5H21V1.5Z"
                stroke="#FAF9FC"
                stroke-width="2"
              />
            </svg>
          </div>
            <span class="item__span"> UI Kit </span>
          </router-link>
        </li>
                <li>
          <router-link tag="a" class="item" to="/account/add">
          <div class="icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 17.5H22" stroke="#FAF9FC" stroke-width="2" />
              <path d="M17 12.5V22.5" stroke="#FAF9FC" stroke-width="2" />
              <path d="M0 9.5H10" stroke="#FAF9FC" stroke-width="2" />
              <path d="M0 5.5H10" stroke="#FAF9FC" stroke-width="2" />
              <path
                d="M9 13.5H1V21.5H9V13.5Z"
                stroke="#FAF9FC"
                stroke-width="2"
              />
              <path
                d="M21 1.5H13V9.5H21V1.5Z"
                stroke="#FAF9FC"
                stroke-width="2"
              />
            </svg>
          </div>
            <span class="item__span"> Add Account </span>
          </router-link>
        </li>
        <li>
          <router-link tag="a" class="item" to="/send">
          <div class="icon">
            <svg width="24" height="24" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 11V16H17V11" stroke="#FAF9FC" stroke-width="2"/>
              <path d="M12 5L9 2L6 5" stroke="#FAF9FC" stroke-width="2" stroke-linecap="square"/>
              <path d="M9 2L9 12" stroke="#FAF9FC" stroke-width="2"/>
            </svg>
          </div>

            <!-- <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.5V6.5H16V1.5L1 1.5V18.5H19L19 16.5"
                stroke="#FAF9FC"
                stroke-width="2"
              />
              <path d="M9 18.5V6.5H16" stroke="#FAF9FC" stroke-width="2" />
              <path
                d="M22 9.5L25 12.5L22 15.5"
                stroke="#FAF9FC"
                stroke-width="2"
                stroke-linecap="square"
              />
              <path d="M14 12.5H25" stroke="#FAF9FC" stroke-width="2" />
            </svg> -->
            <span class="item__span"> Send </span>
          </router-link>
        </li>
        <li>
          <router-link tag="a" class="item" to="/receive">
          <div class="icon">
          <svg width="24" height="24" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 11V16H17V11" stroke="#FAF9FC" stroke-width="2"/>
            <path d="M6 8L9 11L12 8" stroke="#FAF9FC" stroke-width="2" stroke-linecap="square"/>
            <path d="M9 11V0" stroke="#FAF9FC" stroke-width="2"/>
          </svg>
          </div>
            <!-- <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 3.5H1V20.5H19V8.5H16V3.5H13"
                stroke="#FAF9FC"
                stroke-width="2"
              />
              <path d="M9 20.5V14.5" stroke="#FAF9FC" stroke-width="2" />
              <path
                d="M12 8.5L9 11.5L6 8.5"
                stroke="#FAF9FC"
                stroke-width="2"
                stroke-linecap="square"
              />
              <path
                d="M9 1.5V10.5"
                stroke="#FAF9FC"
                stroke-width="2"
                stroke-linecap="square"
              />
            </svg> -->
            <span class="item__span"> Receive </span>
          </router-link>
        </li>
                <li>
          <router-link tag="a" class="item" to="/transactions">
          <div class="icon">
          <svg width="24" height="24" viewBox="0 0 21 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 1H21" stroke="#FAF9FC" stroke-width="2" stroke-linejoin="round"/>
            <path d="M0 1H2" stroke="#FAF9FC" stroke-width="2" stroke-linejoin="round"/>
            <path d="M5 5H21" stroke="#FAF9FC" stroke-width="2" stroke-linejoin="round"/>
            <path d="M0 5H2" stroke="#FAF9FC" stroke-width="2" stroke-linejoin="round"/>
            <path d="M5 9H21" stroke="#FAF9FC" stroke-width="2" stroke-linejoin="round"/>
            <path d="M0 9H2" stroke="#FAF9FC" stroke-width="2" stroke-linejoin="round"/>
            <path d="M5 13H21" stroke="#FAF9FC" stroke-width="2" stroke-linejoin="round"/>
            <path d="M0 13H2" stroke="#FAF9FC" stroke-width="2" stroke-linejoin="round"/>
          </svg>
          </div>

            <!-- <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 23H2C2.27477 18.4999 2.89237 15.6416 3.85279 14.4251C4.64988 13.4154 5.69891 12.7108 6.9999 12.3306"
                stroke="#EAEAEA"
                stroke-width="2"
              />
              <path
                d="M17 19H23"
                stroke="#EAEAEA"
                stroke-width="2"
                stroke-linecap="square"
              />
              <path
                d="M17 15H23"
                stroke="#EAEAEA"
                stroke-width="2"
                stroke-linecap="square"
              />
              <path
                d="M10 13C13.3137 13 16 10.3137 16 7C16 3.68629 13.3137 1 10 1C6.68629 1 4 3.68629 4 7C4 10.3137 6.68629 13 10 13Z"
                stroke="#EAEAEA"
                stroke-width="2"
              />
            </svg> -->

            <span class="item__span"> Transactions </span>
          </router-link>
        </li>
        <li>
          <router-link tag="a" class="item" to="/account/archived">
          <div class="icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 20H22" stroke="#FCFAFF" stroke-width="2" />
              <path d="M12 16H22" stroke="#FCFAFF" stroke-width="2" />
              <path d="M9 13H1V21H9V13Z" stroke="#FCFAFF" stroke-width="2" />
              <path d="M12 8H22" stroke="#FCFAFF" stroke-width="2" />
              <path d="M12 4H22" stroke="#FCFAFF" stroke-width="2" />
              <path d="M9 1H1V9H9V1Z" stroke="#FCFAFF" stroke-width="2" />
            </svg>
          </div>
            <span class="item__span"> Archive </span>
          </router-link>
        </li>
        <!-- <li>
          <router-link tag="a" class="item" to="/settings">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 13H22" stroke="#FCFAFF" stroke-width="2" />
              <path
                d="M4.5 17C6.433 17 8 15.433 8 13.5C8 11.567 6.433 10 4.5 10C2.567 10 1 11.567 1 13.5C1 15.433 2.567 17 4.5 17Z"
                stroke="#FCFAFF"
                stroke-width="2"
              />
              <path d="M0 4H9" stroke="#FCFAFF" stroke-width="2" />
              <path
                d="M17.5 8C19.433 8 21 6.433 21 4.5C21 2.567 19.433 1 17.5 1C15.567 1 14 2.567 14 4.5C14 6.433 15.567 8 17.5 8Z"
                stroke="#FCFAFF"
                stroke-width="2"
              />
              <path d="M9 21H22" stroke="#FCFAFF" stroke-width="2" />
            </svg>
            <span class="item__span"> Settings </span>
          </router-link>
        </li> -->
        <li>
          <router-link tag="a" class="item" to="/address-book">
            <div class="icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 23H2C2.27477 18.4999 2.89237 15.6416 3.85279 14.4251C4.64988 13.4154 5.69891 12.7108 6.9999 12.3306"
                stroke="#EAEAEA"
                stroke-width="2"
              />
              <path
                d="M17 19H23"
                stroke="#EAEAEA"
                stroke-width="2"
                stroke-linecap="square"
              />
              <path
                d="M17 15H23"
                stroke="#EAEAEA"
                stroke-width="2"
                stroke-linecap="square"
              />
              <path
                d="M10 13C13.3137 13 16 10.3137 16 7C16 3.68629 13.3137 1 10 1C6.68629 1 4 3.68629 4 7C4 10.3137 6.68629 13 10 13Z"
                stroke="#EAEAEA"
                stroke-width="2"
              />
            </svg>
            </div>

            <span class="item__span"> Address Book </span>
          </router-link>
        </li>
      </ul>
    </nav>
    <router-link tag="a" class="item__footer" to="/lock">
          <svg width="24" height="24" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="8" width="14" height="8" stroke="#C3A9FB" stroke-width="2"/>
            <path d="M3 8H13V3C13 1.89543 12.1046 1 11 1H5C3.89543 1 3 1.89543 3 3V8Z" stroke="#C3A9FB" stroke-width="2"/>
            <path d="M8 11V13" stroke="#C3A9FB" stroke-width="2"/>
          </svg>
      </router-link>
  </aside>
</template>

<script>
import { ref } from 'vue';
import StHamburger from '@/components/elements/StHamburger';
export default {
  name: 'StMenuBar',
  components: {
    StHamburger,
  },
  setup() {
    const isCollapsed = ref(false);

    return {
      isCollapsed,
    };
  },
};
</script> 

<style scoped>
.default-layout__aside {
  transition: width 0.5s ease-out;
  animation: animate-width 1.2s 1 ease-in-out;
  /* position: relative; */
}
.default-layout__aside.width {
  width: 75px;
}

.default-layout__aside.width .item span {
  width: 0;
  opacity: 0;
  margin: 0;
}

.default-layout__aside nav {
  margin-top: 30px;
}

.default-layout__aside .item__footer{
  position: fixed;
  padding: 12px 0;
  text-decoration: none;
  padding-left: 24px;
  bottom: 32px;
}

.default-layout__aside li {
  display: block;
  cursor: pointer;
  position: relative;
}

.default-layout__aside li:first-child {
  margin-bottom: 120px;
}

.default-layout__aside .item {
  display: block;
}

.default-layout__aside .icon {
  display: flex;
  width: 1.5rem;
  align-items: center;
  justify-content: center;
}

.default-layout__aside li svg {
  width: 1.5rem;
  height: 1.5rem;
}

.default-layout__aside .item {
  padding: 12px 0;
  text-decoration: none;
  padding-left: 24px;
  display: flex;
  align-items: center;
}

.default-layout__aside .item span {
  width: 100%;
  overflow: hidden;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: 0.12px;
  color:var(--hampton50);
  margin-left: 42px;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
  white-space: nowrap;
}

.default-layout__aside .item.router-link-exact-active svg path {
  stroke: var(--marine200);
}

.default-layout__aside .item.router-link-exact-active span {
  color: var(--marine200);
}

.default-layout__aside li:hover span, 
.default-layout__aside li:hover svg path {
  stroke: var(--marine200);
  color: var(--marine200);
}


@keyframes animate-width {
  0%,
  40% {
    width: 72px;
  }
  100% {
    width: 280px;
  }
}
</style>
