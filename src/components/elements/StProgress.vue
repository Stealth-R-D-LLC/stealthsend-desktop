<template>
  <div class="progress">
    <transition appear @before-appear="beforeEnter" @after-appear="enter">
      <div class="progress-bar" />
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    duration: {
      type: Number,
      default: 5,
    },
  },
  setup(props) {
    function beforeEnter(el) {
      el.style.width = 0;
    }
    function enter(el) {
      el.style.transition = `width ${props.duration}s linear`;
      el.style.width = '100%';
    }

    return {
      beforeEnter,
      enter,
    };
  },
};
</script>

<style scoped>
.progress {
  background-color: var(--marine50);
  border-radius: 2px;
  height: 6px;
  width: 100%;
  overflow: hidden;
}
.progress-bar {
  display: block;
  background-color: var(--marine500);
  height: 100%;
  border-radius: 2px;
}
</style>
