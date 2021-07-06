import { createApp } from 'vue'
// import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// Vue.config.productionTip = false

// new Vue({
//     router,
//     render: h => h(App)
// }).$mount('#app')
export const eventBus = createApp(App)
createApp(App).mount('#app')