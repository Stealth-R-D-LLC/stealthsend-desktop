<template>
  <div class="st-count-up">
    {{ animatedValue }}
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import useHelpers from '@/composables/useHelpers';

export default {
  props: {
    value: {
      type: Number,
      required: true,
      default: () => {
        return 0
      },
    },
  },
  setup(props) {

    const { formatAmount } = useHelpers();

    const animationDuration = 1000;
    const frameDuration = 1000 / 60;
    const animatedValue = ref(0);
    const totalFrames = 60;

    watch(
      () => props.value,
      () => {
        animateCountUp();
      })

    function animateCountUp() {
      let frame = 0
      let val = props.value
      const countTo = props.value
      const counter = setInterval(() => {
        frame++
        const progress = easeOutQuad(frame / (animationDuration/frameDuration))
        const currentCount = countTo * progress
        if (val !== currentCount) {
          val = currentCount
        }
        if (frame === totalFrames) {
          clearInterval(counter)
        }
        animatedValue.value = formatAmount(val, false, 6, 6)
      }, frameDuration)
    };
    function easeOutQuad(t) {
      return t * (2 - t)
    };

    animateCountUp();

    return {
      animatedValue
    }
      }
}
</script>
