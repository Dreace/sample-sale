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
                this.$route.path === '/agent/agentOrder' ||
                this.$route.path === '/agent/order'
            "
          >
            <template slot="title"
              ><i class="el-icon-message"></i>代理商
            </template>
            <el-menu-item index="/agent/purchase">进货</el-menu-item>
            <el-menu-item index="/agent/agentOrder">客户订单管理</el-menu-item>
            <el-menu-item index="/agent/order">交易清单</el-menu-item>
          </el-submenu>
          <el-submenu
            index="3"
            v-if="
              this.$route.path === '/customer/productinfo' ||
                this.$route.path === '/customer/tradeInfo' ||
                this.$route.path === '/customer/trace'
            "
          >
            <template slot="title">
              <i class="el-icon-message"></i>客户
            </template>
            <el-menu-item index="/customer/productinfo">商品信息</el-menu-item>
            <el-menu-item index="/customer/tradeInfo">交易信息</el-menu-item>
            <el-menu-item index="/customer/trace">商品追溯</el-menu-item>
          </el-submenu>
          <el-submenu index="4" v-if="this.$route.path === '/admin/log'">
            <template slot="title">
              <i class="el-icon-message"></i>管理员
            </template>
            <el-menu-item index="/admin/log">日志</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <!--      主体-->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<style lang="scss"></style>
