<template>
  <div>
    <div id="Search">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            v-model="input2"
          >
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-search" @click="SearchWord()"
            >搜 索</el-button
          >
        </el-col>
      </el-row>
    </div>
    <div id="Table">
      <productTable
        :tableData="tableData"
        :msg1="msg1"
        :msg2="msg2"
        @parentfun1="Add"
        @parentfun2="Delete"
      ></productTable>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import productTable from "@/components/productTable.vue"; // @ is an alias to /src
export default {
  methods: {
    Add() {
      alert("fuck");
    },
    Delete() {
      alert("fuck1");
    },
    SearchWord() {
      alert(this.input2);
    }
  },
  components: {
    productTable
  },
  data() {
    return {
      msg1: "添加",
      msg2: "购买",
      input2: "",
      tableData: [
        {
          productID: "12987122",
          productName: "筑基丹",
          category: "江浙小吃、小吃零食",
          shop: "王小虎店",
          agentName: "淘宝",
          productPrice: "100w"
        },
        {
          productID: "1298",
          productName: "筑基丹",
          category: "小吃、零食",
          shop: "王er虎店",
          agentName: "sadsadasd",
          productPrice: "100w"
        },
        {
          productID: "12987123",
          productName: "混元太极功",
          category: "江浙小吃、小吃零食",
          shop: "马保国店",
          agentName: "马保国大弟子",
          productPrice: "100w"
        }
      ]
    };
  }
};
</script>

<style scoped></style>
