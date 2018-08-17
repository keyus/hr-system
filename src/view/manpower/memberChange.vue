<template>
    <div class="content___13wW7">
        <div class="ant-card ant-card-wider-padding">
            <div class="ant-card-body">
                <div class="tableList___1l7ro">
                    <div class="tableListForm___1316u">
                        <form class="ant-form ant-form-inline">
                            <div class="ant-row" style="margin-left: -24px; margin-right: -24px;">
                                <div class="ant-col-sm-24 ant-col-md-6"
                                     style="padding-left: 24px; padding-right: 24px;">
                                    <div class="ant-row ant-form-item">
                                        <div class="ant-form-item-label"><label>部门筛选</label></div>
                                        <div class="ant-form-item-control-wrapper">
                                            <div class="ant-form-item-control ">
                                                <select class="ant-select-selection ant-select-selection--single"
                                                        v-model="departmentId" @change="init()" style="width: 100%">
                                                    <option :value="0">所有部门</option>
                                                    <option v-for="it in departList" :value="it.guid">{{it.name}}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="ant-col-sm-24 ant-col-md-6"
                                     style="padding-left: 24px; padding-right: 24px;">
                                    <div class="ant-row ant-form-item">
                                        <div class="ant-form-item-label"><label>项目筛选</label></div>
                                        <div class="ant-form-item-control-wrapper">
                                            <div class="ant-form-item-control ">
                                                <select class="ant-select-selection ant-select-selection--single"
                                                        v-model="projectId" @change="init()" style="width: 100%">
                                                    <option :value="0">所有项目</option>
                                                    <option v-for="it in projectList" :value="it.guid">{{it.name}}
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
                                     style="padding-left: 24px; padding-right: 24px;">
                  <span class="submitButtons___16_VM">
                    <a  href="javascript:;" class="ant-btn ant-btn-primary" @click="init()"><span>检 索</span></a>
                  </span>
                                </div>
                            </div>
                        </form>
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
                                                <th class=""><span>备注</span></th>
                                                <th class=""><span>创建时间</span></th>
                                                <th class=""><span>变更类型</span></th>
                                            </tr>
                                            </thead>
                                            <tbody class="ant-table-tbody">
                                            <tr class="ant-table-row  ant-table-row-level-0"
                                                :class="it.state === 1 ? 'tr-leave' : undefined "
                                                v-for="it in list"
                                                :key="it.guid">
                                                <td>{{it.name}}</td>
                                                <td>{{it.sex | sex}}</td>
                                                <td>{{it.departmentName}}</td>
                                                <td>{{it.projectName}}</td>
                                                <td>{{it.descent}}</td>
                                                <td>{{it.passportNo}}</td>
                                                <td>
                                                    <images :name="it.passportPhotoUrl"></images>
                                                </td>
                                                <td>{{it.remarks || '--'}}</td>
                                                <td>{{it.createTime | time}}</td>
                                                <td>
                                                    {{it.state | memberState}}
                                                    <template v-if="it.state===4">
                                                        <div class="ant-divider ant-divider-vertical"></div>
                                                        <a href="javascript:;" @click="rollUpMember(it)">恢复</a>
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
    </div>
</template>

<script>

    import loadingPage from '../../mixin/loadingPage'

    export default {
        mixins: [loadingPage],
        data() {
            return {
                pageNumber: 1,
                pageSize: 20,
                list: [],
                total: 0,
                keywords: '',
                departmentId: 0,
                projectId: 0,
                loadingPageNext:false,
                departList: [],
                projectList: [],
            }
        },

        created() {
            this.init();
            this.initDepart();
            this.initProject();
        },
        methods: {

            async init() {
                this.pageNumber = 1;
                this.loading = true;
                this.list = [];
                try {
                    let res = await this.$api.memberChangeList({
                        pageNumber: this.pageNumber,
                        pageSize: this.pageSize,
                        keywords: this.keywords,
                        departmentId: this.departmentId,
                        projectId: this.projectId,
                    });
                    if (res.data.code === 200) {
                        this.total = res.data.data.totalElements;
                        this.list = res.data.data.content;
                    }
                } catch (e) {

                }

                this.pageSuccess();     //页面进度条，设置加载完成
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

            async initProject() {
                try {
                    let res = await this.$api.projectList();
                    if (res.data.code === 200) {
                        this.projectList = res.data.projects;
                    }
                } catch (e) {
                    this.$message.error('初始化项目数据失败，请稍候再试');
                }
            },

            //翻页
            async trunPage(val) {
                this.pageNumber = val;
                try {
                    this.loadingPageNext = true;
                    let res = await this.$api.memberChangeList({
                        pageNumber: this.pageNumber,
                        pageSize: this.pageSize,
                        keywords: this.keywords,
                        departmentId: this.departmentId,
                        projectId: this.projectId,
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

            //恢复成员
            async rollUpMember(it){
                await this.$confirm('确认恢复？', '恢复操作', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
                let item = Object.assign({}, it);
                try {
                    item.state = 5;
                    let res = await this.$api.rollUpMemberState(item);
                    if (res.data.code === 200) {
                        it.state = 5;
                    } else {
                        this.$message.error(res.data.msg);
                    }
                } catch (e) {
                    this.$message.error('网络错误，请稍候再试');
                }
            }

        },
        filters: {
            memberState(val) {
                switch (val) {
                    case 0:
                        return '在职';
                        break;
                    case 1:
                        return '离职';
                        break;
                    case 2:
                        return '转入';
                        break;
                    case 3:
                        return '转出';
                        break;
                    case 4:
                        return '删除';
                        break;
                    case 5:
                        return '恢复成员';
                        break;
                    default :
                        break;

                }
            }
        }


    }
</script>

