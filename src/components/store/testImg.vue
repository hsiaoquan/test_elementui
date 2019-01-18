<template> <div class="uptemp"> <el-upload
  class="upload-demo"
  ref="upload"
  multiple="false"
  action="http://localhost:/9090/store/multiUploadImg"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :on-change="handleChange"
  :before-upload="beforeUpload"
  :file-list="fileList"
  :auto-upload="false"
  :multiple="false"> <el-button slot="trigger" size="small" type="primary">选取文件</el-button> <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">导入</el-button> <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div> </el-upload> </div> </template> <script>
  export default {
    data() {
      return {
        fileList: []
      }
    },
    mounted: function () {
      //加载完页面执行的函数
    },
    methods: {
      submitUpload() {
        this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleChange(file, fileList){
        console.log(file);
        console.log(fileList);
      },
      beforeUpload: function (file) {
        console.log(file)
        //这里是重点，将文件转化为formdata数据上传
        let fd = new FormData()
        fd.append('file', file)
        this.$http.post('/web/api/uploadFile', fd).then((res) => {
          console.log(res)
        }, (res) => {
          console.log(res)
        });
        return false;
      }
    },
    components: {
//            组件
    }
  }
</script> <style scoped>

</style> <style>
  .uptemp .el-upload-list {
    position: absolute;
    left: 140px;
    top: 0;
    width: 50%;
  }

  .uptemp {
    position: relative;
  }

  .uptemp .el-upload-list .el-upload-list__item {
    margin-top: 0;
  }
</style>
---------------------
作者：你蠢哭我咯
来源：CSDN
原文：https://blog.csdn.net/m0_38069630/article/details/78132216
版权声明：本文为博主原创文章，转载请附上博文链接！
