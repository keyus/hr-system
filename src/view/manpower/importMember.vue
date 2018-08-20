<template>
    <el-dialog
        title="批量导入"
        :visible.sync="visible2"
        width="400px"
    >
        <el-form label-width="100px">
            <el-upload
                    class="upload-demo"
                    drag
                    :action="uploadUrl"
                    :on-success="onSuccess"
                    :on-preview="handlePreview"
                    :on-progress="onProgress"
                    :before-upload="beforeAvatarUpload"
                    :file-list="fileList2"
                    :limit="1"
                    :on-exceed="limitTip"
                    >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">请上传excel文件，且不超过50M</div>
            </el-upload>

        </el-form>

    </el-dialog>
</template>

<script>

    export default {
        name: "importMember",
        props: {
            visible: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                visible2: this.visible,
                uploading: false,
                uploadUrl : this.$api.importFileUrl,
                fileList2: [],
            }
        },
        watch: {
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
            limitTip() {
                this.$message.error('提示：只能上传一个附件')
            },
            beforeAvatarUpload(file) {
                const isLt5M = file.size / 1024 / 1024 < 50;
                if (!isLt5M) {
                    this.$message.error('上传附件不能大于50MB!');
                }
                return isLt5M;
            },
            onProgress() {
                this.uploading = true;
            },
            onSuccess() {
                this.uploading = false;
            },
            handlePreview(file) {
                console.log(file);
            },


        }
    }
</script>
