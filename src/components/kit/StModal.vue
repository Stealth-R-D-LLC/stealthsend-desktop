<template>
  <transition name="fade">
    <div v-if="visible" class="st-modal">
      <div class="st-modal-wrapper">
        <div ref="stModalRef" class="st-modal-container">
          <span
            v-if="showCloseButton"
            class="st-modal__close-button"
            @click="$emit('close')"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              @click="hide"
            >
              <defs />
              <g
                fill="none"
                fill-rule="evenodd"
                stroke="#1C1A1C"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              >
                <path
                  d="M1.058 1.126l15.884 15.883M1.058 17.009L16.942 1.126"
                />
              </g></svg
          ></span>
          <div class="st-modal__header">
            <slot name="header"> default header </slot>
          </div>

          <div class="st-modal__body">
            <slot name="body"> default body </slot>
          </div>

          <div class="st-modal__footer">
            <slot name="footer">
              <!-- default footer
              <button class="modal-default-button" @click="$emit('close')">
                OK
              </button> -->
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue'

export default {
  name: 'StModal',
  props: {
    visible: {
      type: Boolean,
      required: false,
      default: false
    },
    showCloseButton: {
      type: Boolean,
      required: false,
      default: true
    },
    hasClickOutside: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  emits: ['close'],
  setup(props, ctx) {
    const stModalRef = ref(null)

    onClickOutside(stModalRef, () => {
      if (props.hasClickOutside) {
        ctx.emit('close')
      }
    })

    return { stModalRef }
  }
}
</script>

<style scoped>
.st-modal {
  position: fixed;
  z-index: var(--zModal);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}
.st-modal__close-button {
  color: red;
  position: absolute;
  top: 32px;
  right: 32px;
}
.st-modal__close-button:hover {
  cursor: pointer;
}
.st-modal__header {
  color: var(--grey1000);
  font-family: 'Source Sans Pro';
  font-size: 20px;
  letter-spacing: 0.32px;
  line-height: 26px;
}
.st-modal__body {
  margin: 45px 0 65px 0;
}
.st-modal__footer {
  display: flex;
  justify-content: flex-end;
}
.st-modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.st-modal-container {
  position: relative;
  width: 300px;
  margin: 0px auto;
  padding: 60px;
  background-color: var(--white);
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
.modal-default-button {
  display: block;
  margin-top: 1rem;
}
</style>
