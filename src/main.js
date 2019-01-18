import navi from './components/Navi.vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

//改变原型链
//$axios和$qs可以在相应的xxx.vue使用，即this.@axios.post()和this.$qs.stringfty()
Vue.prototype.$axios = axios; //全局注册，使用方法为:this.$axios
Vue.prototype.$qs = Qs;      //全局注册，使用方法为:this.$qs

//响应超时时间
axios.defaults.timeout = 5000;
//使用axios.post要设置此响应头，否则后台无法获取数据
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
//axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
//请求的地址
axios.defaults.baseURL = 'http://localhost:9090/';


new Vue({
  el: '#app',
  router,
  render: h => h(navi)
})

