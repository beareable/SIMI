const Login = () => import('../views/Login');
const Frame = () => import('../views/Frame');
const Home = () => import('../views/Home');
const Error404 = () => import('../views/ErrorTip');
const personalInfo = () => import('../views/admin/PersonalInfo');
//submenu1
const submenuOne = () => import('../views/example/submenuOne/list');
//submenu2
const submenuTwo = () => import('../views/example/submenuTwo/list');
//submenu3
const submenuThree = () => import('../views/example/submenuThree/list');

const router = [
        { 
            path: '/admin', name:'Frame',  component: Frame,
            children: [
                { path: 'login',name:'Login',component: Login},
                { path: 'home',name:'adminHome',component: Home},
                { path: 'personalInfo',name:'personalInfo',component: personalInfo},
                { path: 'submenuOne',name:'submenuOne',component: submenuOne},
                { path: 'submenuTwo',name:'submenuTwo',component: submenuTwo},
                { path: 'submenuThree',name:'submenuThree',component: submenuThree},
                { path: 'notAccess',name:'notAccess',component: Error404, meta: { scrollToTop: true }},
                { path: '*',name:'error',component: Error404, meta: { scrollToTop: true }}
            ]
        }
    ];
export default router; 