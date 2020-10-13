// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const path=require('path')
const { REACT_APP_ENV } = process.env;
function resolve(dir:string){
  return path.join(__dirname,dir)
}
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  chainWebpack(config){
   config.module
   .rule('svg')
   .exclude.add(/pages/)
   .end()// 给内置的添加 exclude，这里根据自己的情况处理

   config.module
   .rule('svgr')
   .test(/\.svg(\?v=\d+\.\d+\.\d+)?$/)
   .include.add(/pages/)
   .end()// include 指定需要直接 svgr 的情况
   .use('@svgr/webpack')
   .loader(require.resolve('@svgr/webpack'))
   .end()
  },


  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/login',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/login',
          component: './login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/home',
            },
            {
              path: '/home',
              name: 'home',
              icon: 'smile',
              component: './Home',
            },
            {
            path:'/user',
            name:'用户管理',
            icon:'user',
            // component:'./user/list',
            routes:[
              // {
              //   paht:'/user',
              //   redirect:'/user/list'
              // },
              {
                path:'/user/list',
                name:'用户列表',
                icon:'user',
                component:'./user/list'
              },
              {
                path:'/user/center',
                name:'用户信息',
                icon:'user',
                component:'./user/center'
              }
            ]
            },
            {
              path: '/admin',
              name: 'admin',
              icon: 'crown',
              component: './Admin',
              authority: ['admin'],
              routes: [
                {
                  path: '/admin/sub-page',
                  name: 'sub-page',
                  icon: 'smile',
                  component: './Home',
                  authority: ['admin'],
                },
              ],
            },
            {
              name: 'list.table-list',
              icon: 'table',
              path: '/list',
              component: './ListTableList',
            },
            {
              name: '空白页面',
              icon: 'smile',
              path: '/emptypage',
              component: './EmptyPage',
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
