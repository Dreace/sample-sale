<template>
  <div id="app">
    <!--    <div id="nav">-->
    <!--      <router-link to="/">Home</router-link> |-->
    <!--      <router-link to="/about">About</router-link>-->
    <!--    </div>-->
    <el-container style="height: 95vh;">
      <el-aside
        v-if="this.$route.path !== '/'"
        width="200px"
        style="background-color: rgb(238, 241, 246)"
      >
        <el-menu router :default-openeds="['1', '2', '3']">
          <el-submenu
            index="1"
            v-if="
              this.$route.path === '/supplier/stock' ||
                this.$route.path === '/supplier/order'
            "
          >
            <template slot="title">
              <i class="el-icon-message"></i>供货商
            </template>
            <el-menu-item index="/supplier/stock">库存管理</el-menu-item>
            <el-menu-item index="/supplier/order">交易清单</el-menu-item>
          </el-submenu>
          <el-submenu
            index="2"
            v-if="
              this.$route.path === '/agent/purchase' ||
                this.$route.path === '/supplier/trade'
            "
          >
            <template slot="title"
              ><i class="el-icon-message"></i>代理商
            </template>
            <el-menu-item index="/agent/purchase">进货</el-menu-item>
            <el-menu-item index="/agent/order">交易清单</el-menu-item>
          </el-submenu>
          <el-submenu
            index="3"
            v-if="
              this.$route.path === '/customer/productinfo' ||
                this.$route.path === '/customer/shopcart' ||
                this.$route.path === '/customer/tradeInfo'
            "
          >
            <template slot="title">
              <i class="el-icon-message"></i>客户
            </template>
            <el-menu-item index="/customer/productinfo">商品信息</el-menu-item>
            <el-menu-item index="/customer/shopcart">购物车</el-menu-item>
            <el-menu-item index="/customer/tradeInfo">交易信息</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <!--   头部   -->
        <el-header
          v-if="this.$route.path !== '/'"
          style="text-align: right; font-size: 12px"
        >
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
