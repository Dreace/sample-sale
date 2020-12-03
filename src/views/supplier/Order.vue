<template>
  <div>
    <el-button v-on:click="refreshAgentOrders">刷新</el-button>
    <el-table :data="agentOrders">
      <el-table-column prop="orderId" label="订单编号"></el-table-column>
      <el-table-column prop="agentName" label="代理商"></el-table-column>
      <el-table-column prop="createTime" label="创建时间">
        <template slot-scope="scope">
          {{ new Date(scope.row.createTime * 1000).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag
            type="success"
            v-if="scope.row.supplierSign && scope.row.agentSign"
          >
            已完成
          </el-tag>
          <el-tag v-else-if="scope.row.supplierSign">
            已签名
          </el-tag>
          <el-tag type="warning" v-else>
            未签名
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            :disabled="!!scope.row.supplierSign"
            v-on:click="
              currentOrder = scope.row;
              getOrderGoods();
              showConfirmButton = true;
            "
            >签名
          </el-button>
          <el-button
            size="mini"
            v-on:click="
              currentOrder = scope.row;
              getOrderGoods();
              orderDialogVisible = true;
              showConfirmButton = false;
            "
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="订单详情"
      :visible.sync="orderDialogVisible"
      width="1000px"
    >
      <el-dialog
        title="签名订单"
        :visible.sync="signDialogVisible"
        width="500px"
        destroy-on-close
        append-to-body
      >
        <el-form ref="signForm" :model="signForm" label-width="80px">
          <el-form-item label="私钥" required>
            <input
              type="file"
              accept=".pem,.asc"
              @change="readPrivateKey($event)"
            />
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
          <el-button
            @click="
              signDialogVisible = false;
              clearSignForm();
            "
            >取 消
          </el-button>
          <el-button type="primary" @click="onSignOrderConfirm"
            >确 定
          </el-button>
        </div>
      </el-dialog>
      <div v-if="currentOrder" style="display: flex">
        <span>编号：{{ currentOrder.orderId }}</span>
        <el-divider direction="vertical"></el-divider>
        <span>代理商：{{ currentOrder.agentId }}</span>
        <el-divider direction="vertical"></el-divider>
        <span>附加协议：{{ currentOrder.additional }}</span>
      </div>
      <el-table :data="agentOrderGoods" show-summary :summary-method="summary">
        <el-table-column prop="goodsId" label="编号"></el-table-column>
        <el-table-column prop="goodsName" label="名称"></el-table-column>
        <el-table-column prop="productionDate" label="生产日期">
          <template slot-scope="scope">
            {{ new Date(scope.row.productionDate * 1000).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column
          width="70px"
          prop="price"
          label="单价"
        ></el-table-column>
        <el-table-column prop="signValid" label="签名校验">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.signValid">
              通过
            </el-tag>
            <el-tag v-else type="warning"> 签名不匹配</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="orderDialogVisible = false">取 消</el-button>
        <el-button
          v-if="showConfirmButton"
          type="primary"
          @click="signDialogVisible = true"
          :disabled="allSignVerified !== true"
          >确认签名
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import api from "@/utils/api";
import Vue from "vue";
import Component from "vue-class-component";
import { ElForm } from "element-ui/types/form";
import { verify, cleartext, signature, key, sign } from "openpgp";
import { GoodsValue } from "@/views/supplier/Stock.vue";

interface AgentOrderValue {
  orderId: number;
  supplierId: number;
  agentId: number;
  supplierSign?: string;
  agentSign?: string;
  createTime: number;
  additional: string;
  agentName: string;
}

interface SignForm {
  password: string;
}

@Component
export default class Order extends Vue {
  agentOrders: AgentOrderValue[] = [];
  orderDialogVisible = false;
  currentOrder: AgentOrderValue | null = null;
  agentOrderGoods: GoodsValue[] = [];
  allSignVerified = false;
  signDialogVisible = false;
  privateKey: key.Key | null = null;
  signForm: SignForm = {
    password: ""
  };
  publicKey = "";
  showConfirmButton = false;

  async refreshAgentOrders() {
    this.agentOrders = await api.get("supplier/orders");
  }

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

  onSignOrderConfirm() {
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
          this.agentOrderGoods.forEach(item => {
            goodsSign.push(item.sign);
          });
          const orderInformation = {
            additional: "无",
            agentId: this.currentOrder.agentId,
            createTime: this.currentOrder.createTime,
            orderId: this.currentOrder.orderId,
            supplierId: this.currentOrder.supplierId,
            signs: goodsSign
          };
          const signature = (
            await sign({
              message: cleartext.fromText(JSON.stringify(orderInformation)), // CleartextMessage or Message object
              privateKeys: [this.privateKey], // for signing
              detached: true
            })
          ).signature;
          await api.post(`supplier/orders/${this.currentOrder.orderId}/sign`, {
            sign: signature
          });
          await this.refreshAgentOrders();
          this.signDialogVisible = false;
          this.orderDialogVisible = false;
          this.clearSignForm();
        }
      }
    });
  }

  clearSignForm() {
    (this.$refs.signForm as ElForm).resetFields();
  }

  async getOrderGoods() {
    if (this.currentOrder) {
      this.agentOrderGoods = [];
      const agentOrderGoods: GoodsValue[] = await api.get(
        `supplier/orders/${this.currentOrder.orderId}`
      );
      this.publicKey = await api.get(
        `user/${this.currentOrder.supplierId}/key`
      );
      // this.signCheckResult = Array(this.agentOrderGoods.length);
      for (const goods of agentOrderGoods) {
        await this.checkSign(goods);
      }
      this.agentOrderGoods = agentOrderGoods;
      this.orderDialogVisible = true;
      let signValid = true;
      agentOrderGoods.forEach(
        goods => (signValid = signValid && !!goods.signValid)
      );
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
        publicKeys: (await key.readArmored(this.publicKey)).keys // for verification
      })
    ).signatures[0].valid;
  }

  summary(): Array<string | number> {
    const sums: Array<string | number> = ["合计", ""];
    let quantity = 0,
      total = 0;
    for (const item of this.agentOrderGoods) {
      quantity += 1;
      total += item.price;
    }
    sums.push(quantity, total);
    return sums;
  }

  mounted() {
    this.refreshAgentOrders();
  }
}
</script>

<style scoped>
.el-divider--vertical {
  height: unset;
}
</style>
