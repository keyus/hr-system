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
                                        <div class="ant-form-item-label"><label title="规则编号">关键字</label></div>
                                        <div class="ant-form-item-control-wrapper">
                                            <div class="ant-form-item-control "><input type="text" placeholder="部门名称"
                                                                                       @keyup.enter="init('search')"
                                                                                       v-model="keywords"
                                                                                       class="ant-input">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="ant-col-sm-24 ant-col-md-8"
                                     style="padding-left: 24px; padding-right: 24px;"><span
                                    class="submitButtons___16_VM"><a href="javascript:;"
                                                                     class="ant-btn ant-btn-primary"
                                                                     @click="init('search')"><span>检 索</span></a></span>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="tableListOperator____5-oc" v-if="user.auth">
                        <el-button type="primary" icon="el-icon-plus" size="small"  @click="openCreate">新增部门</el-button>
                    </div>
                </div>

                <!--表格-->
                <div class="ant-table-wrapper">
                    <div class="ant-spin-nested-loading">
                        <div class="ant-spin-container">
                            <div class="ant-table ant-table-large ant-table-scroll-position-left">
                                <div class="ant-table-content">
                                    <div class="ant-table-body">
                                        <table>
                                            <thead class="ant-table-thead">
                                            <tr>
                                                <th class=""><span>部门名称</span></th>
                                                <th class=""><span>部门项目数量</span></th>
                                                <th class=""><span>部门在职人员</span></th>
                                                <th class=""><span>创建时间</span></th>
                                                <th class=""><span>操作</span></th>
                                            </tr>
                                            </thead>
                                            <tbody class="ant-table-tbody">
                                            <tr class="ant-table-row  ant-table-row-level-0" :key="it.guid" v-for="it in list">
                                                <td>
                                                    <router-link
                                                            :to="{path : '/dashboard/project', query : { departmentId : it.guid , departmentName : it.name } }">
                                                        <el-tag class="dtag">{{it.name}}</el-tag>
                                                    </router-link>
                                                </td>
                                                <td>{{it.projectCount}}</td>
                                                <td>{{it.inJobCount}}</td>
                                                <td>{{it.createTime | time}}</td>
                                                <td>
                                                    <router-link
                                                        :to="{path : '/dashboard/project', query : { departmentId : it.guid , departmentName : it.name } }">
                                                        部门项目
                                                    </router-link>
                                                    <template v-if="user.auth">
                                                        <div class="ant-divider ant-divider-vertical"></div>
                                                        <a href="javascript:;"  @click="openUpdate(it)">修改</a>
                                                        <div class="ant-divider ant-divider-vertical"></div>
                                                        <a href="javascript:;" @click="deleteDepart(it)"
                                                           v-if="user.auth">删除</a>
                                                    </template>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="pagebar">
                    <div>共计{{list.length}}个部门</div>
                </div>

                <el-dialog
                    title="添加部门"
                    :visible.sync="addDialogVisible"
                    width="30%"
                >
                    <el-form ref="createform" :rules="rules" :model="createForm" label-width="80px">
                        <el-form-item label="部门名称" prop="name">
                            <el-input v-model="createForm.name"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">确认添加</el-button>
                        </el-form-item>
                    </el-form>
                </el-dialog>

                <el-dialog
                    title="修改部门"
                    :visible.sync="updateDialogVisible"
                    width="30%"
                >
                    <el-form ref="updateform" :rules="rules" :model="updateForm" label-width="80px">
                        <el-form-item label="部门名称" prop="name">
                            <el-input v-model="updateForm.name"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="updateDepart">确认修改</el-button>
                        </el-form-item>
                    </el-form>
                </el-dialog>

            </div>
        </div>

    </div>
</template>
<script>
    import loadingPage from '../../mixin/loadingPage'

    import {mapState} from 'vuex'

    export default {
        mixins: [loadingPage],
        data() {
            return {
                addDialogVisible: false,
                updateDialogVisible: false,

                keywords: '',
                list: [],

                createForm: {
                    name: ''
                },
                updateForm: {
                    guid: '',
                    name: ''
                },

                //当前修改项
                currentUpdate: {},

                rules: {
                    name: [
                        {required: true, message: '请输入部门名称', trigger: 'change'},
                    ],
                }
            }
        },
        created() {
            this.init();
        },
        computed: {
            ...mapState({
                user: 'user',
            })
        },
        methods: {
            //初始化列表
            async init(isSearch) {
                this.loading = true;
                this.list = [];

                try {
                    let res = await this.$api.departList(isSearch ? {keywords: this.keywords} : '');
                    if (res.data.code === 200) {
                        this.list = res.data.data.content;
                    }
                } catch (e) {
                    this.$message.error('网络错误，请稍候再试');
                }

                this.pageSuccess();     //页面进度条，设置加载完成
            },
            openCreate() {
                this.$refs.createform && this.$refs.createform.resetFields();
                this.addDialogVisible = true;
            },
            //修改对话框
            openUpdate(item) {
                this.updateDialogVisible = true;
                this.currentUpdate = item;
                this.updateForm = Object.assign({}, item);
            },

            //添加部门
            onSubmit() {

                this.$refs.createform.validate(async (valid) => {

                    if (valid) {
                        try {
                            let res = await this.$api.createDepart(this.createForm);

                            if (res.data.code === 200) {

                                this.$message({
                                    showClose: true,
                                    message: '部门添加成功',
                                    type: 'success'
                                });

                                this.list.unshift(res.data.data);
                                this.addDialogVisible = false;

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

            //修改部门
            async updateDepart() {
                this.$refs.updateform.validate(async (valid) => {
                    if (valid) {
                        try {
                            let res = await this.$api.updateDepart(this.updateForm);

                            if (res.data.code === 200) {

                                this.$message({
                                    showClose: true,
                                    message: '部门修改成功',
                                    type: 'success'
                                });
                                this.currentUpdate.name = this.updateForm.name;
                                this.updateDialogVisible = false;

                            } else {

                                this.$message.error(res.data.msg);

                            }

                        } catch (e) {

                            this.$message.error('网络错误，请稍候再试');

                        }

                    }
                })
            },
            //删除部门
            async deleteDepart(item) {
                await this.$confirm('确认删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
                try {
                    await this.$api.deleteDepart(item.guid);
                    this.list.splice(this.list.indexOf(item), 1);
                } catch (e) {
                    this.$message.error('网络错误，请稍候重试');
                }
            },
        }
    }
</script>

