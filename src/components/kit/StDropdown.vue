<template>
  <div class="st-dropdown" @click="isVisible = !isVisible">
    <div class="st-dropdown__label">
      <slot></slot>
    </div>
    <transition name="fade" mode="out-in">
      <div v-if="isVisible" ref="stDropdownRef" class="st-dropdown__items">
        <span class="tip"></span>
        <ul>
          <li v-for="item in items" :key="item">
            <router-link :to="item.to" class="dropdown-item" @click="close">
              {{ item.label }}
            </router-link>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

export default {
  name: 'StDropdown',
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  setup() {
    let isVisible = ref(false)
    const stDropdownRef = ref(null)

    onClickOutside(stDropdownRef, () => {
      isVisible.value = false
    })

    function close() {
      isVisible = false
    }
    return { isVisible, close, stDropdownRef }
  }
}
</script>

<style scoped>
.st-dropdown__label {
  color: var(--grey1000);
  font-size: 18px;
  letter-spacing: 0.32px;
  line-height: 26px;
}
.st-dropdown__label:hover {
  cursor: pointer;
}
.st-dropdown__items {
  padding: 12px 0;
  border: 1px solid var(--grey100);
  margin-top: 20px;
  position: absolute;
  min-width: 300px;
  background: white;
  z-index: var(--zDropdown);
  left: 120px;
}
.st-dropdown__items .tip {
  width: 12px;
  height: 12px;
  position: absolute;
  top: -8px;
  right: 50%;
  transform: rotate(45deg);
  border-left: 1px solid var(--grey100);
  border-top: 1px solid var(--grey100);
  background: white;
}
.st-dropdown .dropdown-item {
  display: block;
  padding: 12px 24px;
  text-decoration: none;
  color: var(--grey1000);
  font-size: 18px;
  letter-spacing: 0.32px;
  line-height: 26px;
  border-left: 4px solid transparent;
  transition: 0.22s;
}
.st-dropdown .dropdown-item:hover {
  background: var(--purple50);
  border-color: var(--marine500);
}
</style>
