<template>
  <section>
    <!--上传多个文件或者图片而却是手动触发事件的-->
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.storeName" placeholder="商家"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getStoreInfos">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="storeInfos" highlight-current-row @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column prop="storeName" label="商家名称" width="120" sortable>
      </el-table-column>
      <el-table-column prop="storeAddress" label="商家地址" width="100"  sortable>
      </el-table-column>
      <el-table-column prop="storeType" label="商家类型" width="100" sortable>
      </el-table-column>
      <el-table-column prop="filePath" label="图片" width="120" sortable>
        <template slot-scope="scope">
          <img v-for="(imgItem,index) in scope.row.filePath.split('|')" :src="imgItem" alt="" style="width: 50px;height: 50px">
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
      </el-pagination>
    </el-col>




    <!--编辑界面-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="商家名称" prop="storeName">
          <el-input v-model="editForm.storeName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商家地址">
          <el-input v-model="editForm.storeAddress" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商家类型">
          <el-input v-model="editForm.storeType" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" >  <!--:on-success="handleSuccess"-->
          <el-upload
            ref="upload"
            :multiple="multiple"
            action="http://localhost:9090/store/multiUploadImg"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :file-list="fileList"
            :on-remove="handleRemove"
            :http-request="uploadFile"
            :auto-upload="false">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="dialogFormVisible=false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">添加</el-button>
        <el-button v-else type="primary" @click="updateData">修改    </el-button>
        <!-- <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button> -->
      </div>
    </el-dialog>
  </section>
</template>

<script type="text/javascript">
  import util from "../../common/js/util";
  import axios from 'axios';
  import {
    getStoreListPage,
    removeStore,
    batchRemoveStore,
    editStore,
    addStore
  } from "../../api/api";

  export default {
    data() {
      return {
        multiple:true,
        formDate:"",
        dialogImageUrl: "",
        dialogVisible: false,
        dialogStatus: "",
        textMap: {
          update: "Edit",
          create: "Create"
        },
        //图片列表（用于在上传组件中回显图片）
        fileList: [],
        dialogFormVisible: false,
        filters: {
          name: ""
        },
        storeInfos: [],
        total: 0,
        page: 1,
        // listLoading: false,v-loading="listLoading"
        sels: [], //列表选中列

        //editFormVisible: false, //编辑界面是否显示
        //editLoading: false,
        editFormRules: {
          name: [{ required: true, message: "请输入商家名称", trigger: "blur" }]
        },
        //编辑界面数据
        editForm: {
          id: "0",
          storeName: "",
          storeAddress: "",
          storeType: "",
          filePath: ""
        },

        addFormVisible: false, //新增界面是否显示
        //addLoading: false,
        addFormRules: {
          name: [{ required: true, message: "请输入商家名称", trigger: "blur" }]
        }
      };
    },
    methods: {
      //上传图片相关处理函数---start
      uploadFile(file){
        this.formDate.append('file',file.file);
        console.info(this.formDate);
      },

      submitUpload() {
        this.formDate = new FormData();
        this.$refs.upload.submit();
        this.formDate.append('WS_CODE', "12133");
        let config = {
          headers:{
            'Content-Type':'multipart/form-data'
          }
        }
        axios.post("http://localhost:9090/store/multiUploadImg",this.formDate,config).then( res =>{
          if(res.data.success){
           // alert("上传成功");
            this.editForm.filePath = res.data.url;
          }
          console.log(res.data.success);
          this.handleSuccess();//使用axios不是自动识别上传成功的函数，需要手动添加
          console.log(res.data);
        }).catch( res => {
          console.log(res)
        })


      },

      handleRemove(file, fileList) {
        console.log(file, fileList);
        console.log("file"+file.name);
        console.log("fileList"+fileList.name);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },

      //文件上传成功的钩子函数
      handleSuccess(res, file) {
        this.$message({
          type: 'info',
          message: '图片上传成功',
          duration: 6000
        });
         if (res.success) {
        //   file.editForm.filePath = response.url; //将返回的文件储存路径赋值picture字段
        //   file.name = response.fileName;
        //   console.log("返回值的信息"+response.url);
        //   //console.log("图片名称"+formDat.name);
         }
      },
      //上传图片相关处理函数---end

      handleCurrentChange(val) {
        this.page = val;
        this.getStoreInfos();
      },
      //获取用户列表
      getStoreInfos() {
        let para = {
          page: this.page,
          name: this.filters.name
        };
        //this.listLoading = true;
        //NProgress.start();
        getStoreListPage(para).then(res => {
          this.total = res.data.total;
          this.storeInfos = res.data.storeInfos;

          //从数据库获取的图片路径
          console.log("数据库获取图片路径"+this.storeInfos);
          //this.listLoading = false;
          //NProgress.done();
        });
      },
      //删除
      handleDel: function(index, row) {
        this.$confirm("确认删除该记录吗?", "提示", {
          type: "warning"
        })
          .then(() => {
            //this.listLoading = true;
            //NProgress.start();
            let para = { id: row.id };
            removeStore(para).then(res => {
              //this.listLoading = false;
              //NProgress.done();
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getStoreInfos();
            });
          })
          .catch(() => {});
      },
      //显示编辑界面
      handleEdit: function(index, row) {
        this.dialogStatus = "update";
        this.dialogFormVisible = true;
        //this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
        console.info("index值"+index +"row的值"+row);

        if(this.fileList !=false){
          this.fileList=[];
          console.info("执行此步");
        }
        let jh=[];
        jh=this.editForm.filePath.split('|');
        for(let i =0;i <jh.length;i++){
          this.fileList.push({url:jh[i]});
        }


        console.info(this.fileList);
        console.info("编辑");
        console.info(this.editForm.filePath);
      },
      //显示新增界面
      handleAdd: function() {
        this.dialogStatus = "create";
        //this.addFormVisible = true;
        this.dialogFormVisible = true;
       this.editForm = {
         id: "0",
         storeName: "",
         storeAddress: "",
         storeType: "",
         filePath: ""
       }
      },
      //编辑editStore
      updateData:function() {
        this.$refs.editForm.validate(valid => {
          if (valid) {
            this.$confirm("确认提交吗？", "提示", {})
              .then(() => {
                //this.editLoading = true;
                //NProgress.start();
                let para = Object.assign({}, this.editForm);
                editStore(para).then(res => {
                  //this.editLoading = false;
                  //NProgress.done();
                  this.$message({
                    message: "提交成功",
                    type: "success"
                  });
                  this.$refs["editForm"].resetFields();
                  //this.editFormVisible = false;
                  this.dialogFormVisible = false;
                  this.getStoreInfos();
                });
              })
              .catch(e => {
                // 打印一下错误
                console.log(e);
              });
          }
        });
      },
      //新增
      createData: function() {
        this.$refs.editForm.validate(valid => {
          if (valid) {
            this.$confirm("确认提交吗？", "提示", {})
              .then(() => {
                //this.editLoading = true;
                //NProgress.start();
                //this.editForm.id = (parseInt(Math.random() * 100)).toString() // mock a id 这个使用mock产生Id
                let para = Object.assign({}, this.editForm);
                console.log(para);
                addStore(para).then(res => {
                  //this.addLoading = false;
                  //NProgress.done();
                  this.$message({
                    message: "提交成功",
                    type: "success"
                  });
                  this.$refs["editForm"].resetFields();
                  this.dialogFormVisible = false;
                  //this.addFormVisible = false;
                  console.info("请求成功!");
                  this.getStoreInfos();
                });
              })
              .catch(e => {
                // 打印一下错误
                console.log(e);
              });
          }
        });
      },
      //全选单选多选
      selsChange: function(sels) {
        this.sels = sels;
      },
      //批量删除
      batchRemove: function() {
        var ids = this.sels.map(item => item.id).toString();
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning"
        })
          .then(() => {
            // this.listLoading = true;
            //NProgress.start();
            let para = { ids: ids };
            batchRemoveStore(para).then(res => {
              //this.listLoading = false;
              //NProgress.done();
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getStoreInfos();
            });
          })
          .catch(() => {});
      }
    },
    mounted() {
      this.getStoreInfos();
    }

  };
</script>

<style scoped>

</style>
