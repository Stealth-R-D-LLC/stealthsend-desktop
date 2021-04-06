<template>
  <div class="hamburglar" :class="{ 'is-open': open, 'is-closed': !open }">
    <div class="burger-icon">
      <div class="burger-container">
        <span class="burger-bun-top"></span>
        <span class="burger-bun-bot"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StHamburger',
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
.hamburglar {
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

.hamburglar.is-open .path {
  -webkit-animation: dash-in 0.6s linear normal;
  animation: dash-in 0.6s linear normal;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
}
.hamburglar.is-open .animate-path {
  -webkit-animation: rotate-in 0.6s linear normal;
  animation: rotate-in 0.6s linear normal;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
}

.hamburglar.is-closed .path {
  -webkit-animation: dash-out 0.6s linear normal;
  animation: dash-out 0.6s linear normal;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
}
.hamburglar.is-closed .animate-path {
  -webkit-animation: rotate-out 0.6s linear normal;
  animation: rotate-out 0.6s linear normal;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
}

.burger-icon {
  position: absolute;
  /* padding: 20px 16px; */
  /* height: 68px;
  width: 68px; */
}

.burger-container {
  position: relative;
  height: 18px;
  width: 24px;
}

.burger-bun-top,
.burger-bun-bot {
  position: absolute;
  display: block;
  height: 2px;
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
}

@-webkit-keyframes bun-top-out {
  0% {
    left: 0;
    top: 0;
    transform: rotate(0deg);
  }
  20% {
    left: 0;
    top: 0;
    transform: rotate(15deg);
  }
  80% {
    left: -5px;
    top: 0;
    transform: rotate(-60deg);
  }
  100% {
    left: -5px;
    top: 1px;
    transform: rotate(-45deg);
  }
}

@keyframes bun-top-out {
  0% {
    left: 0;
    top: 0;
    transform: rotate(0deg);
  }
  20% {
    left: 0;
    top: 0;
    transform: rotate(15deg);
  }
  80% {
    left: -5px;
    top: 0;
    transform: rotate(-60deg);
  }
  100% {
    left: -5px;
    top: 1px;
    transform: rotate(-45deg);
  }
}
@-webkit-keyframes bun-bot-out {
  0% {
    left: 0;
    transform: rotate(0deg);
  }
  20% {
    left: 0;
    transform: rotate(-15deg);
  }
  80% {
    left: -5px;
    transform: rotate(60deg);
  }
  100% {
    left: -5px;
    transform: rotate(45deg);
  }
}
@keyframes bun-bot-out {
  0% {
    left: 0;
    transform: rotate(0deg);
  }
  20% {
    left: 0;
    transform: rotate(-15deg);
  }
  80% {
    left: -5px;
    transform: rotate(60deg);
  }
  100% {
    left: -5px;
    transform: rotate(45deg);
  }
}
@-webkit-keyframes bun-top-in {
  0% {
    left: -5px;
    bot: 0;
    transform: rotate(-45deg);
  }
  20% {
    left: -5px;
    bot: 0;
    transform: rotate(-60deg);
  }
  80% {
    left: 0;
    bot: 0;
    transform: rotate(15deg);
  }
  100% {
    left: 0;
    bot: 1px;
    transform: rotate(0deg);
  }
}
@keyframes bun-top-in {
  0% {
    left: -5px;
    bot: 0;
    transform: rotate(-45deg);
  }
  20% {
    left: -5px;
    bot: 0;
    transform: rotate(-60deg);
  }
  80% {
    left: 0;
    bot: 0;
    transform: rotate(15deg);
  }
  100% {
    left: 0;
    bot: 1px;
    transform: rotate(0deg);
  }
}
@-webkit-keyframes bun-bot-in {
  0% {
    left: -5px;
    transform: rotate(45deg);
  }
  20% {
    left: -5px;
    bot: 0;
    transform: rotate(60deg);
  }
  80% {
    left: 0;
    bot: 0;
    transform: rotate(-15deg);
  }
  100% {
    left: 0;
    transform: rotate(0deg);
  }
}
@keyframes bun-bot-in {
  0% {
    left: -5px;
    transform: rotate(45deg);
  }
  20% {
    left: -5px;
    bot: 0;
    transform: rotate(60deg);
  }
  80% {
    left: 0;
    bot: 0;
    transform: rotate(-15deg);
  }
  100% {
    left: 0;
    transform: rotate(0deg);
  }
}
</style>
