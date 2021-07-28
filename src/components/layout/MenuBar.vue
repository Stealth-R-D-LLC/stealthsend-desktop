<template>
  <aside
    id="aside-menu"
    class="layout__aside"
    :class="[
      { width: isCollapsed || menuExpanded },
      { 'layout__aside--fixed': !menuExpanded },
    ]"
  >
    <nav>
      <ul>
        <li v-if="!menuExpanded">
          <a
            class="item"
            :class="{ 'item-active': isCollapsed }"
            @click.prevent="toggleMenu"
          >
            <svg
              width="19"
              height="14"
              viewBox="0 0 19 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 7H17" stroke="#FAF9FC" stroke-width="2" />
              <path d="M11 13L17 7L11 1" stroke="#FAF9FC" stroke-width="2" />
            </svg>
          </a>
        </li>
        <li>
          <router-link class="item" to="/dashboard">
            <div class="icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 11H1V17H7V11Z" stroke="#FAF9FC" stroke-width="2" />
                <path
                  d="M17 11H11V17H17V11Z"
                  stroke="#FAF9FC"
                  stroke-width="2"
                />
                <path d="M0 7H8" stroke="#FAF9FC" stroke-width="2" />
                <path d="M0 3H8" stroke="#FAF9FC" stroke-width="2" />
                <path d="M17 1H11V7H17V1Z" stroke="#FAF9FC" stroke-width="2" />
              </svg>
            </div>

            <span class="item__span"> Dashboard </span>
          </router-link>
        </li>
        <li @click="openModal('send')">
          <span class="item">
            <div class="icon">
              <StTooltip class="tooltip" tooltip="Send XST" position="right">
                <svg
                  width="18"
                  height="17"
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
              </StTooltip>
            </div>
            <span class="item__span"> Send </span>
          </span>
        </li>
        <li @click="openModal('receive')">
          <span class="item">
            <div class="icon">
              <StTooltip class="tooltip" tooltip="Receive XST" position="right">
                <svg
                  width="18"
                  height="17"
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
              </StTooltip>
            </div>
            <span class="item__span"> Receive </span>
          </span>
        </li>
        <li>
          <router-link class="item" to="/transactions">
            <div class="icon">
              <StTooltip class="tooltip" tooltip="Transactions" position="right">
                <svg
                  width="21"
                  height="18"
                  viewBox="0 0 21 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 1.5H19"
                    stroke="#FAF9FC"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M0 1.5H2"
                    stroke="#FAF9FC"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M5 6.5H19"
                    stroke="#FAF9FC"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M0 6.5H2"
                    stroke="#FAF9FC"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M5 11.5H19"
                    stroke="#FAF9FC"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M0 11.5H2"
                    stroke="#FAF9FC"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M5 16.5H19"
                    stroke="#FAF9FC"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M0 16.5H2"
                    stroke="#FAF9FC"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                </svg>
              </StTooltip>
            </div>
            <span class="item__span"> Transactions </span>
          </router-link>
        </li>
        <li @click="openModal('account')">
          <span class="item">
            <div class="icon">
              <StTooltip class="tooltip" tooltip="Add Account" position="right">
                <svg
                  width="18"
                  height="17"
                  viewBox="0 0 18 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 13L18 13" stroke="#FAF9FC" stroke-width="2" />
                  <path d="M14 9V17" stroke="#FAF9FC" stroke-width="2" />
                  <path d="M0 6H8.09524" stroke="#FAF9FC" stroke-width="2" />
                  <path d="M0 2H8.09524" stroke="#FAF9FC" stroke-width="2" />
                  <path d="M7 10H1V16H7V10Z" stroke="#FAF9FC" stroke-width="2" />
                  <path d="M17 1H11V7H17V1Z" stroke="#FAF9FC" stroke-width="2" />
                </svg>
              </StTooltip>
            </div>
            <span class="item__span"> Add Account </span>
          </span>
        </li>
        <li>
          <router-link class="item" to="/account/archived">
            <div class="icon">
              <StTooltip class="tooltip" tooltip="Manager" position="right">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 16H18" stroke="#FAF9FC" stroke-width="2" />
                  <path d="M10 12L18 12" stroke="#FAF9FC" stroke-width="2" />
                  <path d="M7 11H1V17H7V11Z" stroke="#FAF9FC" stroke-width="2" />
                  <path d="M10 6H18" stroke="#FAF9FC" stroke-width="2" />
                  <path d="M10 2H18" stroke="#FAF9FC" stroke-width="2" />
                  <path d="M7 1H1V7H7V1Z" stroke="#FAF9FC" stroke-width="2" />
                </svg>
              </StTooltip>
            </div>
            <span class="item__span"> Manager </span>
          </router-link>
        </li>
        <li @click="toggleDrawer('address-book')">
          <span class="item">
            <div class="icon">
              <StTooltip class="tooltip" tooltip="Address Book" position="right">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 13H18M14 9H18" stroke="#FAF9FC" stroke-width="2" />
                  <circle cx="8" cy="5" r="4" stroke="#FAF9FC" stroke-width="2" />
                  <path
                    d="M8.3125 9C5.0625 9 9.9375 9 6.6875 9C3.4375 9 1 11.4 1 13.8C1 16.2 1 17 1 17H18"
                    stroke="#FAF9FC"
                    stroke-width="2"
                  />
                </svg>
              </StTooltip>
            </div>

            <span class="item__span"> Address Book </span>
          </span>
        </li>
      </ul>
    </nav>
    <a class="item__footer" @click="lock">
      <svg
        width="16"
        height="17"
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
    </a>
  </aside>
</template>

<script>
import { ref, computed, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useMainStore } from '@/store';

export default defineComponent({
  name: 'StMenuBar',
  setup() {
    const mainStore = useMainStore();
    const router = useRouter();
    const isCollapsed = ref(false);

    router.afterEach(() => {
      !isCollapsed.value ? (isCollapsed.value = false) : null;
    });

    const menuExpanded = computed(() => {
      return mainStore.isMenuExpanded;
    });

    function toggleMenu() {
      isCollapsed.value = !isCollapsed.value;
    }

    function openModal(modal) {
      mainStore.SET_MODAL_VISIBILITY(modal, true);
    }
    function toggleDrawer(canvas) {
      mainStore.SET_OFF_CANVAS_DATA({ addressBook: 'dummy' });
      mainStore.SET_CURRENT_CANVAS(canvas);
      mainStore.TOGGLE_DRAWER(true);
    }
    function lock() {
      mainStore.SET_IS_LOCK(true);
      router.push('/lock');
    }

    return {
      isCollapsed,
      menuExpanded,
      toggleMenu,
      openModal,
      toggleDrawer,
      lock,
    };
  },
});
</script>

<style scoped>
.layout__aside {
  width: 64px;
  transition: width 0.3s;
}
.layout__aside--fixed {
  position: fixed;
}

.animate_width {
  transition: width 0.5s ease-out;
}

.layout__aside.width {
  width: 252px;
  filter: drop-shadow(15px 0px 30px rgba(20, 4, 53, 0.32));
}

.layout__aside nav {
  margin-top: 36px;
}

.layout__aside .item__footer {
  cursor: pointer;
  padding: 36px 0;
  text-decoration: none;
  padding-left: 24px;
}

.layout__aside li {
  display: block;
  cursor: pointer;
  position: relative;
}

/* .layout__aside li:first-child {
  margin-bottom: 120px;
} */

.layout__aside .icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* .layout__aside li svg {
  width: 1.5rem;
  height: 1.5rem;
} */

.layout__aside .item {
  line-height: 24px;
  padding: 14px 0 14px 24px;
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: 0.3s;
}

.layout__aside .item svg {
  transition: 0.3s;
}

.layout__aside .item-active svg {
  transform: rotate(-180deg);
}

.layout__aside .item span:not(.tooltip) {
  width: 100%;
  overflow: hidden;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.32px;
  color: var(--hampton50);
  margin-left: 24px;
  opacity: 1;
  transition: 0.3s ease-in-out;
  white-space: nowrap;
  font-weight: 600;
}

.layout__aside .item.router-link-exact-active svg path {
  stroke: var(--marine200);
}

.layout__aside .item.router-link-exact-active span {
  color: var(--marine200);
}

.layout__aside li svg path,
.layout__aside li svg circle {
  transition: 0.3s;
}

.layout__aside li:hover span,
.layout__aside li:hover svg path,
.layout__aside li:hover svg circle {
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
