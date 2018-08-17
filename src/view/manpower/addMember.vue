<template>
    <el-dialog
        title="添加成员"
        :visible.sync="visible2"
        width="30%"
    >
        <el-form ref="createform" :rules="rules" :model="createForm" label-width="100px">
            <el-form-item label="所属部门" prop="departmentId">
                <el-select v-model="createForm.departmentId" placeholder="请选择所属部门" style="width:100%"
                           @change="changeSelect">
                    <el-option label="请选择" :value="0"></el-option>
                    <el-option v-for="it in departList" :key="it.department.guid" :label="it.department.name"
                               :value="it.department.guid"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="所属项目">
                <el-select v-model="createForm.projectId" placeholder="请选择所属项目" style="width:100%">
                    <el-option label="请选择" :value="0"></el-option>
                    <el-option v-for="it in projectList" :key="it.guid" :label="it.name" :value="it.guid"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="姓名" prop="name">
                <el-input v-model="createForm.name"></el-input>
            </el-form-item>

            <el-form-item label="性别">
                <el-radio-group v-model="createForm.sex">
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="0">女</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="祖籍">
                <el-input v-model="createForm.descent"></el-input>
            </el-form-item>

            <el-form-item label="护照号码" prop="passportNo">
                <el-input v-model="createForm.passportNo"></el-input>
            </el-form-item>

            <el-form-item label="备注">
                <el-input v-model="createForm.remarks"></el-input>
            </el-form-item>

            <el-form-item label="上传护照照片">
                <el-upload
                    class="upload-demo"
                    :action="uploadUrl"
                    accept="image/gif, image/jpeg,image/jpg,image/png"
                    :on-success="onSuccess"
                    :on-preview="handlePreview"
                    :on-progress="onProgress"
                    :before-upload="beforeAvatarUpload"
                    :file-list="fileList2"
                    :limit="1"
                    :on-exceed="limitTip"
                    list-type="picture">

                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/jpeg/gif/png文件，且不超过2MB</div>
                </el-upload>

            </el-form-item>
            <el-form-item class="upload-btn">
                <el-button type="primary" @click="onSubmit" v-loading="uploading"> 确认添加</el-button>
            </el-form-item>
        </el-form>

    </el-dialog>
</template>

<script>

    export default {
        name: "addMember",
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

        },
        data() {
            return {
                visible2: this.visible,
                uploading: false,

                uploadUrl : this.$api.uploadFileUrl,

                createForm: {
                    name: '',
                    sex: 1,
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
            visible(val) {
                val && this.$refs.createform && this.$refs.createform.resetFields();
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
                this.$refs.createform.validate(async (valid) => {
                    if (valid) {
                        try {
                            let res = await this.$api.addMember(this.createForm);

                            if (res.data.code === 200) {
                                this.$message({
                                    showClose: true,
                                    message: '添加成功',
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
            changeSelect() {
                if (this.createForm.departmentId == 0) {
                    this.projectList = [];
                    this.createForm.projectId = 0;
                    this.init();
                    return;
                }
                let selected = this.departList.find(it => this.createForm.departmentId === it.department.guid);
                selected && (this.projectList = selected.projectLists);
                this.createForm.projectId = 0;
            },
            limitTip() {
                this.$message.error('提示：只能上传一张照片')
            },
            beforeAvatarUpload(file) {
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isLt5M) {
                    this.$message.error('上传头像图片大小不能超过 5MB!');
                }
                return isLt5M;
            },
            onProgress() {
                this.uploading = true;
            },
            onSuccess(val) {
                this.createForm.passportPhotoUrl = val.data;
                this.uploading = false;
            },
            handlePreview(file) {
                console.log(file);
            },

        }
    }
</script>
