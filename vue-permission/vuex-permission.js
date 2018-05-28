import { asyncRouterMap, routerMap } from '@/router'
import { constantButtonPermission } from '@/utils/buttonPermission'
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  } else {
    return true //此处为true因为递归，首先要保证父级router的一直存在
  }
}

/**
 * 通过meta.type判断当前端
 * @param types
 * @param route
 */
function hasTypes(types, route) {
  if (route.meta && route.meta.types) {
    return types.some(type => route.meta.types.indexOf(type) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 * @param types
 */
function filterAsyncRouter(asyncRouterMap, roles, types) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route) && hasTypes(types, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles, types)
      }
      return true
    }
    return false
  })
  return accessedRouters
}
/**
 * 过滤按钮视图，返回符合用户按钮和视图
 * @param constantButtonPermission
 * @param roles
 * @param types
 */
function filterButton(constantButtonPermission, roles, types) {
  const accessedButton = []
  constantButtonPermission.filter(Button => {
    if (hasPermission(roles, Button) && hasTypes(types, Button)) {
      accessedButton.push(Button.name)
      return true
    }
    return false
  })
  return accessedButton
}
/**
 * 返回所有用户按钮和视图
 * @param constantButtonPermission
 */
function AllButton(constantButtonPermission) {
  const AllPermission = {}
  for (let i = 0; i < constantButtonPermission.length; i++) {
    AllPermission[constantButtonPermission[i].name] = constantButtonPermission[i].name
  }
  return AllPermission
}
const permission = {
  state: {
    routers: routerMap,
    addRouters: [],
    AllPermission: AllButton(constantButtonPermission),
    constantButton: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = routerMap.concat(routers)
    },
    SET_BUTTON_PERMISSIONS: (state, buttonPermissions) => {
      state.constantButton = buttonPermissions
    },
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const roles = data.roles
        const types = data.types
        let accessedRouters, accessedButtons
        //  当前if判断是某个权限拥有所有菜单 则不需要判断，现在每个权限不同 则需要每次判断
        // if (roles.indexOf('1') >= 0 && types.indexOf('government') >= 0) {
        // accessedRouters = asyncRouterMap
        // } else {
        accessedRouters = filterAsyncRouter(asyncRouterMap, roles, types)
        // }
        accessedButtons = filterButton(constantButtonPermission, roles, types)
        commit('SET_ROUTERS', accessedRouters)
        commit('SET_BUTTON_PERMISSIONS', accessedButtons)
        resolve()
      })
    }
  }
}

export default permission