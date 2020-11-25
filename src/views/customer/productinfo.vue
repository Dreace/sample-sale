<template>
  <div>
    <h1>商品信息</h1>
    <div style="margin-top: 15px;">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-input
            placeholder="请输入内容"
            v-model="search"
            class="input-with-select"
          >
            <el-select
              class="select1"
              v-model="searchSelect"
              slot="prepend"
              placeholder="请选择"
            >
              <el-option label="货物编号" value="1"></el-option>
              <el-option label="货物名称" value="2"></el-option>
            </el-select>
            <el-button
              slot="append"
              icon="el-icon-search"
              v-on:click="SearchStock"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button v-on:click="refreshProduct">刷新</el-button>
        </el-col>
        <el-col :span="6">
          <el-button v-on:click="FindCart">查看购物车</el-button>
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
            <el-button size="medium" @click="Add()">添加</el-button>
            <el-button @click="FindInfo(scope.$index, tableData)"
              >查看详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="stockInfo">
      <el-dialog
        title="商品详情"
        :visible.sync="dialogFindStockVisible"
        :close-on-click-modal="true"
      >
        <span>
          <el-form
            :model="form"
            label-position="left"
            inline
            class="demo-table-expand"
          >
            <el-form-item label="商品编号：">
              <span>{{ form.stockID }}</span>
            </el-form-item>
            <el-form-item label="商品名称：">
              <span>{{ form.goodsName }}</span>
            </el-form-item>
            <el-form-item label="生产日期：">
              <span>{{ form.productDate }}</span>
            </el-form-item>
            <el-form-item label="库存：">
              <span>{{ form.surplus }}</span>
            </el-form-item>
            <el-form-item label="供货商：">
              <span>{{ form.supplier }}</span>
            </el-form-item>
            <el-form-item label="价格：">
              <span>{{ form.price }}</span>
            </el-form-item>
            <el-row>
              <el-form-item label="描述：">
                <span>{{ form.parameters }}</span>
              </el-form-item>
            </el-row>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogFindStockVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>

    <div class="ShopCart">
      <el-dialog
        title="商品详情"
        :visible.sync="dialogFindCartVisible"
        :close-on-click-modal="true"
      >
        <span>
          <el-table :data="tableOrder"> </el-table>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogFindCartVisible = false">取 消</el-button>
          <el-button @click="Buy">下 单</el-button>
        </span>
      </el-dialog>
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
  stockId: number;
  goodsName: string;
  price: string;
}
interface FormValue {
  stockID: any;
  goodsName: any;
  productDate: any;
  parameters: any;
  surplus: any;
  price: any;
  supplier: any;
}

@Component
export default class Product extends Vue {
  tableData: TableVale[] = [];
  pagesizes = 10;
  currentPage1 = 1;
  total = 1;
  search = "";
  searchSelect = "";
  dialogFindStockVisible = false;
  dialogFindCartVisible = false;

  form = {
    stockID: "",
    goodsName: "",
    productDate: "",
    parameters: "",
    surplus: "",
    price: "",
    supplier: "",
    sign: ""
  };

  FindInfo(index, rows) {
    this.dialogFindStockVisible = true;
    console.log(index);
    console.log(rows.stockId);
  }
  FindCart() {
    this.dialogFindCartVisible = true;
    alert("阿斯顿撒旦");
  }
  Buy() {
    this.$confirm("是否确定下单?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.$message({
          type: "success",
          message: "下单成功!"
        });
        console.log();
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消下单"
        });
      });
  }
  Add() {
    alert("阿凡达是否");
  }
  handleCurrentChange(page: number) {
    this.currentPage1 = page;
  }
  handleSizeChange(size: number) {
    this.pagesizes = size;
  }
  handleSelectionChange(val: number) {
    console.log(val);
  }

  async SearchStock() {
    console.log(this.searchSelect);
    console.log(this.search);
    this.tableData = (await api.post("customer/productinfo", {
      select: this.searchSelect,
      search: this.search
    })) as TableVale[];
  }
  async refreshProduct() {
    this.tableData = (await api.get("customer/productinfo")) as TableVale[];
    this.total = this.tableData.length;
  }

  mounted() {
    this.refreshProduct();
  }
}
</script>
>

<style scoped>
.select1 {
  width: 130px;
}
.input-with-select {
  background-color: #fff;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
