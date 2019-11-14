import Vue from 'vue';
import app from './app.vue';
import VueRouter from "vue-router";
import router from "./index.js"
import axios from 'axios'
Vue.use(VueRouter)
Vue.prototype.$http=axios

new Vue({
    router,
    render:h => h(app)
}).$mount('#app')
