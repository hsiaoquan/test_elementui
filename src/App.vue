<template>
  <div id="app">
    <!--导航条-->
    <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <el-menu-item index="1">处理中心</el-menu-item>
      <el-submenu index="2">
        <template slot="title">我的工作台</template>
        <el-menu-item index="2-1">选项1</el-menu-item>
        <el-menu-item index="2-2">选项2</el-menu-item>
        <el-menu-item index="2-3">选项3</el-menu-item>
      </el-submenu>
      <el-menu-item index="3"><a href="https://www.ele.me" target="_blank">关于我们</a></el-menu-item>
    </el-menu>
    <br>
    <!--搜索框-->
    <el-row>
      <el-col :span="3" class="grid">
        <el-input v-model="input" placeholder="请输入内容" size="mini"></el-input>
      </el-col>
      <el-col :span="1" class="grid"> <el-button type="success" icon="el-icon-search" size="mini">搜索</el-button>
      </el-col>
    </el-row>
    <br>
    <!--表格数据及操作-->
    <el-table :data="tableData" border style="width: 100%" stripe ref="multipleTable" tooltip-effect="dark">
      <!--勾选框-->
      <el-table-column type="selection" width="55"> </el-table-column>
      <!--索引-->
      <el-table-column type="index" :index="indexMethod">
      </el-table-column>
      <el-table-column prop="date" label="日期" width="180" sortable>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="address" label="地址">
      </el-table-column>
      <el-table-column label="编辑" width="100">
        <template slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column label="删除" width="100">
        <template slot-scope="scope"> <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <!--新增按钮-->
    <el-col :span="1" class="grid">
      <el-button type="success" icon="el-icon-circle-plus-outline" size="mini" round>新增</el-button>
    </el-col>
    <!--全删按钮-->
    <el-col :span="1" class="grid">
      <el-button type="danger" icon="el-icon-delete" size="mini" round>全删</el-button>
    </el-col>
    <br>
    <!--分页条-->
    <el-pagination background layout="prev, pager, next" :total="1000">
    </el-pagination>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        //表格数据
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
     //查询输入框数据
       input: '',
    //导航条默认选项
         activeIndex: '1',
        activeIndex2: '1'
      }

    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
        },
      indexMethod(index) {
        return index;
      }
    }
  }
</script>
<style>
  #app {
    font-family: Helvetica, sans-serif;
    text-align: center; }
</style>
