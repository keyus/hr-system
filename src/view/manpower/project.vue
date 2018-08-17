<template>
    <div class="content___13wW7">

        <div class="pageHeader___Pze-l" v-if="querystring.departmentName && querystring.departmentId">
            <div class="detail___1rfGA">
                <div class="main___3Slzs">
                    <div class="row___3eawN">
                        <h1 class="title___3uDQf">
                            {{querystring.departmentName}} 的项目
                            <router-link to="/dashboard/project">查看所有项目</router-link>
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
                                <div class="ant-col-sm-24 ant-col-md-8"
                                     style="padding-left: 24px; padding-right: 24px;">
                                    <div class="ant-row ant-form-item">
                                        <div class="ant-form-item-label"><label title="规则编号">关键字</label></div>
                                        <div class="ant-form-item-control-wrapper">
                                            <div class="ant-form-item-control "><input type="text" placeholder="项目名称"
                                                                                       v-model="keywords"
                                                                                       @keyup.enter="init"
                                                                                       class="ant-input">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="ant-col-sm-24 ant-col-md-8"
                                     style="padding-left: 24px; padding-right: 24px;"><span
                                    class="submitButtons___16_VM"><a href="javascript:;" class="ant-btn ant-btn-primary"
                                                                          @click="init"><span>检 索</span></a></span>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div  v-if="!querystring.departmentId">
                        <div class="standardFormRow___2sQFC standardFormRowBlock___1hBU5" style="padding-bottom: 11px;">
                            <div class="label___1nUUW"><span>项目组名</span></div>
                            <div class="content___1klsL">
                                <div class="ant-row ant-form-item" style="margin-bottom: 0">
                                    <div class="ant-form-item-control-wrapper">
                                        <div class="ant-form-item-control">
                                            <div class="tagSelect___29LHn hasExpandTag___3y0lU" style="max-height: none">
                                                <div class="ant-tag ant-tag-checkable" @click="searchGroupName('all')">全部</div>
                                                <div class="ant-tag ant-tag-checkable"
                                                     :class="{ 'ant-tag-checkable-checked' : it.checked }"
                                                     @click="searchGroupName(it)"
                                                     v-for="it in groupList2.slice(0,groupShowNums)">{{it.groupName}} <span style="color: #bbb">({{it.count || 0}})</span></div>
                                                <a class="trigger___h4Zkw" @click="groupToggle" v-if="groupList2.length > 10">
                                                    <template v-if="groupExpend">收起 <i class="anticon anticon-up"></i></template>
                                                    <template v-else>展开 <i class="anticon anticon-down"></i></template>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tableListOperator____5-oc ant-row-flex">

                        <div class="flex-auto">
                            <el-button type="primary" icon="el-icon-plus" size="small"  @click="openCreate">新增项目</el-button>
                        </div>

                        <div class="ant-row-flex-middle">
                            共记{{list.length}}个项目
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
                                        <table>
                                            <thead class="ant-table-thead">
                                            <tr>
                                                <th class=""><span>项目名称</span></th>
                                                <th class=""><span>所属部门</span></th>
                                                <th class=""><span>部门在职人数</span></th>
                                                <th class=""><span>项目组名</span></th>
                                                <th class=""><span>创建时间</span></th>
                                                <th class=""><span>操作</span></th>
                                            </tr>
                                            </thead>

                                            <tbody v-for="item in list2"
                                                   class="ant-table-tbody">
                                                <tr class="ant-table-row  ant-table-row-level-0 first-level"
                                                    :class="!item.active ? 'tr-close' : undefined "
                                                    @click="toggle(item)">
                                                    <td>
                                                        <div>
                                                            <span>
                                                                {{item.departmentName}}
                                                                <i class="el-icon-caret-bottom" v-if="item.active" ></i>
                                                                <i class="el-icon-caret-right" v-else></i>
                                                            </span>

                                                        </div>
                                                    </td>
                                                    <td></td>
                                                    <td>
                                                        {{ item.children.reduce( (it,current)=> { return { inJobCount : it.inJobCount + current.inJobCount} }).inJobCount }}
                                                    </td>
                                                    <td></td>
                                                    <td></td>
                                                    <td>
                                                        <label>
                                                            项目数量：{{item.children.length}}
                                                        </label>
                                                    </td>
                                                </tr>
                                                <template v-if="item.active">
                                                    <tr class="ant-table-row  ant-table-row-level-2" v-for="it in item.children" :key="it.guid">
                                                        <td>
                                                            <router-link
                                                                    :to="{path : '/dashboard/member', query : { projectId : it.guid , projectName : it.name } }">
                                                                <el-tag class="dtag">{{it.name}}</el-tag>
                                                            </router-link>
                                                        </td>
                                                        <td>{{it.departmentName}}</td>
                                                        <td>{{it.inJobCount}}</td>
                                                        <td>{{it.groupName || '--'}}</td>
                                                        <td>{{it.createTime | time}}</td>
                                                        <td>
                                                            <router-link
                                                                    :to="{path : '/dashboard/member', query : { projectId : it.guid , projectName : it.name } }">
                                                                项目成员
                                                            </router-link>
                                                            <div class="ant-divider ant-divider-vertical"></div>
                                                            <a href="javascript:;" @click="openUpdate(it)">修改</a>
                                                            <div class="ant-divider ant-divider-vertical"></div>
                                                            <a href="javascript:;" @click="deleteProject(it)">删除</a>
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
                    <div>共计{{list.length}}个项目</div>
                </div>
                <el-dialog
                    title="添加项目"
                    :visible.sync="addDialogVisible"
                    width="30%"
                >
                    <el-form ref="createform" :rules="rules" :model="createForm" label-width="80px">
                        <!--需要超管权限-->
                        <template v-if="user.auth">
                            <el-form-item label="所属部门" prop="departmentId">
                                <el-select v-model="createForm.departmentId" style="width:100%">
                                    <el-option :label="it.name" :value="it.guid" v-for="it in departList"
                                               :key="it.guid"></el-option>
                                </el-select>
                            </el-form-item>
                        </template>

                        <el-form-item label="项目名称" prop="name">
                            <el-input v-model="createForm.name"></el-input>
                        </el-form-item>

                        <el-form-item label="组名" prop="groupName">
                            <el-input v-model="createForm.groupName" placeholder="如：ZSX"></el-input>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">立即创建</el-button>
                        </el-form-item>
                    </el-form>
                </el-dialog>

                <el-dialog
                    title="修改项目"
                    :visible.sync="updateDialogVisible"
                    width="30%"
                >
                    <el-form ref="updateform" :rules="rules" :model="updateForm" label-width="80px">
                        <!--需要超管权限-->
                        <template v-if="user.auth">
                            <el-form-item label="所属部门" prop="departmentId">
                                <el-select v-model="updateForm.departmentId" style="width:100%">
                                    <el-option :label="it.name" :value="it.guid" v-for="it in departList"
                                               :key="it.guid"></el-option>
                                </el-select>
                            </el-form-item>
                        </template>

                        <el-form-item label="项目名称" prop="name">
                            <el-input v-model="updateForm.name"></el-input>
                        </el-form-item>

                        <el-form-item label="组名" prop="groupName">
                            <el-input v-model="updateForm.groupName" placeholder="ZS..."></el-input>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="updateProject">确认修改</el-button>
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

                // url参数
                querystring: {
                    departmentId: this.$route.query.departmentId,
                    departmentName: this.$route.query.departmentName,
                },

                createForm: {
                    departmentId: '',
                    name: '',
                    groupName: ''
                },

                updateForm: {
                    departmentId: '',
                    name: '',
                    groupName: ''
                },

                list: [],
                list2: [],
                originalList : [],          //List数据的存本   赋值后不再改变
                departList: [],
                groupList: [],
                groupShowNums: 10,
                groupExpend: false,        //组名展开状态
                keywords: '',

                //当前修改项
                currentUpdate: {},

                //效验规则
                rules: {
                    name: [
                        {required: true, message: '请输入项目名称', trigger: 'change'},
                    ],
                    departmentId: [
                        {required: true, message: '请选择项目所在部门', trigger: 'change'},
                    ],
                    groupName: [
                        {required: true, message: '请填写项目组名', trigger: 'change'},
                    ],
                },
            }
        },
        watch: {
            '$route'(val) {
                this.querystring.departmentId = val.query.departmentId;
                this.querystring.departmentName = val.query.departmentName;
                this.init();
            }
        },
        computed: {
            ...mapState({
                user: 'user'
            }),
            groupList2(){
                let group = JSON.parse(JSON.stringify(this.groupList));
                this.originalList.forEach(it=>{
                    group.forEach(son=>{
                        if(it.groupName === son.groupName){
                            son.count = (son.count ? son.count : 0) + 1
                        }
                    })
                });
                return group;
            },
        },
        created() {
            this.init();
        },
        methods: {
            //初始化列表
            async init() {
                this.loading = true;
                this.list = [];
                this.list2 = [];

                try {
                    let group = await this.$api.projectGroup();
                    let res = await this.$api.projectList({
                        keywords: this.keywords,
                        departmentId: this.querystring.departmentId || ''
                    });
                    if(group.data.code===200) this.groupList = group.data.data;
                    if(res.data.code === 200) {
                        this.list = res.data.data;
                        this.list2 = this.$tree(res.data.data);
                    }

                    this.originalList = JSON.parse(JSON.stringify(res.data.data));
                } catch (e) {

                }
                this.pageSuccess();     //页面进度条，设置加载完成
            },

            //展开组名
            groupToggle(){
                if(this.groupExpend){
                    this.groupShowNums = 10;
                }else{
                    this.groupShowNums = this.groupList.length
                }
                this.groupExpend = !this.groupExpend;
            },

            toggle (item){
                item.active = !item.active;
            },
            //组名搜索
            searchGroupName(item){
                let select;
                if(item==='all'){
                    this.list                   = this.originalList.slice();
                    select                      = this.groupList2.find(it=>it.checked);
                    if(select) select.checked   = false;
                    return ;
                }
                select      = this.groupList2.find(it=>it.checked);
                if(select) select.checked  = false;
                if(item.hasOwnProperty('checked')){
                    item.checked = true;
                }else{
                    this.$set(item,'checked',true);
                }

                this.list = this.originalList.filter(it => item.groupName === it.groupName);
            },

            //拉取部门数据
            async initDepart() {
                try {
                    let res = await this.$api.departList();
                    if (res.data.code === 200) {
                        this.departList = res.data.data.content;
                    }
                } catch (e) {
                    this.$message.error('初始化部门数据失败，请稍候再试');
                }
            },

            openUpdate(item) {
                !this.departList.length && this.initDepart();
                this.updateDialogVisible = true;
                this.currentUpdate = item;
                let it = Object.assign({}, item);
                it.departmentId = it.departmentId ? it.departmentId : '';
                this.updateForm = it;
            },

            //删除项目
            async deleteProject(item) {
                await this.$confirm('确认删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
                try {
                    await this.$api.deleteProject(item.guid);
                    this.list.splice(this.list.indexOf(item), 1);
                    //项目更新之后，需要重新拉取组名列表
                    let group = await this.$api.projectGroup();
                    if(group.data.code===200) this.groupList = group.data.data;
                } catch (e) {
                    this.$message.error('网络错误，请稍候重试');
                }
            },

            openCreate() {
                !this.departList.length && this.initDepart();
                this.$refs.createform && this.$refs.createform.resetFields();
                this.addDialogVisible = true;
            },

            onSubmit() {
                this.$refs.createform.validate(async (valid) => {
                    if (valid) {
                        try {
                            let res = await this.$api.createProject(this.createForm);
                            if (res.data.code === 200) {
                                this.list.unshift(res.data.project);
                                this.$message({
                                    showClose: true,
                                    message: '添加成功',
                                    type: 'success'
                                });
                                this.addDialogVisible = false;

                                //项目更新之后，需要重新拉取组名列表
                                let group = await this.$api.projectGroup();
                                if(group.data.code===200) this.groupList = group.data.data;

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

            updateProject() {
                this.$refs.updateform.validate(async (valid) => {
                    if (valid) {
                        try {
                            let curdepart = this.departList.find(instance => instance.guid === this.updateForm.departmentId);
                            this.updateForm.departmentName = curdepart.name;
                            let res = await this.$api.updateProject(this.updateForm);
                            if (res.data.code === 200) {
                                this.$message({
                                    showClose: true,
                                    message: '项目修改成功',
                                    type: 'success'
                                });

                                this.currentUpdate.name = res.data.project.name;
                                this.currentUpdate.departmentName = res.data.project.departmentName;
                                this.currentUpdate.groupName = res.data.project.groupName;
                                this.updateDialogVisible = false;

                                //项目更新之后，需要重新拉取组名列表
                                let group = await this.$api.projectGroup();
                                if(group.data.code===200) this.groupList = group.data.data;

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
        }
    }
</script>

