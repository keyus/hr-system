import Vue from 'vue'
import Router from 'vue-router'
import cookie from '../util/cookie'

import Login from '../view/login/login'
import MainView from '../view/main'
import Depart from '../view/manpower/depart'
import Project from '../view/manpower/project'
import Member from '../view/manpower/member'
import MemberChange from '../view/manpower/memberChange'
import Manage from '../view/platform/manage'
import Loginst from '../view/platform/loginst'
import Log from '../view/platform/log'
import Error_403 from '../view/error/403'
import Error_404 from '../view/error/404'
import Error_500 from '../view/error/500'
import Logout from '../view/logout'

Vue.use(Router);


const instance = new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: MainView,
            children: [
                {
                    path: '/',
                    name: 'depart',
                    component: Depart,
                },
                //部门
                {
                    path: 'depart',
                    name: 'depart',
                    component: Depart,
                },
                //项目
                {
                    path: 'project',
                    name: 'project',
                    component: Project,
                },
                //成员
                {
                    path: 'member',
                    name: 'member',
                    component: Member,
                },
                //成员变更
                {
                    path: 'memberChange',
                    name: 'memberChange',
                    component: MemberChange,
                },
                //管理员信息
                {
                    path: 'manager',
                    name: 'manager',
                    component: Manage,
                },
                //登陆策略
                {
                    path: 'loginst',
                    name: 'loginst',
                    component: Loginst,
                },
                //系统日志
                {
                    path: 'log',
                    name: 'log',
                    component: Log,
                },
                {
                    path: 'error/500',
                    name: 'error',
                    component: Error_500
                }
            ]
        },
        {
            path: '/logout',
            name: 'logout',
            component: Logout
        },
        {
            path: '/error/403',
            name: 'error',
            component: Error_403
        },
        {
            path: '/error/404',
            name: 'error',
            component: Error_404
        },

    ]
})


instance.beforeEach((to, from, next) => {
    if (!to.name) {
        next({path: '/error/404'});
        return;
    }
    if (to.name !== 'login' && to.name !== 'error') {
        if (!cookie.getItem('JSESSIONID')) {
            next({path: '/error/403'});
            return;
        }
    }
    next();
})
export default instance;
