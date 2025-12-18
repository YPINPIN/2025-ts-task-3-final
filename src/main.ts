import { createApp } from 'vue'

import './assets/styles/all.scss'

import 'bootstrap/js/dist/collapse'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')
