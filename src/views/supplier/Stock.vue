<template>
  <div>
    <el-button v-on:click="refreshSupplierStock">刷新</el-button>
    <!--    <el-input v-model="input" v-on:input="reverse"></el-input>-->
    <!--    <p>{{ reversed }}</p>-->
    <el-table :data="supplierStocks">
      <el-table-column prop="goodsId" label="商品编号"></el-table-column>
      <el-table-column prop="goodsName" label="商品名称"></el-table-column>
      <el-table-column prop="surplus" label="库存"></el-table-column>
      <el-table-column prop="modifyTime" label="上次变动时间"></el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import api from "@/utils/api";
import Vue from "vue";
import Component from "vue-class-component";

interface SupplierStockValue {
  goodsId: number;
  supplierId: number;
  goodsName: string;
  surplus: number;
  modifyTime: number;
}

@Component
export default class Stock extends Vue {
  input = "";
  reversed = "";
  supplierStocks: SupplierStockValue[] = [];

  async reverse() {
    this.reversed = await api.post("test/reverse", {
      payload: this.input
    });
  }

  async refreshSupplierStock() {
    this.supplierStocks = (await api.get(
      "supplier/stocks"
    )) as SupplierStockValue[];
  }
}
</script>

<style lang="scss"></style>
