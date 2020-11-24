<template>
  <div>
    <h1>商品信息</h1>
    <div id="Search">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            v-model="input"
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-search" @click="reserve()"
            >搜 索</el-button
          >
        </el-col>
        <el-col :span="4">
          <el-button @click="refreshProduct">刷新</el-button>
        </el-col>
      </el-row>
    </div>
    <div id="Table">
      <el-table
        :data="
          tableData.slice(
            (currentPage1 - 1) * pagesizes,
            currentPage1 * pagesizes
          )
        "
        style="width: 100%"
        @selection-change="handleSelectionChange"
        >>
        <el-table-column label="商品 ID" prop="stockId"></el-table-column>
        <el-table-column label="商品名称" prop="goodsName"></el-table-column>
        <el-table-column label="商品价格" prop="price"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="medium" @click="Add(scope.$index, scope.row)"
              >添加</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block" align="center">
      <el-pagination
        layout="prev, pager, next, sizes, total, jumper"
        :current-page.sync="currentPage1"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pagesizes"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import api from "@/utils/api";
import Vue from "vue";
import Component from "vue-class-component";

interface TableVale {
  stockId: any;
  goodsName: any;
  price: any;
}

@Component
export default class Product extends Vue {
  input = "";
  tableData: TableVale[] = [];
  pagesizes = 10;
  currentPage1 = 1;
  total = 1;

  Add() {
    alert("阿凡达是否");
  }

  handleCurrentChange(page) {
    this.currentPage1 = page;
  }
  handleSizeChange(size) {
    this.pagesizes = size;
  }
  handleSelectionChange(val) {
    console.log(val);
  }

  async refreshProduct() {
    this.tableData = (await api.get("customer/productinfo")) as TableVale[];
    this.total = this.tableData.length;
    console.log(this.tableData);
  }

  mounted() {
    this.refreshProduct();
  }
}
</script>
>

<style scoped></style>
