import AppMain from '@/components/AppMain'
import AppLogin from '@/components/AppLogin'

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: AppLogin },
    { path: '/main', component: AppMain }
]

import { createWebHistory, createRouter } from 'vue-router';
export const router = createRouter({
    history: createWebHistory(),
    routes
})