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
                                            <div class="ant-form-item-control "><input type="text"
                                                                                       placeholder="日志类型/日志描述"
                                                                                       v-model="keywords"
                                                                                       @keyup.enter="init"
                                                                                       class="ant-input">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="ant-col-sm-24 ant-col-md-8"
                                     style="padding-left: 24px; padding-right: 24px;"><span
                                    class="submitButtons___16_VM"><a href="javascript:;" @click="init"
                                                                          class="ant-btn ant-btn-primary"><span>检 索</span></a></span>
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
                                                <th class=""><span>编号</span></th>
                                                <th class=""><span>日志类型</span></th>
                                                <th class=""><span>日志描述</span></th>
                                                <th class=""><span>创建时间</span></th>
                                            </tr>
                                            </thead>
                                            <tbody class="ant-table-tbody">
                                            <tr class="ant-table-row  ant-table-row-level-0" v-for="it in list">
                                                <td>{{it.guid}}</td>
                                                <td>{{it.logType | logType}}</td>
                                                <td>{{it.logRecordString}}</td>
                                                <td>{{it.createTime | time}}</td>
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
                addDialogVisible: false,

                pageNumber: 1,
                pageSize: 50,
                list: [],
                total: 0,
                keywords: '',
                loadingPageNext:false,
            }
        },

        created() {
            this.init();
        },
        methods: {
            async init() {
                this.pageNumber = 1;
                this.loading = true;
                this.list = [];
                try {
                    let res = await this.$api.log({
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
                    let res = await this.$api.log({
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
                this.addDialogVisible = true;
            },
        },
        filters: {
            logType(val) {
                switch (val) {
                    case 1 :
                        return '登录';
                        break;
                    case 2 :
                        return '部门';
                        break;
                    case 3 :
                        return '项目';
                        break;
                    case 4 :
                        return '职员';
                        break;
                    case 5 :
                        return '职员';
                        break;
                    case 6 :
                        return '登录策略';
                        break;
                }
            }
        }
    }
</script>

