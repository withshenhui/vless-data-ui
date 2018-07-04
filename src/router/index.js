import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/index',
  //   meta: { roles: ['admin'] }, // you can set roles in root nav
  //   children: [{
  //     path: 'index',
  //     component: _import('permission/index'),
  //     name: 'permission',
  //     meta: {
  //       title: 'permission',
  //       icon: 'lock',
  //       roles: ['admin'] // or you can only set roles in sub nav
  //     }
  //   }]
  // },
  {
    path: '/dataManager',
    component: Layout,
    redirect: '/data-manager/table/complex-table',
    name: 'dataManager',
    meta: {
      title: 'dataManager',
      icon: 'example',
      roles: ['user']
    },
    children: [
      // {
      //   path: '/data-manager/table',
      //   component: _import('data-manager/table/index'),
      //   redirect: '/data-manager/table/complex-table',
      //   name: 'Table',
      //   meta: {
      //     title: 'Table',
      //     icon: 'table'
      //   },
      //   children: [
      //     { path: 'dynamic-table', component: _import('data-manager/table/dynamicTable/index'), name: 'dynamicTable', meta: { title: 'dynamicTable' }},
      //     { path: 'drag-table', component: _import('data-manager/table/dragTable'), name: 'dragTable', meta: { title: 'dragTable' }},
      //     { path: 'inline-edit-table', component: _import('data-manager/table/inlineEditTable'), name: 'inlineEditTable', meta: { title: 'inlineEditTable' }},
      //     { path: 'tree-table', component: _import('data-manager/table/treeTable/treeTable'), name: 'treeTableDemo', meta: { title: 'treeTable' }},
      //     { path: 'custom-tree-table', component: _import('data-manager/table/treeTable/customTreeTable'), name: 'customTreeTableDemo', meta: { title: 'customTreeTable' }},
      //     { path: 'complex-table', component: _import('data-manager/table/complexTable'), name: 'complexTable', meta: { title: 'complexTable' }},
      //     { path: 'actiontype-table', component: _import('data-manager/table/actionTypeTable'), name: 'actionTypeTable', meta: { title: 'actionTypeTable',roles: ['admin']}}
      //   ]
      // },
      { path: 'datatype-table', component: _import('data-manager/table/dataTypeTable'), name: 'dataTypeTable', meta: { title: '数据类型管理',roles: ['admin'], noCache: true}},
      { path: 'action-table', component: _import('data-manager/table/actionTable'), name: 'actionTable', meta: { title: '行为管理',roles: ['admin'], noCache: true}},
      { path: 'actiontype-table', component: _import('data-manager/table/actionType'), name: 'actionType', meta: { title: '行为类型管理',roles: ['admin'], noCache: true}},
      { path: 'background', component: _import('data-manager/table/background'), name: 'backgroundTable', meta: { title: '背景管理',roles: ['admin'], noCache: true}},
      { path: 'project', component: _import('data-manager/table/project'), name: 'project', meta: { title: '项目管理',roles: ['user'], noCache: true}},
      { path: 'demand', component: _import('data-manager/table/demand'), name: 'demand', meta: { title: '需求管理',roles: ['user'], noCache: true}}

     // { path: 'tab/index', icon: 'tab', component: _import('data-manager/tab/index'), name: 'tab', meta: { title: 'tab' }}
    ]
  },
  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'errorPages',
  //   meta: {
  //     title: 'errorPages',
  //     icon: '404'
  //   },
  //   children: [
  //     { path: '401', component: _import('errorPage/401'), name: 'page401', meta: { title: 'page401', noCache: true }},
  //     { path: '404', component: _import('errorPage/404'), name: 'page404', meta: { title: 'page404', noCache: true }}
  //   ]
  // },
  { path: '*', redirect: '/404', hidden: true }
]
