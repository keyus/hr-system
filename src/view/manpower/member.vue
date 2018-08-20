<template>
    <div class="content___13wW7">

        <div class="pageHeader___Pze-l" v-if="querystring.projectName && querystring.projectId">
            <div class="detail___1rfGA">
                <div class="main___3Slzs">
                    <div class="row___3eawN">
                        <h1 class="title___3uDQf">
                            {{querystring.projectName}} 的成员
                            <router-link to="/dashboard/member">查看所有成员</router-link>
                        </h1>
                    </div>
                    <div class="row___3eawN"></div>
                </div>
            </div>
        </div>

        <div class="ant-card ant-card-wider-padding">
            <div class="ant-card-body">
                <div class="tableList___1l7ro">
                    <div class="tableListForm___1316u">
                        <form class="ant-form ant-form-inline">
                            <div class="ant-row" style="margin-left: -24px; margin-right: -24px;">

                                <div class="ant-col-sm-24 ant-col-md-6" style="padding-left: 24px; padding-right: 24px;"
                                     v-if="!querystring.projectId  && !querystring.projectId">
                                    <div class="ant-row ant-form-item">
                                        <div class="ant-form-item-label"><label>部门筛选</label></div>
                                        <div class="ant-form-item-control-wrapper">
                                            <div class="ant-form-item-control ">
                                                <select class="ant-select-selection ant-select-selection--single"
                                                        v-model="departmentId" style="width: 100%"
                                                        @change="changeSelect">
                                                    <option :value="0">请选择</option>
                                                    <option v-for="it in departList" :key="it.department.guid" :value="it.department.guid">
                                                        {{it.department.name}}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="ant-col-sm-24 ant-col-md-6" style="padding-left: 24px; padding-right: 24px;"
                                     v-if="!querystring.projectId  && !querystring.projectId">
                                    <div class="ant-row ant-form-item">
                                        <div class="ant-form-item-label"><label>项目筛选</label></div>
                                        <div class="ant-form-item-control-wrapper">
                                            <div class="ant-form-item-control ">
                                                <select class="ant-select-selection ant-select-selection--single"
                                                        v-model="projectId" style="width: 100%">
                                                    <option :value="0">请选择</option>
                                                    <option v-for="it in projectList" :key="it.guid" :value="it.guid">{{it.name}}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="ant-col-sm-24 ant-col-md-8"
                                     style="padding-left: 24px; padding-right: 24px;">
                                    <div class="ant-row ant-form-item">
                                        <div class="ant-form-item-label"><label>关键字</label></div>
                                        <div class="ant-form-item-control-wrapper">
                                            <div class="ant-form-item-control "><input type="text"
                                                                                       placeholder="姓名/祖籍/护照"
                                                                                       v-model="keywords"
                                                                                       @keyup.enter="init()"
                                                                                       class="ant-input"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="ant-col-sm-24 ant-col-md-4"
                                     style="padding-left: 24px; padding-right: 24px;"><span
                                    class="submitButtons___16_VM"><a href="javascript:;" class="ant-btn ant-btn-primary"
                                                                          @click="init()"><span>检 索</span></a></span>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="tableListOperator____5-oc ant-row-flex ant-row-flex-middle">
                        <div class="flex-auto">
                        <el-button type="primary" icon="el-icon-plus" size="small"  @click="openCreate">新增成员</el-button>
                        <el-button type="primary" icon="el-icon-upload2" size="small" @click="openImport">批量导入成员</el-button>
                        <el-button type="primary" icon="el-icon-download" size="small" @click="downloadMember">导出</el-button>
                        </div>
                        <div>
                            <a href="javascript:;" @click="downloadTemplate">下载批量导入模板</a>
                        </div>
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
                                                <th class=""><span>姓名</span></th>
                                                <th class=""><span>性别</span></th>
                                                <th class=""><span>所属部门</span></th>
                                                <th class=""><span>所属项目</span></th>
                                                <th class=""><span>祖籍</span></th>
                                                <th class=""><span>护照号码</span></th>
                                                <th class=""><span>
                            护照照片
                            <el-tooltip class="item" effect="dark" content="点击图片可查看大图" placement="top-start">
                              <i class="el-icon-question" style="color: #ff6600"></i>
                            </el-tooltip>
                          </span></th>
                                                <th class=""><span>在/离职</span></th>
                                                <th class=""><span>备注</span></th>
                                                <th class=""><span>创建时间</span></th>
                                                <th class=""><span>操作</span></th>
                                            </tr>
                                            </thead>
                                            <tbody class="ant-table-tbody">
                                            <tr class="ant-table-row  ant-table-row-level-0" :key="it.guid" v-for="it in list">
                                                <td>
                                                    <!--离职-->
                                                    <template v-if="it.state === 1">
                                                        <el-tag class="big-tag" type="danger">{{it.name}}</el-tag>
                                                    </template>
                                                    <!--正常-->
                                                    <template v-else>
                                                        <el-tag class="big-tag">{{it.name}}</el-tag>
                                                    </template>
                                                </td>
                                                <td>{{it.sex | sex}}</td>
                                                <td>{{it.departmentName}}</td>
                                                <td>{{it.projectName}}</td>
                                                <td>{{it.descent}}</td>
                                                <td>{{it.passportNo}}</td>
                                                <td>
                                                    <images :name="it.passportPhotoUrl"></images>
                                                </td>
                                                <td>
                                                    <template v-if="it.state !== 1">
                                                        <el-tag>{{it.state | memberState}}</el-tag>
                                                    </template>
                                                    <template v-else>
                                                        <el-tag type="danger">{{it.state | memberState}}</el-tag>
                                                    </template>
                                                </td>
                                                <!--{{it.state | memberState}}-->
                                                <td>
                                                    {{it.remarks}}
                                                </td>
                                                <td>{{it.createTime | time}}</td>
                                                <td>
                                                    <a href="javascript:;" @click="openUpdate(it)">修改</a>
                                                    <div class="ant-divider ant-divider-vertical"></div>
                                                    <a href="javascript:;" @click="deleteMember(it)">删除</a>
                                                    <div class="ant-divider ant-divider-vertical"></div>
                                                    <a href="javascript:;" @click="openMove(it)">转移</a>
                                                    <div class="ant-divider ant-divider-vertical"></div>
                                                    <a href="javascript:;" @click="leave(it)"
                                                       v-if="it.state !== 1">离职</a>
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
            </div>
        </div>

        <!--添加成员-->
        <add-member :visible.sync="addDialogVisible" :depart-list="departList" @init="init()" />
        <!--修改成员-->
        <update-member :visible.sync="updateDialogVisible" :item="currentUpdate" :depart-list="departList"
                       @init="init(pageNumber)" />
        <!--批量导入-->
        <importMember :visible.sync="importDialogVisible" />

        <!--转移成员-->
        <el-dialog
            title="转移成员"
            :visible.sync="moveDialogVisible"
            width="30%"
        >
            <el-form ref="moveForm" :model="moveForm" label-width="80px">
                <el-form-item label="所属部门">
                    <el-select v-model="moveForm.departmentId" style="width:100%" @change="changeMove">
                        <el-option label="请选择部门" :value="0"></el-option>
                        <el-option :label="it.department.name" :value="it.department.guid" v-for="it in departList"
                                   :key="it.department.guid"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="所属项目">
                    <el-select v-model="moveForm.projectId" style="width:100%">
                        <el-option label="请选择项目" :value="0"></el-option>
                        <el-option :label="it.name" :value="it.guid" v-for="it in moveProjectList"
                                   :key="it.guid"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="moveUpdate">确认转移</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import loadingPage from '../../mixin/loadingPage'

    import addMember from './addMember'
    import updateMember from './updateMember'
    import importMember from './importMember'
    import instance from "../../router";

    export default {
        mixins: [loadingPage],
        components: {
            addMember,
            updateMember,
            importMember,
        },
        data() {
            return {
                addDialogVisible: false,
                updateDialogVisible: false,
                moveDialogVisible: false,
                importDialogVisible: false,
                loadingPageNext: false,
                fileList2: [],

                moveForm: {
                    departmentId: 0,
                    projectId: 0
                },

                // url参数
                querystring: {
                    projectId: this.$route.query.projectId,
                    projectName: this.$route.query.projectName,
                },

                //search
                departmentId: 0,
                projectId: 0,

                pageNumber: 1,
                pageSize: 20,
                list: [],
                total: 0,
                keywords: '',
                departList: [],
                projectList: [],


                moveProjectList: [],

                //当前修改项
                currentUpdate: {}
            }
        },
        computed: {
            ...mapState({
                user: 'user'
            })
        },
        watch: {
            '$route'(val) {
                this.querystring.projectId = val.query.projectId;
                this.querystring.projectName = val.query.projectName;
                this.init();
            }
        },
        created() {
            this.init();
            this.initDP();
        },
        methods: {
            //初始化列表
            async init(pageNumber) {
                this.pageNumber = pageNumber || 1;
                this.loading = true;
                this.list = [];
                try {
                    //如果是项目列表跳转过来- 则项目ID，取url参数为准
                    let projectId = this.querystring.projectId && this.querystring.projectName ? this.querystring.projectId : this.projectId;

                    let res = await this.$api.memberList({
                        pageNumber: this.pageNumber,
                        pageSize: this.pageSize,
                        keywords: this.keywords,
                        departmentId: this.departmentId,
                        projectId: projectId,
                    });
                    if (res.data.code === 200) {
                        this.total = res.data.data.totalElements;
                        this.list = res.data.data.content;
                    }
                } catch (e) {

                }

                this.pageSuccess();     //页面进度条，设置加载完成
            },

            async initDP() {
                try {
                    let res = await this.$api.dpList();
                    this.departList = res.data.data;
                } catch (e) {
                    this.$message.error('初始化部门失败')
                }
            },

            //翻页
            async trunPage(val) {
                this.pageNumber = val;
                //如果是项目列表跳转过来- 则项目ID，取url参数为准
                let projectId = this.querystring.projectId && this.querystring.projectName ? this.querystring.projectId : this.projectId;
                try {
                    this.loadingPageNext = true;
                    let res = await this.$api.memberList({
                        pageNumber: this.pageNumber,
                        pageSize: this.pageSize,
                        keywords: this.keywords,
                        departmentId: this.departmentId,
                        projectId: projectId,
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

            //搜索连动
            changeSelect() {
                if (this.departmentId == 0) {
                    this.projectList = [];
                    this.projectId = 0;
                    this.init();
                    return;
                }
                let selected = this.departList.find(it => this.departmentId === it.department.guid);
                selected && (this.projectList = selected.projectLists);
                this.projectId = 0;
                this.init();
            },

            //转移连动
            changeMove() {
                if (this.moveForm.departmentId == 0) {
                    this.moveProjectList = [];
                    this.moveForm.projectId = 0;
                    this.init();
                    return;
                }
                let selected = this.departList.find(it => this.moveForm.departmentId === it.department.guid);
                selected && (this.moveProjectList = selected.projectLists);
                this.moveForm.projectId = 0;
            },

            //删除
            async deleteMember(item) {
                await this.$confirm('确认删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
                try {
                    await this.$api.deleteMember(item.guid);
                    this.init(this.pageNumber);
                } catch (e) {
                    this.$message.error('网络错误，请稍候重试');
                }
            },

            //离职
            async leave(it) {
                await this.$confirm('确认办理离职？', '离职操作', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
                let item = Object.assign({}, it);
                try {
                    item.state = 1;
                    let res = await this.$api.updateMemberState(item);
                    if (res.data.code === 200) {
                        it.state = 1;
                    } else {
                        this.$message.error(res.data.msg);
                    }
                } catch (e) {
                    this.$message.error('网络错误，请稍候再试');
                }
            },

            //成员转移
            async moveUpdate() {
                let item = Object.assign({}, this.currentUpdate);
                try {
                    item.departmentId = this.moveForm.departmentId;
                    item.projectId = this.moveForm.projectId;
                    let res = await this.$api.transferMember(item);
                    if (res.data.code === 200) {
                        this.currentUpdate.departmentName = res.data.data.departmentName;
                        this.currentUpdate.projectName = res.data.data.projectName;
                        this.moveDialogVisible = false;
                        this.$message({
                            message: '成员转移成功',
                            type: 'success'
                        });
                    } else {
                        this.$message.error(res.data.msg);
                    }
                } catch (e) {
                    this.$message.error('网络错误，请稍候再试');
                }
            },


            openCreate() {
                this.addDialogVisible = true;
            },
            openImport(){
                this.importDialogVisible = true;
            },
            openUpdate(item) {
                this.currentUpdate = item;
                this.updateDialogVisible = true;
            },
            openMove(item) {
                this.currentUpdate = item;
                this.moveDialogVisible = true;
            },
            downloadTemplate(){
                this.$api.downloadTemplate();
            },
            downloadMember(){
                let projectId = this.querystring.projectId && this.querystring.projectName ? this.querystring.projectId : this.projectId;
                const data = {
                    keywords: this.keywords,
                    departmentId: this.departmentId,
                    projectId: projectId,
                };
                this.$api.downloadMember(data);
            }
        },
        filters: {
            memberState(val) {
                switch (val) {
                    case 1:
                        return '离职';
                        break;
                    default :
                        return '在职';
                        break;
                }
            }
        }

    }
</script>

