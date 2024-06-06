import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

import '/public/index.css'

import { createPinia } from "pinia";
const pinia = createPinia()
app.use(pinia)

import { router } from '@/router';
app.use(router)

app.mount('#app')
