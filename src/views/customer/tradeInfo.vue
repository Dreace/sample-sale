<template>
  <div>
    <h1>订单管理</h1>
    <!-- 表格 -->
    <div id="trade">
      <el-table
        :data="
          tableData.slice(
            (currentPage1 - 1) * pagesizes,
            currentPage1 * pagesizes
          )
        "
        style="width: 100%"
      >
        <el-table-column label="订单编号" prop="orderID"></el-table-column>
        <el-table-column label="收款方" prop="agentID"></el-table-column>
        <el-table-column label="订单时间" prop="orderDate" style="width: 400px">
          <template slot-scope="scope">
            {{ new Date(scope.row.orderDate * 1000).toLocaleString() }}
          </template>
        </el-table-column>
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
          <template slot-scope="scope">
            <!--            <el-button size="mini" @click="Download(scope.$index, scope.row)"-->
            <!--              >下 载</el-button-->
            <!--            >-->
            <el-button
              size="mini"
              @click="
                dialogOrderVisible = true;
                getOrderGoods(scope.$index, scope.row);
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
                    <el-tag
                      type="success"
                      v-if="OrderInfo.agentSign && OrderInfo.customerSign"
                      >已完成</el-tag
                    >
                    <el-tag v-else-if="OrderInfo.agentSign">已签名</el-tag>
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
              <el-table-column prop="goodsId" label="货物编号">
              </el-table-column>
              <el-table-column prop="goodsName" label="商品名称">
              </el-table-column>
              <el-table-column prop="stockId" label="商品ID"> </el-table-column>
              <el-table-column prop="productionDate" label="生产日期">
                <template slot-scope="scope">
                  {{
                    new Date(scope.row.productionDate * 1000).toLocaleString()
                  }}
                </template>
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
              :disabled="
                this.OrderInfo.customerSign !== null ||
                  this.OrderInfo.agentSign === null
              "
              >签 名</el-button
            >
          </span>
        </el-dialog>
      </template>
    </div>
    <div>
      <el-dialog
        title="签名"
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
import { verify, cleartext, signature, key, sign } from "openpgp";
import FileSaver from "file-saver";

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
interface GoodsValue {
  goodsName?: string;
  stockId: number;
  goodsId: string;
  productionDate: number;
  parameters: string;
  price: number;
  sign: string;
  signValid?: boolean;
}
interface DownloadValue {
  agentID: number;
  customerID: number;
  orderID: number;
  orderTime: number;
  stockId: number;
  goodsId: number;
  goodsName: string;
  parameters: string;
  price: number;
  productionDate: number;
  sign: string;
  customerSign: string;
  agentSign: string;
}
@Component
export default class Order extends Vue {
  tableData: OrderInfoValue[] = [];
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
  OrdertableData: GoodsValue[] = [];
  signForm: SignFormValue = {
    password: ""
  };
  privateKey: key.Key | null = null;
  currentOrder: OrderInfoValue | null = null;
  allSignVerified = false;

  readPrivateKey(event: Event) {
    const fileReader = new FileReader();
    fileReader.onload = async () => {
      // eslint-disable-next-line no-undef
      this.privateKey = (await key.readArmored(fileReader.result)).keys[0];
    };
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      fileReader.readAsText(files[0]);
    }
  }

  // async Download(index: number, row: OrderInfoValue) {
  //   const OrderGoods = (await api.get(
  //     `customer/orderDownload/${row.orderID}`
  //   )) as DownloadValue;
  // const file = new File([JSON.stringify(OrderGoods, null, 5)], "hello.txt", {
  //   type: "application/json,charset=UTF-8"
  // });
  // FileSaver.saveAs(file);
  // }

  handleCurrentChange(page: number) {
    this.currentPage1 = page;
  }

  handleSizeChange(size: number) {
    this.pagesizes = size;
  }
  Delete(index: number, row: OrderInfoValue) {
    this.$confirm("此操作将永久删除该订单将导致无法追朔, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        const res = await api.post("customer/OrderDelete", row);
        if (res !== null) {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        }
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
  }

  customerSignCheck() {
    if (!this.privateKey) {
      this.$message({
        message: "未选择私钥文件",
        type: "error"
      });
      return;
    }
    (this.$refs.signForm as ElForm).validate(async isValid => {
      if (isValid) {
        try {
          if (this.privateKey && !this.privateKey.isDecrypted()) {
            await this.privateKey.decrypt(this.signForm.password);
          }
        } catch (e) {
          this.$message({
            message: "私钥密码错误",
            type: "error"
          });
          console.log(e);
          return;
        }
        if (this.currentOrder) {
          const goodsSign: string[] = [];
          this.OrdertableData.forEach(item => {
            goodsSign.push(item.sign);
          });
          const orderInformation = {
            customerId: this.currentOrder.customerID,
            orderTime: this.currentOrder.orderDate,
            orderId: this.currentOrder.orderID,
            agentID: this.currentOrder.agentID,
            signs: goodsSign
          };
          const signature = (
            await sign({
              message: cleartext.fromText(JSON.stringify(orderInformation)), // CleartextMessage or Message object
              privateKeys: [this.privateKey], // for signing
              detached: true
            })
          ).signature;
          await api.post(
            `customer/ordersCustomer/${this.currentOrder.orderID}/sign`,
            {
              sign: signature
            }
          );
          const filename =
            "Customer_Order" +
            this.currentOrder.orderID +
            "'s_Customer_Sign.pem";
          const file = new File([signature], filename, {
            type: "text/plain;charset=utf-8"
          });
          FileSaver.saveAs(file);
          await this.RefreshOrder();
          this.customerSignVisible = false;
          this.dialogOrderVisible = false;
        }
      }
    });
  }

  async getOrderGoods(index: number, row: OrderInfoValue) {
    this.currentOrder = row;
    this.OrderInfo = row;
    if (this.currentOrder) {
      const OrderGoods: GoodsValue[] = await api.get(
        `customer/orders/${this.currentOrder.orderID}`
      );
      // this.signCheckResult = Array(this.agentOrderGoods.length);
      for (const goods of OrderGoods) {
        await this.checkSign(goods);
      }
      this.OrdertableData = OrderGoods;
      this.dialogOrderVisible = true;
      let signValid = true;
      OrderGoods.forEach(goods => (signValid = signValid && !!goods.signValid));
      this.allSignVerified = signValid;
    }
  }
  async checkSign(row: GoodsValue) {
    const goods: GoodsValue = {
      stockId: row.stockId,
      goodsId: row.goodsId,
      productionDate: row.productionDate,
      parameters: row.parameters,
      price: row.price,
      sign: ""
    };
    row.signValid = (
      await verify({
        message: cleartext.fromText(JSON.stringify(goods)), // CleartextMessage or Message object
        signature: await signature.readArmored(row.sign), // parse detached signature
        publicKeys: (
          await key.readArmored(
            "-----BEGIN PGP PUBLIC KEY BLOCK-----\n" +
              "\n" +
              "mQENBF+4sKsBCACiaavtsCSp6A5inAdk4PnlbE8Rr7Onhp2wn+razP4SWIcFlHbc\n" +
              "DcIXf/+b9gVWWxPEy15kJ4XIUhktC5EElrUQii38qwH6ws4t5ELSX16xqCKIkx8M\n" +
              "+OQKD/2o2FTYPM6DS58uUWTqYoSwaLxpYuarsvRR1yZtbkLWmiunCdaO8DmGKFBE\n" +
              "pd4jcKvZlujyl8wqZ6Yz45B3+KY+rDKK980RO5OZWQDT++pYXIvlqXm7+7WCPwAk\n" +
              "oaXs4pwfiLZZ5jdW8hbBgLyyIQmWdDLURG7Wp1O2K5e6wCVSMP7N7jTUXHDmfN5o\n" +
              "+2RTe9i0dhQgE3HuUTTqGnwkdDUM2SxYM4uxABEBAAG0InRlc3QgKHNpbXBsZS1z\n" +
              "YWxlKSA8ZnVja0BudWMuc2hpdD6JAU4EEwEIADgWIQRz7nzBtIm/nMMiGu/uaCQQ\n" +
              "VTA10QUCX7iwqwIbLwULCQgHAgYVCgkICwIEFgIDAQIeAQIXgAAKCRDuaCQQVTA1\n" +
              "0dWpB/9Vc1OK9zfwtRznNLIZJgVOpm/17uuVDgqvxNSsgw4Zemtd3KXmTPagYyED\n" +
              "nmjxa6I8Kgy6pZcHz4x6FNMhDERIFuqSIAaHUcw6JYkccPzmSbBCvjHg8Itl4Ztr\n" +
              "1i/jpRjVp7Air+AnrgLAKoAp+KT1j7cKhu68nwbhX464IblHHDbudCxg1za1FXre\n" +
              "wTNqi/Pn4QXBbtZSJUu7/hhAJE5IjWnYELbSU06bbypT4UpaxnzRsP6BYSeF3id7\n" +
              "6Q5TUWsbplwXPwXY0wbo0y5xdV8T9Ml45CXi34hgWI3VALyFkckdK3mv32o7K4jp\n" +
              "1vSTQByZ0JZUQJLAaeOVj0HFcwF7\n" +
              "=C0bL\n" +
              "-----END PGP PUBLIC KEY BLOCK-----"
          )
        ).keys // for verification
      })
    ).signatures[0].valid;
  }

  async RefreshOrder() {
    this.tableData = (await api.get("customer/Orders")) as OrderInfoValue[];
    this.pagetotal = this.tableData.length;
    this.search = "";
  }

  mounted() {
    this.RefreshOrder();
  }
}
</script>
