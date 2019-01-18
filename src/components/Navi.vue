<template>
  <div id="app">
    <el-container class="con_section">
      <el-header class="blueheader">
        <h2 class="headlogo">后台管理</h2>
        <el-col :span="3" class="userinfo">
          <el-dropdown>
            <i class="el-icon-setting" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>查看</el-dropdown-item>
              <el-dropdown-item>新增</el-dropdown-item>
              <el-dropdown-item>删除</el-dropdown-item>
            </el-dropdown-menu> </el-dropdown> <span>王小虎</span>
        </el-col>
      </el-header>
      <el-container>
        <el-aside style="flex: 0 0 230px;width: 230px;background:#eef1f6">
          <el-menu default-active="1" class="el-menu-vertical-demo" @select="handleSelect"><!--加导航栏点击事件-->
            <el-submenu index="1">
              <template slot="title"><i class="el-icon-message"></i>管理系统</template>
              <el-menu-item index="1">用户模块</el-menu-item>
              <el-menu-item index="2">商家资料</el-menu-item>
              <el-menu-item index="3">用户测试</el-menu-item>
              <el-menu-item index="4">图片测试</el-menu-item>
              <el-menu-item index="5">图片测试1</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main class="home_main"><!--使用全局route-->
          <el-col :span="24" class="breadcrumb-container">
            <strong class="title">{{$route.name}}</strong>
            <el-breadcrumb separator="/" class="breadcrumb-inner">
              <!--<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                {{ item.name }}
              </el-breadcrumb-item>-->
            </el-breadcrumb>
          </el-col>

          <el-col :span="24">
            <div style="margin-top:10px">
              <router-view></router-view> <!-- 最重要的标签，用来显示跳转的页面 -->
            </div>
          </el-col>

          <!--主窗口-->
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        searchCriteria: '',
      }
    },
    methods:{
      handleIconClick(ev) {
        console.log(ev);
      },

  //我们给左侧的菜单栏添加了一个响应，在响应函数中作出了路由跳转的处理。this.$router.push('/Page1');这句话的意思就是将当前要跳转的页面push到router的数组中。这里使用push而不是直接给数组赋值的原因是希望用户点击浏览器中的后退和前进按钮时可以回到之前操作的页面。
      handleSelect(key, keyPath){
        switch(key){
          case '1':
            this.$router.push('/userlistpage');
            break;
          case '2':
            this.$router.push('/storeinfo');
            break;
          case '3':
            this.$router.push('/userlist');
            break;
          case '4':
            this.$router.push('/imglist');
            break;
          case '5':
            this.$router.push('/testImg');
            break;
        }
      },

    },
  }
</script>
<style>
  body{margin:0;}
  #app{
    min-width:1200px;
    margin:0 auto;
    font-family: "Helvetica Neue","PingFang SC ",Arial,sans-serif;
  }
</style>
