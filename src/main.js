import { createApp } from 'vue'
// import VueClickAway from 'vue3-click-away'
import router from './router'
import App from '/~/App.vue'
import '/~/index.css'

const app = createApp(App)

app.use(router)
app.mount('#app')
