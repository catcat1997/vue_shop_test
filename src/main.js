// import { createApp } from 'vue'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

import './assets/css/global.css'

import axios from 'axios'
// 配置請求的路徑 baseURL
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
    console.log(config);
    // 為請求頭headers對象, 內我們新增Authorization,給Auth..添加token字段。
    config.headers.Authorization = window.sessionStorage.getItem('token');
    // 在最後必須return config
    return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')

//  export const eventBus = createApp(App)
//  createApp(App).mount('#app')

// const app = createApp(App);
// app.use(router);
// app.mount('#app');