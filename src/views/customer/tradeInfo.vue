<template>
  <div>
    <h1>订单管理</h1>
    <!-- 表格 -->
    <div id="trade">
      <el-table
        :data="
          tableData.filter(
            data =>
              !search || data.name.toLowerCase().includes(search.toLowerCase())
          )
        "
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="订单编号" prop="orderID"></el-table-column>
        <el-table-column label="收款方" prop="agentID"></el-table-column>
        <el-table-column label="订单时间" prop="orderDate"></el-table-column>
        <el-table-column label="订单状态" prop="state"></el-table-column>
        <el-table-column align="right">
          <!-- eslint-disable-next-line -->
          <template slot="header" slot-scope="scope">
            <el-row :gutter="20">
              <el-col align="right" :span="16">
                <el-input
                  v-model="search"
                  size="medium"
                  placeholder="输入关键字搜索"
                  icon="el-icon-search"
                ></el-input>
              </el-col>
              <el-col align="right" :span="4">
                <el-button @click="RefreshOrder">重 置</el-button>
              </el-col>
            </el-row>
          </template>
          <!-- eslint-disable-next-line -->
          <template slot-scope="scope">
            <el-button size="mini" @click="Download(scope.$index, scope.row)"
              >下 载</el-button
            >
            <el-button size="mini" @click="FindOrder(scope.$index, scope.row)"
              >查 看</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="Delete(scope.$index, scope.row)"
              >删 除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <template>
        <el-dialog
          class="order_dialog"
          :visible.sync="dialogOrderVisible"
          :show-close="true"
        >
          <span>
            <el-form
              :model="OrderInfo"
              label-position="left"
              inline
              class="demo-table-expand"
            >
              <el-form-item label="客户ID：">
                <span>{{ OrderInfo.price }}</span>
              </el-form-item>
              <el-form-item label="收款方ID：">
                <span>{{ OrderInfo.agentID }}</span>
              </el-form-item>
              <el-row>
                <el-form-item label="代理签名：">
                  <span>{{ OrderInfo.agentSign }}</span>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="客户签名：">
                  <span>{{ OrderInfo.customerSign }}</span>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="订单状态：">
                  <span>{{ OrderInfo.state }}</span>
                </el-form-item>
              </el-row>
              <el-form-item>
                <template>
                  <el-table :data="OrdertableData" style="width: 100%">
                    <el-table-column prop="date" label="日期" width="180">
                    </el-table-column>
                    <el-table-column prop="name" label="姓名" width="180">
                    </el-table-column>
                    <el-table-column prop="address" label="地址">
                    </el-table-column>
                  </el-table>
                </template>
              </el-form-item>
            </el-form>
          </span>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogOrderVisible = false"
              >确 定</el-button
            >
          </span>
        </el-dialog>
      </template>
    </div>
    <div class="block" align="center">
      <el-pagination
        layout="prev, pager, next, sizes, total, jumper"
        :current-page.sync="currentPage1"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pagesizes"
        :total="pagetotal"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<style>
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.order_dialog {
  width: 100%;
  height: 100%;
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import api from "@/utils/api"; // @ is an alias to /src

interface TableValue {
  orderID: number;
  agentID: number;
  orderDate: string;
  state: number;
}

interface OrderInfoValue {
  customerID: number;
  agentID: number;
  orderDate: string;
  state: number;
  agentSign: string;
  customerSign: string;
  orderID: number;
}
interface OrdertableDataValue {
  goodsID: number;
  stockID: number;
  productionDate: string;
  price: number;
  goodsSign: string;
}

@Component
export default class Order extends Vue {
  tableData: TableValue[] = [];
  search = "";
  dialogOrderVisible = false;
  currentPage1 = 1;
  pagesizes = 10;
  pagetotal = 1;
  OrderInfo: OrderInfoValue = {
    customerID: 0,
    agentID: 0,
    orderDate: "",
    state: 0,
    agentSign: "",
    customerSign: "",
    orderID: 0
  };
  OrdertableData: OrdertableDataValue[] = [];

  Download(index: number, row: OrderInfoValue) {
    alert("download");
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

  async FindOrder(index: number, row: TableValue) {
    this.dialogOrderVisible = true;
    alert("我趴就点进去了");
    console.log(row);
    // this.OrderInfo = (await api.post("customer/OrderInfo", row)) as OrderInfoValue;
  }

  async Delete(index: number, row: TableValue) {
    const res = await api.post("customer/OrderDelete", row);
    if (res !== null) {
      console.log(res);
      this.$message({
        type: "success",
        message: res + "删除成功!"
      });
    }
  }

  async RefreshOrder() {
    this.tableData = (await api.get("customer/Orders")) as TableValue[];
    this.search = "";
  }
  mounted() {
    this.RefreshOrder();
  }
}
</script>
