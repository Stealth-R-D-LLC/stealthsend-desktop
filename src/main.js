import Multiselect from '@vueform/multiselect';
import { StButton, StCheckbox, StInput, StLink, StRadio } from 'stealth-kit';
import { createApp } from 'vue';
import App from './App.vue';
import directives from "./directives/";
import './index.css';
import router from './router';


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

