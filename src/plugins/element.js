import Vue from 'vue'
// import { Button } from 'element-ui'
// import { Form, FormItem } from 'element-ui'
// import { Input } from 'element-ui'
// // import element-ui的message提示組件
// import { Message } from 'element-ui'
// import { Container, Header, Aside, Main } from 'element-ui'
// import { Menu, Submenu, MenuItemGroup, MenuItem } from 'element-ui'
// import { Breadcrumb, BreadcrumbItem, Card } from 'element-ui'

// // import elementUI from 'element-ui'  全部導入,不用煩, 但用內存多

// Vue.use(Button)
// Vue.use(Form)
// Vue.use(FormItem)
// Vue.use(Input)
//     // 全局掛載,導入寫法不同  這個$message是自定義屬性 Message是組件名
//     // 我們調用時就可以用 this.$message對象去調用
// Vue.prototype.$message = Message

// Vue.use(Container)
// Vue.use(Header)
// Vue.use(Aside)
// Vue.use(Main)
// Vue.use(Menu)
// Vue.use(Submenu)
// Vue.use(MenuItemGroup)
// Vue.use(MenuItem)
// Vue.use(Breadcrumb)
// Vue.use(BreadcrumbItem)
// Vue.use(Card)


// //全局導入
import '../../node_modules/element-ui/lib/theme-chalk/index.css'
import elementUI from 'element-ui'
Vue.use(elementUI)