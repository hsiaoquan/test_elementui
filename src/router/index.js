//import Vue from 'vue'
//import Router from 'vue-router'
import storeinfo from '../components/store/storeinfo'
//不使用路由懒加载
//import userlistpage from '@/components/store/userlistpage'
//import userlist from '@/components/store/user'
//import imglist from '@/components/store/img'
//import testImg from '@/components/store/testImg'

//使用路由懒加载
const userlistpage = resolve => require(['@/components/store/userlistpage'],resolve);
const userlist = resolve => require(['@/components/store/user'],resolve);
const imglist = resolve => require(['@/components/store/img'],resolve);
const testImg = resolve => require(['@/components/store/testImg'],resolve);



//Vue.use(Router)
//此VueRouter对应external那一步
const router = new VueRouter({
  routes:[
        { path: '/userlistpage', component: userlistpage, name: '用户模块' },
        { path: '/storeinfo', component: storeinfo, name: '商家资料' },
        { path: '/userlist', component: userlist, name: '用户测试' },
        { path: '/imglist', component: imglist, name: '图片测试' },
        { path: '/testImg', component: testImg, name: '图片测试1' },
  ]
});
 export default router;

