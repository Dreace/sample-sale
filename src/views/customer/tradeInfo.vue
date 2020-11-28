<template>
  <div>
    <h1>订单管理</h1>
    <!-- 表格 -->
    <div id="trade">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="订单编号" prop="orderID"></el-table-column>
        <el-table-column label="收款方" prop="agentID"></el-table-column>
        <el-table-column
          label="订单时间"
          prop="orderDate"
          style="width: 400px"
        ></el-table-column>
        <!--        <template slot-scope="scope">-->
        <!--          {{ new Date(scope.row.orderDate * 1000).toLocaleString() }}-->
        <!--        </template>-->
        <el-table-column label="订单状态" prop="state">
          <template slot-scope="scope">
            <el-tag
              type="success"
              v-if="scope.row.customerSign && scope.row.agentSign"
              >已完成</el-tag
            >
            <el-tag v-else-if="scope.row.agentSign">已签名 </el-tag>
            <el-tag type="warning" v-else>未签名 </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- eslint-disable-next-line -->
          <!-- eslint-disable-next-line -->
          <template slot-scope="scope">
            <el-button size="mini" @click="Download(scope.$index, scope.row)"
              >下 载</el-button
            >
            <el-button
              size="mini"
              @click="
                FindOrder(scope.$index, scope.row);
                getOrderTable(scope.$index, scope.row);
              "
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
          title="订单详情"
        >
          <el-form :model="OrderInfo" label-position="left" style="width: auto">
            <el-form-item>
              <el-row style="width: 100%">
                <el-col style="width: 25%">
                  <el-form-item label="客户ID：">
                    <div>{{ OrderInfo.customerID }}</div>
                  </el-form-item>
                </el-col>
                <el-col style="width: 25%">
                  <el-form-item label="代理商ID：">
                    <div>{{ OrderInfo.agentID }}</div>
                  </el-form-item>
                </el-col>
                <el-col style="width: 50%">
                  <el-form-item label="订单状态：">
                    <el-tag type="success" v-if="OrderInfo.state === 2"
                      >已完成</el-tag
                    >
                    <el-tag v-else-if="OrderInfo.state === 1">已签名</el-tag>
                    <el-tag type="warning" v-else>未签名</el-tag>
                  </el-form-item>
                </el-col>
              </el-row>
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
          </el-form>
          <template>
            <el-table :data="OrdertableData" style="width: 99.9%">
              <el-table-column prop="goods_id" label="货物编号">
              </el-table-column>
              <el-table-column prop="goodsName" label="商品名称">
              </el-table-column>
              <el-table-column prop="stockId" label="商品ID"> </el-table-column>
              <el-table-column prop="production_date" label="生产日期">
              </el-table-column>
            </el-table>
          </template>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogOrderVisible = false"
              >取 消</el-button
            >
            <el-button
              type="primary"
              @click="customerSignVisible = true"
              :disabled="this.OrderInfo.state !== 1"
              >签 名</el-button
            >
          </span>
        </el-dialog>
      </template>
    </div>
    <div>
      <el-dialog
        title="客户签名"
        :visible.sync="customerSignVisible"
        destroy-on-close
        append-to-body
      >
        <el-form :model="signForm" ref="signForm" label-width="80px">
          <el-form-item label="私钥" required>
            <input type="file" accept=".pem" @change="readPrivateKey($event)" />
            <div v-if="privateKey">
              {{ privateKey.getUserIds()[0] }}
            </div>
          </el-form-item>
          <el-form-item
            label="私钥密码"
            prop="password"
            :rules="[
              { required: true, message: '私钥密码不能为空', trigger: 'blur' }
            ]"
          >
            <el-input
              type="password"
              v-model="signForm.password"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="customerSignVisible = false">取 消</el-button>
          <el-button type="primary" @click="customerSignCheck"
            >确认签名</el-button
          >
        </div>
      </el-dialog>
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

<style></style>

<script lang="ts">
import Component from "vue-class-component";
import { ElForm } from "element-ui/types/form";
import Vue from "vue";
import api from "@/utils/api";
import { key } from "openpgp";
import Key = key.Key; // @ is an alias to /src
// import { verify, cleartext, signature, key, sign } from "openpgp";

interface TableValue {
  orderID: number;
  agentID: number;
  orderDate: number;
  state: number;
}
interface SignFormValue {
  password: string;
}
interface OrderInfoValue {
  customerID: number;
  agentID: number;
  orderDate: number;
  state: number;
  agentSign: string;
  customerSign: string;
  orderID: number;
}
interface OrdertableDataValue {
  goods_id: number;
  stockId: number;
  production_date: number;
  price: number;
  sign: string;
  state: number;
  goodsName: string;
  parameters: string;
}

@Component
export default class Order extends Vue {
  tableData: TableValue[] = [];
  search = "";
  dialogOrderVisible = false;
  customerSignVisible = false;
  currentPage1 = 1;
  pagesizes = 10;
  pagetotal = 1;
  OrderInfo: OrderInfoValue = {
    customerID: 0,
    agentID: 0,
    orderDate: 0,
    state: 0,
    agentSign: "",
    customerSign: "",
    orderID: 0
  };
  OrdertableData: OrdertableDataValue[] = [];
  signForm: SignFormValue = {
    password: ""
  };
  privateKey: Key.Key | null = null;
  readPrivateKey(event: Event) {
    const fileReader = new FileReader();
    fileReader.onload = async () => {
      this.privateKey = (await key.readArmored(fileReader.result)).keys[0];
    };
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      fileReader.readAsText(files[0]);
    }
  }

  async Download(index: number, row: TableValue) {
    console.log(row);

    alert("download");
  }

  handleCurrentChange(page: number) {
    this.currentPage1 = page;
  }

  handleSizeChange(size: number) {
    this.pagesizes = size;
  }

  async FindOrder(index: number, row: TableValue) {
    this.dialogOrderVisible = true;
    const res = (await api.post("customer/OrderInfo", row)) as OrderInfoValue;
    if (res !== null) {
      this.OrderInfo.customerID = res.customerID;
      this.OrderInfo.customerSign = res.customerSign;
      this.OrderInfo.agentID = res.agentID;
      this.OrderInfo.agentSign = res.agentSign;
      this.OrderInfo.orderID = res.orderID;
      this.OrderInfo.orderDate = res.orderDate;
      this.OrderInfo.state = res.state;
    }
  }
  async getOrderTable(index: number, row: TableValue) {
    this.OrdertableData = (await api.post(
      "customer/OrderInfoTable",
      row
    )) as OrdertableDataValue[];
  }
  async Delete(index: number, row: TableValue) {
    const res = await api.post("customer/OrderDelete", row);
    if (res !== null) {
      this.$message({
        type: "success",
        message: res + "删除成功!"
      });
    }
  }
  customerSignCheck() {
    alert("签名失败");
  }

  async RefreshOrder() {
    this.tableData = (await api.get("customer/Orders")) as TableValue[];
    this.pagetotal = this.tableData.length;
    this.search = "";
  }

  mounted() {
    this.RefreshOrder();
  }
}
</script>
