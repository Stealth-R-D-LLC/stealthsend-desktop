<template>
  <div class="uikit-container">
    <h1>UI Kit</h1>
    <h2>Buttons</h2>
    <StButton color="secondary" @click="clickHandler('aaaaa')">Dash</StButton>
    <StButton @click="clickHandler('bbbbbaaaaaaaaaaaaaaaa')">Settings</StButton>
    <br />
    <br />
    <h2>Inputs</h2>
    <StInput v-model="bla" placeholder="aaaa"></StInput>
    <StInput
      v-model="bla"
      has-error
      :error-messages="'custom error message'"
    ></StInput>
    <br />
    <br />
    <h2>Link</h2>
    <StLink to="settings">hoveraj me burki</StLink>
    <br />
    <br />
    <StLink @click="clickHandler('bla')">ovaj samo ima emit</StLink>
    <h2>Radio</h2>
    <StLink to="settings">hoveraj me burki</StLink>
    <br />
    <br />
    <StRadio
      :id="'uikitradio1'"
      v-model="radioValue"
      :name="'uikitradio'"
      :label="'option 1'"
      >option 1</StRadio
    >
    <StRadio
      :id="'uikitradio2'"
      v-model="radioValue"
      :name="'uikitradio'"
      :label="'option 2'"
      >option 2</StRadio
    >
    <StRadio
      :id="'uikitradio3'"
      v-model="radioValue"
      :name="'uikitradio'"
      :label="'option 3'"
      >option 3</StRadio
    >
    {{ radioValue }}
    <br />
    <br />
    <h2>Checkbox</h2>

    <StCheckbox v-model="checkboxPrvi"
      >checkbox usrani {{ checkboxPrvi }}</StCheckbox
    >
    <StCheckbox
      >checkbox usrani veliki Lorem ipsum dolor sit amet, consectetur
      adipisicing elit. Nemo iure doloremque accusantium, beatae doloribus
      minima? Ut voluptas accusantium accusamus repellendus? Perferendis rerum
      voluptates sequi incidunt, magnam quidem in. Magni, illum?Lorem ipsum
      dolor sit amet consectetur adipisicing elit. Minus itaque eos consectetur
      perferendis laborum facere expedita, iste quod voluptatibus officiis
      dolorem delectus accusantium aut vero fugiat adipisci eaque perspiciatis
      beatae!</StCheckbox
    >
    <br /><br />
    <h2>Modal</h2>
    <StModal v-if="showModal" @close="showModal = false">
      <template #header> Modal title </template>
      <template #body>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores,
        aspernatur? Necessitatibus hic a ullam commodi! Nostrum deserunt facere
        ut ducimus unde in, animi qui soluta, omnis praesentium, incidunt
        voluptatum quae.
      </template>
      <template #footer> footer </template>
    </StModal>
    <button @click="showModal = true">Show modal</button>
  </div>
</template>

<script>
import StButton from '/~/components/kit/StButton.vue'
import StInput from '/~/components/kit/StInput.vue'
import StLink from '/~/components/kit/StLink.vue'
import StRadio from '/~/components/kit/StRadio.vue'
import StCheckbox from '/~/components/kit/StCheckbox.vue'
import StModal from '/~/components/kit/StModal.vue'
import { ref } from 'vue'
export default {
  components: {
    StButton,
    StInput,
    StLink,
    StRadio,
    StCheckbox,
    StModal,
  },
  setup() {
    const bla = ref('')
    let checkboxPrvi = ref(false)
    let showModal = ref(false)

    let radioValue = ref('')
    function clickHandler(test) {
      console.log('---> ', test)
    }
    return {
      clickHandler,
      bla,
      radioValue,
      checkboxPrvi,
      showModal,
    }
  },
}
</script>

<style scoped></style>
