// router.js
import Vue from 'vue';
import Router from 'vue-router';

import Login from '../views/login/';
const dashboard = resolve => require(['../views/dashboard/index'], resolve);
//使用了vue-routerd的[Lazy Loading Routes](https://router.vuejs.org/en/advanced/lazy-loading.html)

//所有权限通用路由表 
//如首页和登录页和一些不用权限的公用页面
export const routerMap = [
  //hidden为自定义属性，侧边栏那章会纤细解释
  {
    path: '/login',
    component: Login,
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    children: [{
      path: 'dashboard',
      component: dashboard
    }]
  },
]

//实例化vue的时候只挂载routerMap
export default new Router({
  routes: routerMap
});

//异步挂载的路由
//动态需要根据权限加载的路由表 
//maintenance 代表维保单位typeid(1) m1(主管理员) m2(子管理员) m3(普通员工)
//property 代表使用单位typeid(2) p1(主管理员) p2(子管理员) p3(普通员工)
//government 代表质检单位typeid(3) g1(主管理员) g2(子管理员) g3(普通员工)
export const asyncRouterMap = [{
  path: '/Permission',
  component: Layout,
  redirect: '/Permission/index',
  children: [{
    path: 'index',
    component: Permission,
    name: 'Permission',
    meta: {
      roles: ['m1', 'p1', 'g1', ],
      types: ['government', 'property', 'maintenance']
    }
  }]
},
{
  path: '*',
  redirect: '/404',
  hidden: true
}];