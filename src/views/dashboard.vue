<template>
  <div class="dashbaord-container">
    <card>
      <template #title>Main account</template>
      <template #type>XST / USD</template>
      <template #amount-crypto>3,321,321.00</template>
      <template #amount-fiat>$123,456.00</template>
    </card>
  </div>
</template>

<script>
import Card from '../components/elements/Card'
export default {
  name: 'StDshboard',
  components: {
    Card
  },
  setup() {
    return {}
  },
}
</script>

<style scoped></style>
