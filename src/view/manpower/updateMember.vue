<template>
    <el-dialog
        title="修改成员资料"
        :visible.sync="visible2"
        width="30%"
    >
        <el-form ref="updateform" :rules="rules" :model="updateForm" label-width="100px">
            <el-form-item label="所属部门" prop="departmentId">
                <el-select v-model="updateForm.departmentId" placeholder="请选择所属部门" style="width:100%"
                           @change="changeSelect">
                    <el-option label="请选择" :value="0"></el-option>
                    <el-option v-for="it in departList" :key="it.department.guid" :label="it.department.name"
                               :value="it.department.guid"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="所属项目">
                <el-select v-model="updateForm.projectId" placeholder="请选择所属项目" style="width:100%">
                    <el-option label="请选择" :value="0"></el-option>
                    <el-option v-for="it in projectList" :key="it.guid" :label="it.name" :value="it.guid"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="姓名" prop="name">
                <el-input v-model="updateForm.name"></el-input>
            </el-form-item>

            <el-form-item label="性别">
                <el-radio-group v-model="updateForm.sex">
                    <el-radio :label="true">男</el-radio>
                    <el-radio :label="false">女</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="祖籍">
                <el-input v-model="updateForm.descent"></el-input>
            </el-form-item>

            <el-form-item label="护照号码" prop="passportNo">
                <el-input v-model="updateForm.passportNo"></el-input>
            </el-form-item>

            <el-form-item label="备注">
                <el-input v-model="updateForm.remarks" :maxlength="50"></el-input>
            </el-form-item>

            <el-form-item label="上传护照照片">
                <el-upload
                    class="upload-demo"
                    :action="uploadUrl"
                    accept="image/gif, image/jpeg,image/jpg,image/png"
                    :on-success="onSuccess"
                    :on-progress="onProgress"
                    :file-list="fileList2"
                    :limit="1"
                    :before-upload="beforeAvatarUpload"
                    :on-exceed="limitTip"
                    list-type="picture">

                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/jpeg/gif/png文件，且不超过5MB</div>
                </el-upload>

            </el-form-item>
            <el-form-item class="upload-btn">
                <el-button type="primary" @click="onSubmit" v-loading="uploading"> 确认修改</el-button>
            </el-form-item>
        </el-form>

    </el-dialog>
</template>

<script>

    export default {
        name: "updateMember",
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            departList: {
                type: [Array],
                default() {
                    return [];
                }
            },
            //数据
            item: {
                type: Object,
                default() {
                    return {}
                }
            }

        },
        data() {
            return {
                visible2: this.visible,
                uploading: false,
                uploadUrl : this.$api.uploadFileUrl,
                updateForm: {
                    name: '',
                    sex: true,
                    departmentId: 0,
                    projectId: 0,
                    passport: '',
                    descent: '',
                    passportNo: '',
                    passportPhotoUrl: '',
                    remarks: '',
                },

                projectList: [],
                fileList2: [],

                //效验规则
                rules: {
                    name: [
                        {required: true, message: '请输入管理员姓名', trigger: 'change'},
                    ],
                    departmentId: [
                        {required: true, message: '请选择部门', trigger: 'change'},
                    ],
                    passportNo: [
                        {required: true, message: '请填写护照', trigger: 'change'},
                    ],

                },
            }
        },
        watch: {
            item: {
                immediate: true,
                handler(val) {
                    this.updateForm = Object.assign({}, val);
                    this.changeSelect('not reset project id');
                }
            },
            visible(val) {
                if (this.visible2 !== val) {
                    this.visible2 = val;
                }
            },
            visible2(val) {
                this.$emit('update:visible', val);
            }
        },

        methods: {
            onSubmit() {
                if (this.uploading) return;
                this.$refs.updateform.validate(async (valid) => {
                    if (valid) {
                        try {

                            let res = await this.$api.updateMember(this.updateForm);

                            if (res.data.code === 200) {
                                this.$message({
                                    showClose: true,
                                    message: '成员资料修改成功',
                                    type: 'success'
                                });
                                this.$emit('update:visible', false);
                                this.$emit('init');
                            } else {
                                this.$message.error(res.data.msg);
                            }
                        } catch (e) {
                            this.$message.error('网络错误，请稍候再试');
                        }
                    }
                })
            },
            beforeAvatarUpload(file) {
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isLt5M) {
                    this.$message.error('上传头像图片大小不能超过 5MB!');
                }
                return isLt5M;
            },
            changeSelect(type) {
                if (this.updateForm.departmentId == 0) {
                    this.projectList = [];
                    this.updateForm.projectId = 0;
                    this.init();
                    return;
                }
                let selected = this.departList.find(it => this.updateForm.departmentId === it.department.guid);
                selected && (this.projectList = selected.projectLists);
                !type && (this.updateForm.projectId = 0);
            },
            limitTip() {
                this.$message.error('提示：只能上传一张照片')
            },
            onProgress() {
                this.uploading = true;
            },
            onSuccess(val) {
                this.updateForm.passportPhotoUrl = val.data;
                this.uploading = false;
            },

        }
    }
</script>
