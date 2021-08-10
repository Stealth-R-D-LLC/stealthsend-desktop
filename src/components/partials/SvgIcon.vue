<template>
  <inline-svg :src="iconComponent" class="icon-svg"></inline-svg>
</template>

<script>
import InlineSvg from 'vue-inline-svg';

export default {
  name: 'SvgIcon',
  components: {
    InlineSvg,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  computed: {
    iconComponent() {
      return require(`@/assets/icons/${this.name}.svg`);
    },
  },
};
</script>

<style></style>
