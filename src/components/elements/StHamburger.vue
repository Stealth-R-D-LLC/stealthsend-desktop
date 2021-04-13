<template>
<<<<<<< HEAD
  <div class="arrow" :class="{ 'is-open': open, 'is-closed': !open }">
      <div class="arrow-container"></div>
=======
  <div class="hamburglar" :class="{ 'is-open': open, 'is-closed': !open }">
    <div class="burger-icon">
      <div class="burger-container">
        <span class="burger-bun-top"></span>
        <span class="burger-bun-bot"></span>
      </div>
    </div>
>>>>>>> develop
  </div>
</template>

<script>
export default {
  name: 'StHamburger',
  props: {
    open: {
      type: Boolean,
      required: true,
<<<<<<< HEAD
      default: true,
=======
      default: false,
>>>>>>> develop
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
  position: relative;
}

.arrow-container::after{
  content: "";
  display: block;
  width: 20px;
  height: 2px;
<<<<<<< HEAD
  border-bottom: 2px solid #fcfaff;
  transform: rotate(-45deg);
  position: absolute;
  top: 3px;
  left: -5px;
=======
  width: 27px;
  background: #fcfaff;
}

.burger-bun-top {
  top: 0;
  transform-origin: 25.5px 3.5px;
}

.burger-bun-bot {
  bottom: 0;
  transform-origin: 20.5px -0.5px;
}

.hamburglar.is-open .burger-bun-top {
  -webkit-animation: bun-top-out 0.6s linear normal;
  animation: bun-top-out 0.6s linear normal;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
}
.hamburglar.is-open .burger-bun-bot {
  -webkit-animation: bun-bot-out 0.6s linear normal;
  animation: bun-bot-out 0.6s linear normal;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
}

.hamburglar.is-closed .burger-bun-top {
  -webkit-animation: bun-top-in 0.6s linear normal;
  animation: bun-top-in 0.6s linear normal;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
}
.hamburglar.is-closed .burger-bun-bot {
  -webkit-animation: bun-bot-in 0.6s linear normal;
  animation: bun-bot-in 0.6s linear normal;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
>>>>>>> develop
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
