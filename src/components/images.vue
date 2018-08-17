<template>
  <span>
    <template v-if="name">
        <img :src="url" alt="" :style="{ width : 'auto' , height : height + 'px' }" @click="viewBigPic(url)">
    </template>
    <template v-else>
      暂无图片
    </template>

    <el-dialog
        :visible.sync="imgDialogVisible"
        title="查看图片"
        class="el-dialog-img"
        v-if="allowView"
    >
      <img :src="bigImg" alt="">
    </el-dialog>
  </span>
</template>

<script>

    export default {
        name: "images",
        props: {
            name: {
                type: String,
                default: ''
            },
            width: {
                type: [String, Number],
                default: 20
            },
            height: {
                type: [String, Number],
                default: 40
            },
            //查看大图
            allowView: {
                type: Boolean,
                default: true,
            }
        },
        computed: {
            url() {
                return this.getFileUrl + this.name;
            }
        },

        data() {
            return {
                imgDialogVisible: false,
                getFileUrl : this.$api.getFileUrl,
                bigImg: ''
            }
        },

        methods: {
            //查看大图
            viewBigPic(url) {
                if (this.allowView) {
                    this.bigImg = url;
                    this.imgDialogVisible = true;
                }
            }
        }
    }
</script>

