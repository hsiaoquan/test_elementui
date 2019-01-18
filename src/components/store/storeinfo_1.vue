<template>
    <div>
      <el-upload class="upload-demo" action="http://localhost:9090/store/uploadImg"
                 :on-preview="handlePreview"
                 :on-remove="handleRemove"
                 :before-remove="beforeRemove"
                 multiple
                 :limit="3"
                 :on-exceed="handleExceed"
                 :on-success="handleSuccess"
                 :file-list="fileList">

        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不能超过500kb</div>
      </el-upload>



    </div>
</template>

<script>
  export default {
    data() {
      return {
        fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
        storeInfo:{
          picture:''
        }
      };
    },
    methods: {
      handleRemove(file, fileList) {
        if(file.status =='success'){
          this.$http({
            url:'http://localhost:9090/store/deleteImg?fileName=oooo',
            method:'post',
            //data:{"fileName":file.name},
            success:function(data){
              console.log("删除成功");
            }
          })
        }
        //console.log(file, fileList);
        console.log("删除时候"+file.name);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },

      //文件上传成功的钩子函数
      handleSuccess(res, file) {
        this.$message({
          type: 'info',
          message: '图片上传成功',
          duration: 6000
        });
        if (file.response.success) {
          this.storeInfo.picture = file.response.url; //将返回的文件储存路径赋值picture字段
          file.name = file.response.fileName;
          console.log("返回值的信息"+file.response.url);
          console.log("图片名称"+file.name);
        }
      }

    }
  }
</script>

<style scoped>

</style>
