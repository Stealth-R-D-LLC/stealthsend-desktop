<template>
  <div class="arrow" :class="{ 'is-open': open, 'is-closed': !open }">
    <div class="arrow-container"></div>
  </div>
</template>

<script>
export default {
  name: 'StArrow',
  props: {
    open: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  setup() {
    return {};
  },
};
</script>

<style scoped>
.arrow {
  transform: scale(1);
  /* margin: 40px auto; */
  position: relative;
  display: inline-block;
  width: 24px;
  height: 24px;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.arrow-container {
  position: relative;
  height: 12px;
  width: 12px;
  border: solid #fcfaff;
  border-width: 0 0 2px 2px;
  transform: rotate(45deg);
}

.arrow-container::after {
  content: '';
  display: block;
  width: 20px;
  height: 2px;
  border-bottom: 2px solid #fcfaff;
  transform: rotate(-45deg);
  position: absolute;
  top: 3px;
  left: -5px;
}

.arrow.is-open .arrow-container {
  transform: rotate(45deg);
  transition: 0.6s linear;
}

.arrow.is-closed .arrow-container {
  transform: rotate(225deg);
  transition: 0.6s linear;
}
</style>
