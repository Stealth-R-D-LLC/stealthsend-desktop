<template>
  <aside class="default-layout__aside" :class="{ width: isCollapsed }">
    <nav>
      <ul>
        <li @click.prevent="isCollapsed = !isCollapsed">
          <a href="" class="item">
            <svg
              width="21"
              height="16"
              viewBox="0 0 21 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 15H21"
                stroke="#FCFAFF"
                stroke-width="2"
                stroke-linejoin="round"
              />
              <path
                d="M0 1H21"
                stroke="#FCFAFF"
                stroke-width="2"
                stroke-linejoin="round"
              />
            </svg>
            <span>
              Collapse
            </span>
          </a>
        </li>
        <li>
          <router-link tag="a" class="item" to="/dashboard">
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 13H1v8h8v-8zM21 13h-8v8h8v-8z"
                stroke="#FCFAFF"
                stroke-width="2"
              />
              <path
                d="M1 9h8M1 5h8"
                stroke="#FCFAFF"
                stroke-width="2"
                stroke-linecap="square"
              />
              <path d="M21 1h-8v8h8V1z" stroke="#FCFAFF" stroke-width="2" />
            </svg>

            <span>
              Account Balances
            </span>
          </router-link>
        </li>
        <li>
          <router-link tag="a" class="item" to="/uikit">
            <svg
              width="22"
              height="23"
              viewBox="0 0 22 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 17.5H22" stroke="#FCFAFF" stroke-width="2" />
              <path d="M17 12.5V22.5" stroke="#FCFAFF" stroke-width="2" />
              <path d="M0 9.5H10" stroke="#FCFAFF" stroke-width="2" />
              <path d="M0 5.5H10" stroke="#FCFAFF" stroke-width="2" />
              <path
                d="M9 13.5H1V21.5H9V13.5Z"
                stroke="#FCFAFF"
                stroke-width="2"
              />
              <path
                d="M21 1.5H13V9.5H21V1.5Z"
                stroke="#FCFAFF"
                stroke-width="2"
              />
            </svg>
            <span>
              UI Kit
            </span>
          </router-link>
        </li>
        <li>
          <router-link tag="a" class="item" to="/settings">
            <svg
              width="27"
              height="20"
              viewBox="0 0 27 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.5V6.5H16V1.5L1 1.5V18.5H19L19 16.5"
                stroke="#FCFAFF"
                stroke-width="2"
              />
              <path d="M9 18.5V6.5H16" stroke="#FCFAFF" stroke-width="2" />
              <path
                d="M22 9.5L25 12.5L22 15.5"
                stroke="#FCFAFF"
                stroke-width="2"
                stroke-linecap="square"
              />
              <path d="M14 12.5H25" stroke="#FCFAFF" stroke-width="2" />
            </svg>
            <span>
              Send
            </span>
          </router-link>
        </li>
        <li>
          <router-link tag="a" class="item" to="/settings">
            <svg
              width="20"
              height="22"
              viewBox="0 0 20 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 3.5H1V20.5H19V8.5H16V3.5H13"
                stroke="#FCFAFF"
                stroke-width="2"
              />
              <path d="M9 20.5V14.5" stroke="#FCFAFF" stroke-width="2" />
              <path
                d="M12 8.5L9 11.5L6 8.5"
                stroke="#FCFAFF"
                stroke-width="2"
                stroke-linecap="square"
              />
              <path
                d="M9 1.5V10.5"
                stroke="#FCFAFF"
                stroke-width="2"
                stroke-linecap="square"
              />
            </svg>
            <span>
              Receive
            </span>
          </router-link>
        </li>
        <li>
          <router-link tag="a" class="item" to="/add-account">
            <svg
              width="22"
              height="23"
              viewBox="0 0 22 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 17.5H22" stroke="#FCFAFF" stroke-width="2" />
              <path d="M17 12.5V22.5" stroke="#FCFAFF" stroke-width="2" />
              <path d="M0 9.5H10" stroke="#FCFAFF" stroke-width="2" />
              <path d="M0 5.5H10" stroke="#FCFAFF" stroke-width="2" />
              <path
                d="M9 13.5H1V21.5H9V13.5Z"
                stroke="#FCFAFF"
                stroke-width="2"
              />
              <path
                d="M21 1.5H13V9.5H21V1.5Z"
                stroke="#FCFAFF"
                stroke-width="2"
              />
            </svg>
            <span>
              Add Account
            </span>
          </router-link>
        </li>
        <li>
          <router-link tag="a" class="item" to="/settings">
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
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
            <span>
              Archive
            </span>
          </router-link>
        </li>
        <li>
          <router-link tag="a" class="item" to="/settings">
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

            <span>
              Address Book
            </span>
          </router-link>
        </li>
        <li>
          <router-link tag="a" class="item" to="/settings">
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
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
            <span>
              Settings
            </span>
          </router-link>
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

<style scoped>
.default-layout__aside {
  transition: width 0.5s ease-out;
  animation: animate-width 1.2s 1 ease-in-out;
}
.default-layout__aside.width {
  width: 72px;
}

.default-layout__aside.width .item span {
  opacity: 0;
  right: 0;
  /* overflow: hidden; */
  transition: opacity 0.5;
}
.default-layout__aside nav {
  margin-top: 136px;
}
.default-layout__aside li {
  display: block;
  /* align-items: center;
  justify-content: center; */
  cursor: pointer;
  height: 26px;
  padding: 14px 0;
  position: relative;
}

.default-layout__aside .item {
  display: block;
  /* position: relative; */
}

.default-layout__aside li:hover,
.default-layout__aside li a *:hover,
.default-layout__aside li a svg*:hover {
  color: var(--success);
  transition: color 0.2s;
}
.default-layout__aside li svg path:hover {
  stroke: var(--success) !important;
  transition: stroke 0.2s !important;
}
.default-layout__aside .item {
  padding: 12px 0;
  /* width: 100%; */
  text-decoration: none;
  padding-left: 24px;
  position: relative;
}

/* .default-layout__aside .item p {} */
.default-layout__aside .item span {
  position: absolute;
  /* display: inline-block; */
  /* right: 0; */
  overflow: hidden;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: 0.12px;
  color: #fcfaff;
  margin-left: 42px;
  opacity: 1;
  transition: opacity 0.5;
}

.default-layout__aside .router-link-exact-active {
  background-color: var(--marine800);
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
