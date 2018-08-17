<template>
    <div class="app">
        <div class="app-main">
            <div class="app-side">
                <div class="logo">
                    <img src="../assets/logo-light-icon.png" alt="">
                    <img src="../assets/logo-light-text.png" alt="">
                </div>
                <ul class="app-side-menu">
                    <li class="item"
                        :class="{'ant-menu-submenu-open' : it.expand }"
                        v-for="it in menus">
                        <h5> <i :class="it.icon"></i>{{it.name}}</h5>
                        <ul>
                            <template v-for="children in it.children">
                                <li v-if="!children.auth || (children.auth && user.auth)" :class="{ 'selected' : children.tag === routeName }">
                                    <router-link :to="children.url"> {{children.name}} </router-link>
                                </li>
                            </template>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="app-body">
                <div class="app-position">
                    <div class="now">
                        <span v-for="it in position">
                            <span class="ant-breadcrumb-link">
                              {{it.name}}
                            </span>
                            <span class="ant-breadcrumb-separator">/</span>
                        </span>
                    </div>
                    <el-dropdown  @command="handleCommand">
                        <div class="user">
                            <span>{{user.account}}</span>
                            <span>
                                <template v-if="user.auth">超管</template>
                                <template v-else>部门管理员　所在部门： {{user.departmentName}}</template>
                            </span>
                            <span class="avtar"><img src="../assets/avtar.jpg" alt=""></span>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item  command="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div class="app-page">
                    <div class="app-page-title">
                        <h1>{{ Array.isArray(position) && position[1] ? position[1].name : ''}}</h1>
                    </div>
                    <router-view/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import menus from '../config/menus'
    import position from '../config/position'
    import nprogress from '../util/nprogress'
    import cookie from '../util/cookie'
    import {mapState} from 'vuex'

    export default {
        data() {
            return {
                menus,
                position: [],      //当前位置
                routeName: '',     //路由名称
            }
        },
        watch: {
            '$route': {
                immediate: true,
                handler(val) {
                    this.parsePosition(val);
                }
            },
            loadingPage(val) {
                val ? nprogress.start() : nprogress.done();
            }
        },
        computed: {
            ...mapState({
                loadingPage: 'loadingPage',
                user: 'user',
            })
        },
        methods: {
            //解析当前位置
            parsePosition(route) {
                let name = route.name;
                if (name && name !== 'logout') {
                    this.routeName = name;
                    this.position = position[name];
                }
            },
            toggle(item) {

                if (item.hasOwnProperty('expand')) {
                    item.expand = !item.expand;
                    return;
                }

                this.$set(item, 'expand', true);
            },

            handleCommand(val) {
                console.log(val);
                if (val === 'logout') {
                    cookie.keys().forEach(key => cookie.removeItem(key));
                    this.$router.push('/login');
                }
            }
        }
    }
</script>

