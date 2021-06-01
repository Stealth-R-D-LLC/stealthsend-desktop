<template>
  <aside
    id="aside-menu"
    class="layout__aside"
    :class="{
      width: !isCollapsed,
    }"
  >
    <nav>
      <ul>
        <li>
          <a class="item" @click.prevent="toggleMenu">
            <StArrow :open="!isCollapsed"></StArrow>
          </a>
        </li>
        <li>
          <router-link class="item" to="/dashboard">
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

            <span class="item__span"> Dashboard </span>
          </router-link>
        </li>
        <li>
          <router-link  class="item" to="/uikit">
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
            <span class="item__span"> UI Kit </span>
          </router-link>
        </li>
        <li @click="openModal('send')">
          <span class="item">
            <div class="icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 18 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1 11V16H17V11" stroke="#FAF9FC" stroke-width="2" />
                <path
                  d="M12 5L9 2L6 5"
                  stroke="#FAF9FC"
                  stroke-width="2"
                  stroke-linecap="square"
                />
                <path d="M9 2L9 12" stroke="#FAF9FC" stroke-width="2" />
              </svg>
            </div>
            <span class="item__span"> Send </span>
          </span>
        </li>
        <li @click="openModal('receive')">
          <span class="item">
            <div class="icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 18 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1 11V16H17V11" stroke="#FAF9FC" stroke-width="2" />
                <path
                  d="M6 8L9 11L12 8"
                  stroke="#FAF9FC"
                  stroke-width="2"
                  stroke-linecap="square"
                />
                <path d="M9 11V0" stroke="#FAF9FC" stroke-width="2" />
              </svg>
            </div>
            <span class="item__span"> Receive </span>
          </span>
        </li>
        <li>
          <router-link class="item" to="/transactions">
            <div class="icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 21 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 1H21"
                  stroke="#FAF9FC"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
                <path
                  d="M0 1H2"
                  stroke="#FAF9FC"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
                <path
                  d="M5 5H21"
                  stroke="#FAF9FC"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
                <path
                  d="M0 5H2"
                  stroke="#FAF9FC"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
                <path
                  d="M5 9H21"
                  stroke="#FAF9FC"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
                <path
                  d="M0 9H2"
                  stroke="#FAF9FC"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
                <path
                  d="M5 13H21"
                  stroke="#FAF9FC"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
                <path
                  d="M0 13H2"
                  stroke="#FAF9FC"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <span class="item__span"> Transactions </span>
          </router-link>
        </li>
        <li>
          <router-link class="item" to="/account/add">
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
          <router-link class="item" to="/account/archived">
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
        <li @click="toggleDrawer('address-book')">
          <span class="item">
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
          </span>
        </li>
      </ul>
    </nav>
    <router-link class="item__footer" to="/lock">
      <svg
        width="24"
        height="24"
        viewBox="0 0 16 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="1"
          y="8"
          width="14"
          height="8"
          stroke="#C3A9FB"
          stroke-width="2"
        />
        <path
          d="M3 8H13V3C13 1.89543 12.1046 1 11 1H5C3.89543 1 3 1.89543 3 3V8Z"
          stroke="#C3A9FB"
          stroke-width="2"
        />
        <path d="M8 11V13" stroke="#C3A9FB" stroke-width="2" />
      </svg>
    </router-link>
  </aside>
</template>

<script>
import { ref, defineComponent } from 'vue';
import StArrow from '@/components/elements/StArrow';
import { useRouter } from 'vue-router';
import { useMainStore } from '@/store';

export default defineComponent({
  name: 'StMenuBar',
  components: {
    StArrow,
  },
  setup() {
    const mainStore = useMainStore();
    const router = useRouter();
    const isCollapsed = ref(true);

    router.afterEach(() => {
      !isCollapsed.value ? (isCollapsed.value = true) : null;
    });
    function toggleMenu() {
      isCollapsed.value = !isCollapsed.value;
    }

    function openModal(modal) {
      mainStore.SET_MODAL_VISIBILITY(modal, true);
    }
    function toggleDrawer(canvas) {
      mainStore.SET_CURRENT_CANVAS(canvas);
      mainStore.TOGGLE_DRAWER(true);
    }

    return {
      isCollapsed,
      toggleMenu,
      openModal,
      toggleDrawer,
    };
  },
});
</script>

<style scoped>
.layout__aside {
  width: 75px;
  transition: 0.3s;
}

.animate_width {
  transition: width 0.5s ease-out;
}

.layout__aside.width {
  width: 280px;
}

.layout__aside nav {
  margin-top: 30px;
}

.layout__aside .item__footer {
  position: fixed;
  padding: 12px 0;
  text-decoration: none;
  padding-left: 24px;
  bottom: 32px;
}

.layout__aside li {
  display: block;
  cursor: pointer;
  position: relative;
}

.layout__aside li:first-child {
  margin-bottom: 120px;
}

.layout__aside .item {
  display: block;
}

.layout__aside .icon {
  display: flex;
  width: 1.5rem;
  align-items: center;
  justify-content: center;
}

.layout__aside li svg {
  width: 1.5rem;
  height: 1.5rem;
}

.layout__aside .item {
  padding: 12px 0;
  text-decoration: none;
  padding-left: 24px;
  display: flex;
  align-items: center;
}

.layout__aside .item span {
  width: 100%;
  overflow: hidden;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: 0.12px;
  color: var(--hampton50);
  margin-left: 42px;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
  white-space: nowrap;
}

.layout__aside .item.router-link-exact-active svg path {
  stroke: var(--marine200);
}

.layout__aside .item.router-link-exact-active span {
  color: var(--marine200);
}

.layout__aside li:hover span,
.layout__aside li:hover svg path {
  stroke: var(--marine200);
  color: var(--marine200);
}

@keyframes animate-width {
  0%,
  10% {
    width: 280px;
  }
  100% {
    width: 75px;
  }
}

@keyframes animate-full-width {
  0%,
  30% {
    width: 75px;
  }
  100% {
    width: 280px;
  }
}
</style>
