<template>
  <div>
    <el-button v-on:click="refreshAgentOrders">刷新</el-button>
    <el-table :data="agentOrders">
      <el-table-column prop="orderId" label="订单编号"></el-table-column>
      <el-table-column prop="supplierName" label="供货商"></el-table-column>
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
            供货商已确认
          </el-tag>
          <el-tag type="warning" v-else>
            供货商未签名
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            :disabled="!scope.row.supplierSign || !!scope.row.agentSign"
            v-on:click="
              currentOrder = scope.row;
              getOrderGoods();
            "
            >签名
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="订单详情" :visible.sync="orderDialogVisible">
      <el-dialog
        title="商品信息"
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
              signForm.password = '';
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
        <el-divider direction="vertical"></el-divider>

        <el-tag type="success" size="mini" v-if="currentOrder.signValid"
          >供货商签名校验成功</el-tag
        >
        <el-tag type="warning" size="mini" v-else>供货商签名校验失败</el-tag>
      </div>
      <el-table :data="agentOrderGoods" show-summary :summary-method="summary">
        <el-table-column prop="goodsName" label="名称"></el-table-column>
        <el-table-column prop="productionDate" label="生产日期">
          <template slot-scope="scope">
            {{ new Date(scope.row.productionDate * 1000).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="price" label="加个"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="orderDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="signDialogVisible = true"
          :disabled="!currentOrder || !currentOrder.signValid"
          >确认下单
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
  supplierPublicKey: string;
  agentId: number;
  supplierSign?: string;
  agentSign?: string;
  createTime: number;
  additional: string;
  signValid?: boolean;
  supplierName: string;
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
  signDialogVisible = false;
  privateKey: key.Key | null = null;
  signForm: SignForm = {
    password: ""
  };

  async refreshAgentOrders() {
    this.agentOrders = await api.get("agent/orders");
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
          await api.post(`agent/orders/${this.currentOrder.orderId}/sign`, {
            sign: signature
          });
          await this.refreshAgentOrders();
          this.signDialogVisible = false;
          this.orderDialogVisible = false;
        }
      }
    });
  }

  async getOrderGoods() {
    if (this.currentOrder) {
      const agentOrderGoods: GoodsValue[] = await api.get(
        `supplier/orders/${this.currentOrder.orderId}`
      );
      if (this.currentOrder) {
        const goodsSign: string[] = [];
        agentOrderGoods.forEach(item => {
          goodsSign.push(item.sign);
        });
        const orderInformation = {
          additional: this.currentOrder.additional,
          agentId: this.currentOrder.agentId,
          createTime: this.currentOrder.createTime,
          orderId: this.currentOrder.orderId,
          supplierId: this.currentOrder.supplierId,
          signs: goodsSign
        };
        console.log(JSON.stringify(orderInformation));
        this.currentOrder.signValid = (
          await verify({
            message: cleartext.fromText(JSON.stringify(orderInformation)), // CleartextMessage or Message object
            signature: await signature.readArmored(
              this.currentOrder.supplierSign
            ), // parse detached signature
            publicKeys: (
              await key.readArmored(this.currentOrder.supplierPublicKey)
            ).keys // for verification
          })
        ).signatures[0].valid;
      }
      this.agentOrderGoods = agentOrderGoods;
      this.orderDialogVisible = true;
    }
  }

  summary(): Array<string | number> {
    const sums: Array<string | number> = ["合计", ""];
    let total = 0;
    for (const item of this.agentOrderGoods) {
      total += item.price;
    }
    sums.push(total);
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
