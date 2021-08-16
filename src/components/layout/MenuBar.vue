<template>
  <aside
    role="navigation"
    id="aside-menu"
    ref="asideMenu"
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
            <SvgIcon name="icon-arrow-right" />
          </a>
        </li>
        <li>
          <router-link class="item" to="/dashboard">
            <div class="icon">
              <StTooltip
                class="tooltip"
                :tooltip="!isCollapsed ? 'Dashboard' : null"
                position="right"
              >
                <SvgIcon name="icon-dashboard" />
              </StTooltip>
            </div>

            <span class="item__span"> Dashboard </span>
          </router-link>
        </li>
        <li @click="openModal('send')">
          <span class="item">
            <div class="icon">
              <StTooltip
                :tooltip="!isCollapsed ? 'Send XST' : null"
                position="right"
              >
                <SvgIcon name="icon-send-xst" />
              </StTooltip>
            </div>
            <span class="item__span"> Send </span>
          </span>
        </li>
        <li @click="openModal('receive')">
          <span class="item">
            <div class="icon">
              <StTooltip
                :tooltip="!isCollapsed ? 'Receive XST' : null"
                position="right"
              >
                <SvgIcon name="icon-receive-xst" />
              </StTooltip>
            </div>
            <span class="item__span"> Receive </span>
          </span>
        </li>
        <li>
          <router-link class="item" to="/transactions">
            <div class="icon">
              <StTooltip
                :tooltip="!isCollapsed ? 'Transactions' : null"
                position="right"
              >
                <SvgIcon name="icon-transactions" />
              </StTooltip>
            </div>
            <span class="item__span"> Transactions </span>
          </router-link>
        </li>
        <li @click="openModal('account')">
          <span class="item">
            <div class="icon">
              <StTooltip
                :tooltip="!isCollapsed ? 'Add Account' : null"
                position="right"
              >
                <SvgIcon name="icon-add-account" />
              </StTooltip>
            </div>
            <span class="item__span"> Add Account </span>
          </span>
        </li>
        <li>
          <router-link class="item" to="/account/archived">
            <div class="icon">
              <StTooltip
                :tooltip="!isCollapsed ? 'Manager' : null"
                position="right"
              >
                <SvgIcon name="icon-manager" />
              </StTooltip>
            </div>
            <span class="item__span"> Manager </span>
          </router-link>
        </li>
        <li @click="toggleDrawer('address-book')">
          <span class="item">
            <div class="icon">
              <StTooltip
                :tooltip="!isCollapsed ? 'Address Book' : null"
                position="right"
              >
                <SvgIcon name="icon-address-book" />
              </StTooltip>
            </div>

            <span class="item__span"> Address Book </span>
          </span>
        </li>
      </ul>
    </nav>
    <a class="item__footer" @click="lock">
      <SvgIcon name="icon-lock" />
    </a>
  </aside>
</template>

<script>
import { ref, computed, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useMainStore } from '@/store';
import { onClickOutside } from '@vueuse/core';
import SvgIcon from '../partials/SvgIcon.vue';

export default defineComponent({
  name: 'StMenuBar',
  components: {
    SvgIcon,
  },
  setup() {
    const mainStore = useMainStore();
    const router = useRouter();
    const isCollapsed = ref(false);
    const asideMenu = ref(null);

    router.afterEach(() => {
      if (isCollapsed.value) {
        isCollapsed.value = false;
      }
    });

    const menuExpanded = computed(() => {
      return mainStore.isMenuExpanded;
    });

    function toggleMenu() {
      isCollapsed.value = !isCollapsed.value;
    }

    function openModal(modal) {
      isCollapsed.value = false;
      mainStore.SET_MODAL_VISIBILITY(modal, true);
    }
    function toggleDrawer(canvas) {
      isCollapsed.value = false;
      mainStore.SET_OFF_CANVAS_DATA({ addressBook: 'dummy' });
      mainStore.SET_CURRENT_CANVAS(canvas);
      mainStore.TOGGLE_DRAWER(true);
    }
    function lock() {
      mainStore.SET_IS_LOCK(true);
      router.push('/lock');
    }

    onClickOutside(asideMenu, () => {
      if (isCollapsed.value) {
        isCollapsed.value = false;
      }
    });

    return {
      asideMenu,
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

.layout__aside .item .item__span:not(.tooltip) {
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

.layout__aside .item.router-link-exact-active :deep .icon-svg path {
  stroke: var(--marine200) !important;
}

.layout__aside .item.router-link-exact-active span {
  color: var(--marine200) !important;
}

.layout__aside li svg path,
.layout__aside li svg circle {
  transition: 0.3s;
}

.layout__aside li:hover span,
.layout__aside li:hover :deep .icon-svg path,
.layout__aside li:hover :deep .icon-svg circle {
  stroke: var(--marine200) !important;
  color: var(--marine200) !important;
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
#right {
  display: flex;
}
</style>
