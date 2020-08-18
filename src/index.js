/**
 * 路由配置
 */
import VueRouter from "vue-router"
/**
 * 路由组件
 */

import page1 from "./components/page1.vue"
import page2 from "./components/page2.vue"
import page3 from "./components/page3.vue"
import page4 from "./components/page4.vue"
import add from "./components/addNewApplyFor.vue"


const routes = [{
        path: '/',
        redirect: '/page1'
    },
    {
        path: '/page1',
        name: "one",
        component: page1
    }, {
        path: '/page2/:a/:b',
        name: "two",
        component: page2
    },
    {
        path: '/page3',
        name: "three",
        component: page3
    },
    {
        path: '/page4/:a/:b',
        name: "four",
        component: page4
    },
    {
              path: '/add',
        name: "add",
        component: add
    }

]
const router = new VueRouter({
    // mode: 'history',
    routes
})
// 这里可以定义全局的导航守卫
router.beforeEach((to, from, next) => { // 前置导航守卫
    // ...
    next() // next 是必须的,如果没有next()导航不会跳转
})

export default router