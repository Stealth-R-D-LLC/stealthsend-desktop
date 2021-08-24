<template>
  <div class="circle-progress__wrapper">
    <div class="wrapper right">
      <div class="circle-progress rightcircle right_cartoon"></div>
    </div>
    <div class="wrapper left">
      <div class="circle-progress leftcircle left_cartoon"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CircleProgress',
  setup() {
    return {};
  },
};
</script>

<style scoped>
.circle-progress__wrapper {
  position: absolute;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  transform: rotateZ(180deg) scaleX(-1);
}
.right {
  right: 0;
}
.wrapper {
  position: absolute;
  width: 50px;
  height: 100px;
  top: 0;
  overflow: hidden;
}
.circle-progress {
  width: 95px;
  height: 95px;
  border: 2px solid rgba(224, 211, 252, 0.3);
  border-radius: 50%;
  box-sizing: content-box;
  position: absolute;
  top: 0;
}
.rightcircle {
  border-top: 2px solid #e0d3fc;
  border-right: 2px solid #e0d3fc;
  right: 0;
}
.leftcircle {
  border-bottom: 2px solid #e0d3fc;
  border-left: 2px solid #e0d3fc;
  left: 0;
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}
.right_cartoon {
  -webkit-animation: circleProgressLoad_right 5s linear infinite forwards;
  animation: circleProgressLoad_right 5s linear infinite forwards;
}
.left_cartoon {
  -webkit-animation: circleProgressLoad_left 5s linear infinite forwards;
  animation: circleProgressLoad_left 5s linear infinite forwards;
}

@keyframes circleProgressLoad_right {
  0% {
    -webkit-transform: rotate(46deg);
    transform: rotate(46deg);
  }

  50%,
  to {
    -webkit-transform: rotate(-136deg);
    transform: rotate(-136deg);
  }
}

@keyframes circleProgressLoad_left {
  0%,
  50% {
    -webkit-transform: rotate(46deg);
    transform: rotate(46deg);
  }

  to {
    -webkit-transform: rotate(-136deg);
    transform: rotate(-136deg);
  }
}
</style>
