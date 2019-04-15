import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

const Error404 = () => import('../views/ErrorTip');
const Login = () => import('../views/Login');

//引入分块路由
import base_routes_cfg from './basic_routes_cfg';

let routes = [];
//合并分块路由
routes = base_routes_cfg;

//默认路由
const default_routes_cfg = [
        { path: '/', redirect: { name: 'login' }},
        { path: '/login',name:'login',component: Login},
        { path: '*',name:'errorPage',component: Error404, meta: { scrollToTop: true }}
];
//合并默认路由
routes = routes.concat(default_routes_cfg);

export default new Router({
    //mode: 'history',
    base: __dirname,
    scrollBehavior (to, from, savedPosition) {
        //这里只有在mode=history模式下才有用
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    },
    routes: routes
});
