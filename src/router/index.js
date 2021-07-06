import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../components/login.vue'

const routes = [{
    path: '/login',
    component: Login,
}]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router