<template>
  <div id="app">
    <!--    <div id="nav">-->
    <!--      <router-link to="/">Home</router-link> |-->
    <!--      <router-link to="/about">About</router-link>-->
    <!--    </div>-->
    <el-container style="height: 95vh;">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <!--        <el-menu router :default-openeds="['1']">-->
        <!--          <el-submenu index="1">-->
        <!--            <template slot="title"-->
        <!--              ><i class="el-icon-message"></i>供货商-->
        <!--            </template>-->
        <!--            <el-menu-item index="/supplier/stock">库存管理</el-menu-item>-->
        <!--            <el-menu-item index="/supplier/trade">交易清单</el-menu-item>-->
        <!--          </el-submenu>-->
        <!--        </el-menu>-->
      </el-aside>
      <el-container>
        <!--   头部   -->
        <el-header style="text-align: right; font-size: 12px">
          <el-dropdown>
            <i class="el-icon-setting" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>查看</el-dropdown-item>
              <el-dropdown-item>新增</el-dropdown-item>
              <el-dropdown-item>删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span>王小虎</span>
        </el-header>
        <!--      主体-->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss"></style>
