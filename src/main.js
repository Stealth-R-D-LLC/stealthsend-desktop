import { createApp } from 'vue';
import directives from "./directives/";
// import VueClickAway from 'vue3-click-away'
import router from './router';
import App from '/~/App.vue';
import '/~/index.css';

const app = createApp(App)

// register all directives
directives(app)

app.use(router)
app.mount('#app')
