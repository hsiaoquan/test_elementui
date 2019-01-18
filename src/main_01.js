//以下包括不通过cdn到插件的js

//import Vue from 'vue'
//import Vuex from 'vuex'
//import ElementUI from 'element-ui'
//import 'element-ui/lib/theme-chalk/index.css'
import navi from './components/Navi.vue'
import router from './router'

//import Mock from './mock'
//Mock.bootstrap();

Vue.config.productionTip = false

//Vue.use(router)
//Vue.use(ElementUI)
//Vue.use(Vuex)

//main.js中引入axios
//先不调用后台
//import axios from 'axios'
//改变原型链
Vue.prototype.$axios = axios;
Vue.prototype.$qs = Qs;

//响应超时时间
axios.defaults.timeout = 5000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.baseURL = 'http://localhost:9090/';


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(navi)
})
