<template>
    <div class="content___13wW7">
        <div class="ant-card ant-card-wider-padding">
            <div class="ant-card-body">
                <div class="tableList___1l7ro">
                    <div class="tableListForm___1316u">
                        <form class="ant-form ant-form-inline">
                            <div class="ant-row" style="margin-left: -24px; margin-right: -24px;">
                                <div class="ant-col-sm-24 ant-col-md-8"
                                     style="padding-left: 24px; padding-right: 24px;">
                                    <div class="ant-row ant-form-item">
                                        <div class="ant-form-item-label"><label>关键字</label></div>
                                        <div class="ant-form-item-control-wrapper">
                                            <div class="ant-form-item-control "><input type="text" placeholder="账号/姓名"
                                                                                       v-model="keywords"
                                                                                       @keyup.enter="init()"
                                                                                       class="ant-input">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="ant-col-sm-24 ant-col-md-8"
                                     style="padding-left: 24px; padding-right: 24px;"><span
                                    class="submitButtons___16_VM"><button type="submit" class="ant-btn ant-btn-primary"
                                                                          @click="init()"><span>检 索</span></button></span>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="tableListOperator____5-oc">
                        <el-button type="primary" icon="el-icon-plus" size="small"  @click="openCreate"  v-if="user.auth">新增管理员</el-button>
                    </div>
                </div>

                <!--表格-->
                <div class="ant-table-wrapper"
                >
                    <div class="ant-spin-nested-loading">
                        <div class="ant-spin-container">
                            <div class="ant-table ant-table-large ant-table-scroll-position-left">
                                <div class="ant-table-content">
                                    <div class="ant-table-body">
                                        <table v-loading="loadingPageNext">
                                            <thead class="ant-table-thead">
                                            <tr>
                                                <th class=""><span>管理账号</span></th>
                                                <th class=""><span>管理员姓名</span></th>
                                                <th class=""><span>管理员类型</span></th>
                                                <th class=""><span>手机号码</span></th>
                                                <th class=""><span>是否启用</span></th>
                                                <th class=""><span>允许登录IP</span></th>
                                                <th class=""><span>创建时间</span></th>
                                                <th class=""><span>操作</span></th>
                                            </tr>
                                            </thead>
                                            <tbody class="ant-table-tbody">
                                            <template v-for="it in userList">
                                                <tr class="ant-table-row  ant-table-row-level-0" :key="it.guid" v-if="user.auth || user.guid === it.guid">
                                                    <td>{{it.account}}</td>
                                                    <td>{{it.name}}</td>
                                                    <td>{{it.auth | type}}</td>
                                                    <td>{{it.phoneNumber}}</td>
                                                    <td><span class="el-tag"
                                                              :class="{'el-tag--success': it.state, 'el-tag--danger' : !it.state}">{{it.state | userState}}</span>
                                                    </td>
                                                    <td>{{it.ipaddress || '不限制'}}</td>
                                                    <td>{{it.createTime | time}}</td>
                                                    <td>

                                                        <template v-if="user.auth && user.guid !== it.guid">
                                                            <a href="javascript:;" @click="changeState(it)">
                                                                <template v-if="it.state">禁用</template>
                                                                <template v-else>启用</template>
                                                            </a>
                                                            <div class="ant-divider ant-divider-vertical"></div>
                                                        </template>

                                                        <template v-if="user.auth && user.guid !== it.guid">
                                                            <a href="javascript:;" @click="deleteUser(it)">删除</a>
                                                            <div class="ant-divider ant-divider-vertical"></div>
                                                        </template>

                                                        <a href="javascript:;" @click="openUpdate(it)">修改</a>
                                                    </td>
                                                </tr>
                                            </template>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="pagebar">
                    <div>当前{{total}}位管理员</div>
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        @current-change="trunPage"
                        :page-size="pageSize"
                        :total="total">
                    </el-pagination>
                </div>


                <el-dialog
                    title="添加管理员"
                    :visible.sync="addDialogVisible"
                    width="30%"
                >
                    <el-form ref="createform" :rules="rules" :model="createForm" label-width="90px" v-loading="loading">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="createForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="帐号" prop="account">
                            <el-input v-model="createForm.account"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号">
                            <el-input v-model="createForm.phoneNumber"></el-input>
                        </el-form-item>
                        <el-form-item label="管理员类型">
                            <el-select v-model="createForm.auth" placeholder="请选择管理员类型" style="width:100%">
                                <el-option label="超级管理员" :value="1"></el-option>
                                <el-option label="普通管理员" :value="0"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="管理部门" v-show="createForm.auth === 0">
                            <el-select v-model="createForm.departmentId" placeholder="请选择管理部门" style="width:100%">
                                <el-option label="请选择管理部门" :value="0"></el-option>
                                <el-option :label="it.name" :value="it.guid" v-for="it in departList"
                                           :key="it.guid"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="初始密码" prop="password">
                            <el-input v-model="createForm.password"></el-input>
                        </el-form-item>
                        <el-form-item label="登录IP"  prop="ipaddress">
                            <el-input v-model="createForm.ipaddress"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">立即创建</el-button>
                        </el-form-item>
                    </el-form>
                </el-dialog>


                <el-dialog
                    title="修改管理员"
                    :visible.sync="updateDialogVisible"
                    width="30%"
                >
                    <el-form ref="updateForm" :rules="rules" :model="updateForm" label-width="90px" v-loading="loading">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="updateForm.name"></el-input>
                        </el-form-item>

                        <el-form-item label="帐号" prop="account">
                            <!--管理员帐号   本人不能修改自己的帐号   或者  登录用户非超级管理时，不能修改-->
                            <el-input v-model="updateForm.account"
                                      :disabled="user.account === updateForm.account || !user.state ? true : false"></el-input>
                        </el-form-item>

                        <el-form-item label="手机号">
                            <el-input v-model="updateForm.phoneNumber"></el-input>
                        </el-form-item>

                        <el-form-item label="管理员类型" v-if="user.account !== updateForm.account">
                            <el-select v-model="updateForm.auth" placeholder="请选择管理员类型" style="width:100%">
                                <el-option label="超级管理员" :value="1"></el-option>
                                <el-option label="普通管理员" :value="0"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="管理部门" v-if="user.account !== updateForm.account"
                                      v-show="updateForm.auth === 0">
                            <el-select v-model="updateForm.departmentId" placeholder="请选择管理部门" style="width:100%">
                                <el-option label="请选择管理部门" :value="0"></el-option>
                                <el-option :label="it.name" :value="it.guid" v-for="it in departList"
                                           :key="it.guid"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="密码">
                            <el-input v-model="updatePassword" placeholder="如不用修改密码，则不填写" type="password"></el-input>
                        </el-form-item>
                        <el-form-item label="登录IP"   prop="ipaddress">
                            <el-input v-model="updateForm.ipaddress"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="updateUser">确认修改</el-button>
                        </el-form-item>
                    </el-form>
                </el-dialog>

            </div>
        </div>

    </div>
</template>
<script>
    import {mapState} from 'vuex'
    import loadingPage from '../../mixin/loadingPage'

    export default {
        mixins: [loadingPage],
        data() {
            return {
                addDialogVisible: false,
                updateDialogVisible: false,
                loading: false,

                createForm: {
                    name: '',
                    account: '',
                    auth: 1,
                    password: '',
                    departmentId: 0,
                    phoneNumber: '',
                    ipaddress: '',
                },

                //修改表单
                updateForm: {
                    name: '',
                    account: '',
                    auth: 1,
                    password: '',
                    departmentId: 0,
                    ipaddress: '',
                },

                //修改密码
                updatePassword: '',

                pageNumber: 1,
                pageSize: 10,
                userList: [],
                total: 0,
                keywords: '',
                departList: [],

                //效验规则
                rules: {
                    name: [
                        {required: true, message: '请输入管理员姓名', trigger: 'change'},
                    ],
                    account: [
                        {required: true, message: '请输入帐号', trigger: 'change'},
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'change'},
                    ],
                    ipaddress: [
                        {validator: this.ipCheck, message: 'IP地址格式错误', trigger: 'change'},
                    ],
                },

                loadingPageNext : false
            }
        },
        computed: {
            ...mapState({
                user: 'user',
            })
        },

        created() {
            this.init();
        },

        methods: {

            //初始化列表
            async init(pageNumber) {
                this.pageNumber = pageNumber || 1;
                this.userList = [];
                try {
                    let res = await this.$api.userList({
                        pageNumber: this.pageNumber,
                        pageSize: this.pageSize,
                        keywords: this.keywords,
                    });
                    if (res.data.code === 200) {
                        this.total = res.data.data.totalElements;
                        this.userList = res.data.data.content;
                    }
                } catch (e) {

                }

                this.pageSuccess();     //页面进度条，设置加载完成
            },

            //拉取部门数据
            async initDepart() {
                if (!this.user.auth) return;
                this.loading = true;
                try {
                    let res = await this.$api.departList();
                    if (res.data.code === 200) {
                        this.departList = res.data.data.content;
                    }
                } catch (e) {
                    this.$message.error('加载部门数据失败，请稍候再试');
                }
                this.loading = false;
            },

            //打开对话框-新增管理对话框
            openCreate() {
                !this.departList.length && this.initDepart();
                this.createForm.phoneNumber = '';
                this.$refs.createform && this.$refs.createform.resetFields();
                this.addDialogVisible = true;
            },

            //打开对话框-修改管理对话框
            openUpdate(item) {
                !this.departList.length && this.initDepart();
                this.updateDialogVisible = true;
                this.updateForm = Object.assign({}, item);
            },

            //添加管理员
            async onSubmit() {
                this.$refs.createform.validate(async (valid) => {

                    if (valid) {
                        try {
                            let res = await this.$api.createUser(this.createForm);

                            if (res.data.code === 200) {
                                this.$message({
                                    showClose: true,
                                    message: '添加成功',
                                    type: 'success'
                                });
                                this.addDialogVisible = false;
                                this.init();
                            } else {
                                this.$message.error(res.data.msg);
                            }
                        } catch (e) {
                            this.$message.error('网络错误，请稍候再试');
                        }
                    } else {
                        return false;
                    }

                })

            },

            ipCheck (rule, value, callback) {
                if(value && !/([0-9]{1,3}\.{1}){3}[0-9]{1,3}/.test(value)){
                    return callback(new Error());
                }
                callback();
            },

            //删除管理员
            async deleteUser(item) {
                await this.$confirm('确认删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
                try {
                    let res = await this.$api.deleteUser(item.guid);
                    if (res.code === 200) {
                        this.init(this.pageNumber);
                        return;
                    }
                    this.$message.error(res.msg);
                } catch (e) {
                    this.$message.error('网络错误，请稍候重试');
                }
            },

            //翻页
            async trunPage(val) {
                this.pageNumber = val;
                try {
                    this.loadingPageNext = true;
                    let res = await this.$api.userList({
                        pageNumber: this.pageNumber,
                        pageSize: this.pageSize,
                        keywords: this.keywords,
                    });
                    if (res.data.code === 200) {
                        this.userList = res.data.data.content;
                    }
                    this.loadingPageNext = false;
                } catch (e) {
                    this.loadingPageNext = false;
                    this.$message.error('网络错误，请稍候再试')
                }
            },

            //变更状态
            async changeState(item) {
                try {
                    await this.$api.updateUser(item, true);
                    item.state = item.state ? 0 : 1;
                } catch (e) {
                    this.$message.error('网络错误，请稍候重试');
                }
            },

            async updateUser() {
                this.$refs.updateForm.validate(async (valid) => {

                    if (valid) {
                        try {
                            if (this.updatePassword) {
                                this.updateForm.password = this.updatePassword;
                            } else {
                                delete this.updateForm.password;
                            }
                            let res = await this.$api.updateUser(this.updateForm);

                            if (res.data.code === 200) {
                                this.$message({
                                    showClose: true,
                                    message: '管理员资料修改成功!',
                                    type: 'success'
                                });
                                this.updateDialogVisible = false;
                                this.init();
                            } else {
                                this.$message.error(res.data.msg);
                            }
                        } catch (e) {
                            this.$message.error('网络错误，请稍候再试');
                        }
                    } else {
                        return false;
                    }

                })
            }
        },

        filters: {
            type(val) {
                if (val === 1) return '超级管理员';
                else return '普通管理员'
            },
            userState(val) {
                if (val) return '启用';
                else return '禁用'
            }
        }
    }
</script>

