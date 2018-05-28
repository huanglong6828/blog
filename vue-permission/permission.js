// permission.js
router.beforeEach((to, from, next) => {
  if (store.getters.token) { // 判断是否有token
    if (to.path === '/login') {
      next({
        path: '/'
      });
    } else {
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(res => { // 拉取info
          //区别当前用户类型和用户权限匹配符合的路由和按钮视图等
          let type, userRoleId
          if (res.data.typeid == 1) type = 'maintenance'
          if (res.data.typeid == 2) type = 'property'
          if (res.data.typeid == 3) type = 'government'
          userRoleId = type[0] + res.data.userRoleId

          const obj = {
            roles: [userRoleId],
            types: [type]
          }
          store.dispatch('GenerateRoutes', obj).then(() => { // 根据权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        }).catch(err => {
          console.log(err);
        });
      } else {
        next() //当有用户权限的时候，说明所有可访问路由已生成 如访问没权限的全面会自动进入404页面
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next();
    } else {
      next('/login'); // 否则全部重定向到登录页
    }
  }
});