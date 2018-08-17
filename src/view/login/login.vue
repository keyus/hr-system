<template>
    <div class="login">
        <div class="login-auth">
            <div class="login-auth-logo">
                <span><img src="../../assets/logo-light-icon.png" alt=""></span>
                <span class="text">控制台登录入口</span>
            </div>
            <div class="login-auth-form">
                <div class="login-error" v-if="error"><i class="el-icon-error"></i>{{ error_msg }}</div>
                <div class="login-auth-input">
                    <span class="login-auth-input__icon"><i class="el-icon-location-outline"></i></span>
                    <input type="text"
                           @keyup="keyup"
                           v-model="user"
                           autocomplete="off"
                           placeholder="请输入用户名" />
                </div>
                <div class="login-auth-input">
                    <span class="login-auth-input__icon"><i class="el-icon-edit"></i></span>
                    <input type="password"
                           @keyup="keyup"
                           v-model="password"
                           autocomplete="off"
                           placeholder="请输入登录密码" />
                </div>

                <div class="login-auth-remember">
                    <div class="remember"><el-checkbox v-model="checked">记住用户名</el-checkbox></div>
                    <div class="forget"><i class="el-icon-upload"></i>忘记密码？</div>
                </div>

                <div class="login-submit">
                    <button @click="submit">登 录</button>
                </div>

                <div class="interface">
                    <span class="dian-si"></span>
                    <span class="dian-re"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import cookie from '../../util/cookie'

    export default {
        name: "login",
        data() {
            return {
                user: '',
                password: '',
                error: false,
                error_msg : '用户名或密码错误',
                userEmpty: false,
                passwordEmpty: false,
                checked : false,
            }
        },
        mounted() {
            if (this.isLogin()) {
                this.$message({
                    message: '登录成功，跳转中...',
                    type: 'success'
                });
                setTimeout(() => {
                    this.jump();
                }, 1000)
            }
            ;
        },
        methods: {
            keyup(e) {
                if(e.keyCode !== 13){
                    this.error = false;
                    this.userEmpty = this.user ? false : true;
                    this.passwordEmpty = this.password ? false : true;
                }
            },
            async submit() {
                if (!this.check()) return;

                try {
                    let res = await this.$api.login({
                        username: this.user,
                        pwd: this.password,
                    })

                    if (res.data.code === 200) {
                        cookie.setItem('user', JSON.stringify(res.data.data), '20000', '/');
                        this.$store.commit('updateUser', res.data.data);
                        this.jump();
                    } else {
                        this.error_msg = res.data.msg;
                        this.error = true;
                    }
                } catch (e) {
                    this.$message.error('网络错误，请稍候再试')
                }
            },
            check() {
                if (!this.user || !this.password) {
                    this.error_msg = '用户名或密码填写不完整';
                    this.error = true;
                    return false;
                }
                return true;
            },

            jump() {
                this.$router.push('/dashboard');
            },

            //检测是否登录
            isLogin() {
                if (cookie.getItem('JSESSIONID')) {
                    return true;
                }
                return false;
            }
        }
    }
</script>


