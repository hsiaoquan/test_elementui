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
    <!--:data="storeInfos.slice((currentPage-1)*pagesize,currentPage*pagesize) 此做法是前端进行分页，建议后后台进行分页处理-->
    <el-table :data="storeInfos"
              highlight-current-row @selection-change="selsChange" border style="width: 100%;text-align:center;"  stripe ref="multipleTable" tooltip-effect="dark">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column prop="storeName" label="商家名称" width="180">
      </el-table-column>
      <el-table-column prop="storeAddress" label="商家地址" width="180">
      </el-table-column>
      <el-table-column prop="storeType" label="商家类型" width="180">
      </el-table-column>
      <el-table-column prop="filePath" label="图片" width="320">
        <template slot-scope="scope">
          <img v-for="(imgItem,index) in scope.row.filePath.split('|')" :src="imgItem" alt="" style="width: 50px;height: 50px">
        </template>
      </el-table-column>

      <el-table-column label="操作" width="230">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="2"
        :page-sizes="[10,20,30,40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="float:right;">
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
            :on-success="handleSuccess"
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
        <el-button v-else type="primary" @click="updateData">修改</el-button>
        <!-- <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button> -->
      </div>

    </el-dialog>
  </section>

</template>

<script type="text/javascript">
  import util from "../../common/js/util";
  //import axios from 'axios';
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
        //分页参数--start
        currentPage: 1,//初始页
        pageSize:10,//每页数据
        total:1,
        pageNum:1,//当前页数
        //分页参数--end

        //图片列表（用于在上传组件中回显图片）
        fileList: [],
        dialogFormVisible: false,
        //定义查询参数
        filters: {
          storeName: ""
        },
        storeInfos: [],
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

      submitUpload(file) {
        this.formDate = new FormData();
        this.$refs.upload.submit();
        //this.formDate.append('WS_CODE', "12133");
        let config = {
          headers:{
            'Content-Type':'multipart/form-data'
          }
        }
        this.$axios.post("http://localhost:9090/store/multiUploadImg",this.formDate,config).then( res =>{
          this.fileList = [];
          if(res.data.success){
            this.editForm.filePath = res.data.url;
          }
          //因为字符串是"http://localhost:9090/images/20190111092903_man.jpg|http://localhost:9090/images/20190111092903_rabbit.jpg|"
          //进行分割是"|",前端跟java后台有区别，因为java后台识别为数组长度为2，即： [ "http://localhost:9090/images/20190111092903_man.jpg", "http://localhost:9090/images/20190111092903_rabbit.jpg"]
          // 而前端识别长度为3，即 [ "http://localhost:9090/images/20190111092903_man.jpg", "http://localhost:9090/images/20190111092903_rabbit.jpg", "" ]
          //所以前端要进行长度-1
          let str = res.data.url;
          let imgList =str.slice(0,str.length-1).split('|');//需要对字符串长度-1进行截取字符串
          for( let i =0;i<imgList.length;i++){
            this.fileList.push({url:imgList[i]});
          }
          this.handleSuccess(res);//使用axios不是自动识别上传成功的函数，需要手动添加
        }).catch( res => {
          console.log(res)
        })
      },

      handleRemove(file, fileList) {
        let deleteUrl = this.$qs.stringify({
            fileName:file.url,
          })
        this.$axios.post('http://localhost:9090/store/deleteImg',deleteUrl).then(res => {
          if(res.data.success){
            this.$message({
              type: 'info',
              message: '图片已从服务器移除',
              duration: 6000
            });
          }
          console.log(res);
        }).catch(res => {
          console.log(error);

        })
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },

      //文件上传成功的钩子函数
      handleSuccess(res,file,fileList) {
        this.$message({
          type: 'info',
          message: '图片上传成功',
          duration: 6000
        });
         //if (res.success) {
        //   file.editForm.filePath = response.url; //将返回的文件储存路径赋值picture字段
        //   file.name = response.fileName;
        //   console.log("返回值的信息"+response.url);
        //   //console.log("图片名称"+formDat.name);
        // }
      },
      //上传图片相关处理函数---end

      //分页处理函数---start
      //一页显示多少数据
      handleSizeChange(val) {
        this.pageSize =val;
        //this.currentPage=1;
        this.getStoreInfos();
      },
      //显示第几页
      handleCurrentChange(val) {
        console.log("触发页数");
        this.currentPage = val;
        this.getStoreInfos();
      },
      //分页处理函数---end

      //获取商铺信息列表
      getStoreInfos() {
        let para = this.$qs.stringify({
          rows:this.pageSize,
          page: this.currentPage,
          storeName: this.filters.storeName
        });

        getStoreListPage(para).then(res => {
          this.total = res.data.total;
          this.storeInfos = res.data.storeInfos;
          //从数据库获取的图片路径
          console.log("数据库获取图片路径"+this.storeInfos);
        });
      },
      //删除
      handleDel: function(index, row) {
        this.$confirm("确认删除该记录吗?", "提示", {
          type: "warning"
        })
          .then(() => {
            let para = { id: row.id };
            removeStore(para).then(res => {
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
        this.editForm = Object.assign({}, row);
        //进行判断:清空图片列表数组
        if(this.fileList !=false){
          this.fileList=[];
        }
        let fp = this.editForm.filePath;
        let imgfp=fp.slice(0,fp.length-1).split('|');
        for(let i =0;i <imgfp.length;i++){
          this.fileList.push({url:imgfp[i]});
        }
        console.info("编辑的图片路径"+this.editForm.filePath+"编辑的图片数组"+this.fileList);
      },
      //显示新增界面
      handleAdd: function() {
        this.dialogStatus = "create";
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
                let para = Object.assign({}, this.editForm);
                console.log("编辑完成的数据"+para);
                editStore(para).then(res => {
                  this.$message({
                    message: "提交成功",
                    type: "success"
                  });
                  this.$refs["editForm"].resetFields();
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
                //this.editForm.id = (parseInt(Math.random() * 100)).toString() // mock a id 这个使用mock产生Id
                let para = Object.assign({}, this.editForm);
                console.log(para);
                addStore(para).then(res => {
                  this.$message({
                    message: "提交成功",
                    type: "success"
                  });
                  this.$refs["editForm"].resetFields();
                  this.dialogFormVisible = false;
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
            let para = { ids: ids };
            batchRemoveStore(para).then(res => {
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

<style>


</style>
