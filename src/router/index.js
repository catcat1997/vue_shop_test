import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'


Vue.use(Router)


const router = new Router({
    routes: [{
        path: '/',
        redirect: '/login',
    }, {
        path: '/login',
        component: Login,
    }, {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [
            { path: '/welcome', component: Welcome },
            { path: '/users', component: Users },
        ]
    }],
})

// 掛載路由導航守衛   沒有token就會強制返回到'/login'
router.beforeEach((to, from, next) => {
    // next是一個函數 next() 表示網頁放行
    if (to.path === '/login') return next();
    // 獲取token
    const tokenStr = window.sessionStorage.getItem('token'); //取得對應鍵的值
    if (!tokenStr) return next('/login');
    next();

});

export default router