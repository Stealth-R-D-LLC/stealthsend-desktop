<template>
        <Field :name="name" :rules="rules" v-slot="{ field, errorMessage, errors }">
    <div class="st-form-item" :class="{'st-form-item--has-error': !!errorMessage, 'st-form-item--is-success': notice}">
        <label for="">lablecina</label>
            <slot v-bind="{field, name}"></slot>
        <p class="st-form-item__message" v-show="errorMessage || notice">
            {{errors}}
      {{ errorMessage || notice }}
    </p>
    </div>
        </Field>
</template>

<script>

import { Field,  defineRule } from "vee-validate";
defineRule('required', value => {
  if (!value || !value.length) {
    return 'This field is required';
  }

  return true; 
});
defineRule('minosam', value => {
  if (!value || value.length < 8) {
    return 'osam brate';
  }

  return true; 
});
export default {
    name: 'StFormItem',
    components: {
        Field
    },
    props: {
        name: {
            type: String,
            required: true,
            default: 'noname'
        },
        notice: {
            type: String,
            required: false,
            default: ''
        },
        rules: {
            type: String,
            required: false,
            default: ''
        }
    },
    setup () {
        // const {errorMessage, value } = useField(props.name, props.rules);

        // console.log('valuze', value);



        return {
            // errorMessage
        }
    }
}
</script>

<style scoped>
.st-form-item {
    border: 1px dashed red;
}
</style>