import Multiselect from '@vueform/multiselect';
import { StButton, StCheckbox, StInput, StLink, StRadio } from 'stealth-kit';
import { createApp } from 'vue';
import directives from "./directives/";
import router from './router';
import App from '/~/App.vue';
// import StButton from '/~/components/kit/StButton.vue';
// import StCheckbox from '/~/components/kit/StCheckbox.vue';
// import StInput from '/~/components/kit/StInput.vue';
// import StLink from '/~/components/kit/StLink.vue';
// import StRadio from '/~/components/kit/StRadio.vue';
import '/~/index.css';


const app = createApp(App)

// global components
app.component('StButton', StButton)
// app.component('StInput', StInput)
app.component('StMultiselect', Multiselect)
app.component('StLink', StLink)
app.component('StCheckbox', StCheckbox)
app.component('StRadio', StRadio)
app.component('StInput', StInput)
// app.component('StRadio', StRadio)
// app.component('StCheckbox', StCheckbox)
// end global components

// register all directives
directives(app)

app.use(router)
app.mount('#app')
