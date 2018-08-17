/**
 * auth :1  需要的是超管权限
 */
export default [
    {
        name: '人力资源管理',
        icon: 'el-icon-bell',
        url: '/dashboard',
        children: [
            {
                name: '部门信息',
                tag: 'depart',
                icon: '',
                url: '/dashboard/depart',
            }, {
                name: '项目信息',
                tag: 'project',
                icon: '',
                url: '/dashboard/project'
            }, {
                name: '成员信息',
                tag: 'member',
                icon: '',
                url: '/dashboard/member'
            }, {
                name: '成员变更日志',
                tag: 'memberChange',
                icon: '',
                url: '/dashboard/memberChange'
            },
        ]
    },
    {
        name: '平台管理',
        icon: 'el-icon-upload',
        url: '/dashboard/manager',
        children: [
            {
                name: '管理员信息',
                tag: 'manager',
                icon: '',
                url: '/dashboard/manager',
            }, {
                name: '登陆策略',
                tag: 'loginst',
                icon: '',
                url: '/dashboard/loginst',
                auth : true,
            }, {
                name: '系统日志',
                tag: 'log',
                icon: '',
                url: '/dashboard/log',
                auth : true,
            }, {
                name: '退出登录',
                icon: '',
                url: '/logout'
            },
        ]
    },
]
