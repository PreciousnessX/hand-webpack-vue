import Vue from 'vue';
import app from './app.vue';
import VueRouter from "vue-router";
import router from "./index.js"
import axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.prototype.$http=axios

new Vue({
    router,
    render:h => h(app)
}).$mount('#app')
