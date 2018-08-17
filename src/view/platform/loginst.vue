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
                                            <div class="ant-form-item-control "><input type="text" placeholder="名称/IP地址"
                                                                                       v-model="keywords"
                                                                                       @keyup.enter="init"
                                                                                       class="ant-input">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="ant-col-sm-24 ant-col-md-8"
                                     style="padding-left: 24px; padding-right: 24px;">
                  <span
                      class="submitButtons___16_VM"><a href="javascript:;" @click="init()"
                                                            class="ant-btn ant-btn-primary"><span>检 索</span></a>
                  </span></div>
                            </div>
                        </form>
                    </div>
                    <div class="tableListOperator____5-oc">
                        <el-button type="primary" icon="el-icon-plus" size="small"  @click="openCreate">新增IP</el-button>
                    </div>
                </div>

                <!--表格-->
                <div class="ant-table-wrapper">
                    <div class="ant-spin-nested-loading">
                        <div class="ant-spin-container">
                            <div class="ant-table ant-table-large ant-table-scroll-position-left">
                                <div class="ant-table-content">
                                    <div class="ant-table-body">
                                        <table v-loading="loadingPageNext">
                                            <thead class="ant-table-thead">
                                            <tr>
                                                <th class=""><span>编号</span></th>
                                                <th class=""><span>名称</span></th>
                                                <th class=""><span>IP地址</span></th>
                                                <th class=""><span>是否启用</span></th>
                                                <th class=""><span>创建时间</span></th>
                                                <th class=""><span>操作</span></th>
                                            </tr>
                                            </thead>
                                            <tbody class="ant-table-tbody">
                                            <tr class="ant-table-row  ant-table-row-level-0" :key="it.guid" v-for="it in list">
                                                <td>{{it.guid}}</td>
                                                <td>{{it.name}}</td>
                                                <td>{{it.ipaddress}}</td>
                                                <td>
                                                    <span class="el-tag"
                                                          :class="{'el-tag--success' : it.state, 'el-tag--danger' : !it.state}">{{it.state | ipState}}</span>

                                                </td>
                                                <td>{{it.createTime | time}}</td>
                                                <td>
                                                    <a href="javascript:;" @click="changeState(it)">
                                                        <template v-if="it.state">禁用</template>
                                                        <template v-else>启用</template>
                                                    </a>
                                                    <div class="ant-divider ant-divider-vertical"></div>
                                                    <a href="javascript:;" @click="deleteLoginst(it)">删除</a>
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
                    <div>当前共计{{total}}条记录</div>
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        @current-change="trunPage"
                        :page-size="pageSize"
                        :total="total">
                    </el-pagination>
                </div>

                <el-dialog
                    title="添加IP"
                    :visible.sync="addDialogVisible"
                    width="30%"
                >
                    <el-form ref="createform" :rules="rules" :model="createForm" label-width="80px">
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="createForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="IP地址" prop="ipaddress">
                            <el-input v-model="createForm.ipaddress"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">确认添加</el-button>
                        </el-form-item>
                    </el-form>


                </el-dialog>

            </div>
        </div>
    </div>
</template>

<script>
    import loadingPage from '../../mixin/loadingPage'

    export default {
        name: "depart",
        mixins: [loadingPage],
        data() {
            return {
                addDialogVisible: false,
                createForm: {
                    name: '',
                    ipaddress: ''
                },
                pageNumber: 1,
                pageSize: 10,
                list: [],
                total: 0,
                keywords: '',

                rules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'change'},
                    ],
                    ipaddress: [
                        {required: true, message: '请输入IP地址', trigger: 'change'},
                        {pattern: /([0-9]{1,3}\.{1}){3}[0-9]{1,3}/, message: 'IP地址格式错误'}
                    ],
                },
                loadingPageNext:false,
            }
        },
        created() {
            this.init();
        },
        methods: {
            async init(pageNumber) {
                this.pageNumber = pageNumber || 1;
                this.loading = true;
                this.list = [];
                try {
                    let res = await this.$api.loginstList({
                        pageNumber: this.pageNumber,
                        pageSize: this.pageSize,
                        keywords: this.keywords,
                    });
                    if (res.data.code === 200) {
                        this.total = res.data.data.totalElements;
                        this.list = res.data.data.content;
                    }
                } catch (e) {

                }

                this.pageSuccess();     //页面进度条，设置加载完成
            },

            //翻页
            async trunPage(val) {
                this.pageNumber = val;
                try {
                    this.loadingPageNext = true;
                    let res = await this.$api.loginstList({
                        pageNumber: this.pageNumber,
                        pageSize: this.pageSize,
                        keywords: this.keywords,
                    });
                    if (res.data.code === 200) {
                        this.list = res.data.data.content;
                    }
                    this.loadingPageNext = false;
                } catch (e) {
                    this.loadingPageNext = false;
                    this.$message.error('网络错误，请稍候再试')
                }
            },

            openCreate() {
                this.$refs.createform && this.$refs.createform.resetFields();
                this.addDialogVisible = true;
            },

            //删除列表项
            async deleteLoginst(item) {

                await this.$confirm('确认删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
                await this.$api.deleteLoginst(item.guid);
                this.init(this.pageNumber);

            },
            //修改
            async changeState(item) {
                let state = item.state ? 0 : 1;
                await this.$api.updateLoginst(item.guid, state);
                item.state = !item.state;
            },
            //新加
            onSubmit() {
                this.$refs.createform.validate(async (valid) => {
                    if (valid) {
                        try {
                            let res = await this.$api.createLoginst(this.createForm);
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
                });
            }
        },
        filters: {
            ipState(val) {
                if (val) return '启用';
                else return '禁用'
            }
        }
    }
</script>

