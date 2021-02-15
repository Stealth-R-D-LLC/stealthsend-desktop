<template>
  <div class="st-radio">
    <input
      :id="id"
      :name="name"
      type="radio"
      class="st-radio__input"
      :value="label"
      @input="$emit('update:modelValue', label)"
    />
    <label class="st-radio__text" :for="id">
      <slot></slot>
    </label>
  </div>
</template>

<script>
// import { ref } from 'vue'
export default {
  name: 'StRadio',
  props: {
    id: {
      type: String,
      required: true,
    },
    modelValue: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    label: {
        type: String,
        required: true
    }
  },
  emits: ['update:modelValue'],
  setup() {
    // let vall = ref('')
    // return {
    //   vall,
    // }
  },
  //   data() {
  //     return {
  //       isChecked: false,
  //     }
  //   },

  //   mounted() {
  //     this.isChecked = this.checked
  //   },
  //   methods: {
  //     updateInput(event) {
  //       //   this.checked = event.target.checked;
  //       if (this.disabled) return
  //       this.$emit('input', event.target.checked)
  //       this.isChecked = event.target.checked
  //     },
  //   },
}
</script>
