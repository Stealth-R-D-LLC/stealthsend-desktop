<template>
  <div v-show="visibility" class="loading-page" :class="{'opaque': opaque, 'transparent': !opaque}">
    <img src="../../../static/xstloader.gif" alt="Test gif" />
  </div>
</template>

<script>
import { watch } from 'vue'
export default {
  name: 'StLoader',
  props: {
    visibility: {
      type: Boolean,
      required: false,
      default: false,
    },
    opaque: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup(props) {
    watch(() => {
      // when global loading is active, it shouldn't be possible to scroll
      document.body.classList.toggle('noscroll', props.visibility)
    })
  },
}
</script>

<style lang="postcss">
.loading-page {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 30px;
  overflow: hidden;
  z-index: 10;
}

.transparent {
  background: rgba(255, 255, 255, 0.8)
}
.opaque {
  background: rgba(255, 255, 255, 1)
}
</style>
