<template>
  <div>
    <el-button type="primary" v-on:click="addStockDialogVisible = true"
      >新建商品</el-button
    >
    <el-button v-on:click="refreshSupplierStock">刷新</el-button>
    <!--    <el-input v-model="input" v-on:input="reverse"></el-input>-->
    <!--    <p>{{ reversed }}</p>-->
    <el-table :data="supplierStocks">
      <el-table-column prop="stockId" label="商品编号"></el-table-column>
      <el-table-column prop="goodsName" label="商品名称"></el-table-column>
      <el-table-column prop="surplus" label="库存"></el-table-column>
      <el-table-column prop="price" label="当前价格"></el-table-column>
      <el-table-column
        prop="modifyTime"
        label="上次变动时间"
        :formatter="cellFormatter"
      >
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleAddSurplus(scope.$index, scope.row)"
            >增加库存
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="商品信息"
      :visible.sync="addStockDialogVisible"
      width="500px"
      destroy-on-close
    >
      <el-form ref="addStockForm" :model="addStockForm" label-width="80px">
        <el-form-item
          label="名称"
          prop="goodsName"
          :rules="[
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ]"
        >
          <el-input v-model="addStockForm.goodsName"></el-input>
        </el-form-item>
        <el-form-item
          style="width: 200px"
          label="价格"
          prop="price"
          :rules="[
            { required: true, message: '价格不能为空', trigger: 'blur' }
          ]"
        >
          <el-input
            v-model="addStockForm.price"
            type="number"
            step="1"
            min="0.01"
            @keyup.native="formatPrice"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="参数"
          prop="parameters"
          :rules="[
            { required: true, message: '参数不能为空', trigger: 'blur' }
          ]"
        >
          <el-input
            v-model="addStockForm.parameters"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6 }"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="
            addStockDialogVisible = false;
            clearAddStockForm();
          "
          >取 消
        </el-button>
        <el-button type="primary" @click="onAddStockConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="商品信息"
      :visible.sync="addSurplusDialogVisible"
      width="500px"
      destroy-on-close
    >
      <el-form ref="addSurplusForm" :model="addSurplusForm" label-width="80px">
        <el-form-item label="商品名称">
          <el-input v-model="addSurplusForm.goodsName" disabled></el-input>
        </el-form-item>
        <el-form-item label="增加数量">
          <el-input-number
            :min="1"
            v-model="addSurplusForm.quantity"
          ></el-input-number>
        </el-form-item>
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
            v-model="addSurplusForm.password"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="
            addSurplusDialogVisible = false;
            clearAddSurplusForm();
          "
          >取 消
        </el-button>
        <el-button type="primary" @click="onAddSurplusConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import api from "@/utils/api";
import Vue from "vue";
import { sign, cleartext, key } from "openpgp";
import Component from "vue-class-component";
import Key = key.Key;
import { ElForm } from "element-ui/types/form";

export interface SupplierStockValue {
  stockId: number;
  supplierId: number;
  goodsName: string;
  surplus: number;
  modifyTime: number;
  parameters: string;
  price: number;
}

interface AddStockFormValue {
  stockId: number;
  goodsName: string;
  quantity: number;
  privateKey: string;
  password: string;
}

interface StockFormValue {
  goodsName: string;
  parameters: string;
  price: string;
}

@Component
export default class Stock extends Vue {
  input = "";
  reversed = "";
  supplierStocks: SupplierStockValue[] = [];
  addSurplusDialogVisible = false;
  addSurplusForm: AddStockFormValue = {
    stockId: -1,
    goodsName: "",
    quantity: 1,
    privateKey: "",
    password: ""
  };
  addStockDialogVisible = false;
  addStockForm: StockFormValue = {
    goodsName: "",
    parameters: "",
    price: "0.01"
  };
  privateKey: Key | null = null;
  currentStock: SupplierStockValue | null = null;

  cellFormatter(row: SupplierStockValue): string {
    return new Date(row.modifyTime * 1000).toLocaleString();
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

  async onAddSurplusConfirm() {
    if (!this.privateKey) {
      this.$message({
        message: "未选择私钥文件",
        type: "error"
      });
      return;
    }
    (this.$refs.addSurplusForm as ElForm).validate(async isValid => {
      if (isValid && this.currentStock) {
        try {
          if (this.privateKey && !this.privateKey.isDecrypted()) {
            await this.privateKey.decrypt(this.addSurplusForm.password);
          }
        } catch (e) {
          this.$message({
            message: "私钥密码错误",
            type: "error"
          });
          console.log(e);
          return;
        }
        const ids: string[] = await api.get("tool/ids", {
          params: { count: this.addSurplusForm.quantity }
        });
        try {
          const confirmState = await this.$confirm(
            `确认添加 ${this.addSurplusForm.quantity} 件 ${this.addSurplusForm.goodsName} 库存？`,
            "确认添加库存",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          );
          if (confirmState === "confirm") {
            const signed = [];
            for (const id of ids) {
              const preSign = {
                stockId: this.currentStock.stockId,
                goodsId: id,
                productionDate: Date.now(),
                parameters: this.currentStock.parameters,
                price: this.currentStock.price,
                sign: ""
              };
              const data = (
                await sign({
                  message: cleartext.fromText(JSON.stringify(preSign)), // CleartextMessage or Message object
                  privateKeys: [this.privateKey] // for signing
                })
              ).data;
              const temp = data.split("\n");
              const tempArray: string[] = [];
              for (let i = temp.length - 3; i >= 0; i--) {
                if (temp[i] === "\r") {
                  break;
                }
                tempArray.push(temp[i]);
              }
              preSign["sign"] = tempArray.reverse().join("\n");
              signed.push(preSign);
            }
            const count = await api.put(
              `supplier/stocks/${this.currentStock.stockId}`,
              signed
            );
            if (count) {
              this.$message({
                type: "success",
                message: `成功添加 ${this.addSurplusForm.quantity} 件 ${this.addSurplusForm.goodsName}`
              });
              this.addSurplusDialogVisible = false;
              this.clearAddSurplusForm();
              await this.refreshSupplierStock();
            }
          }
        } catch {
          console.log("取消操作");
        }
      }
    });
  }

  clearAddSurplusForm() {
    (this.$refs.addSurplusForm as ElForm).resetFields();
  }

  formatPrice() {
    let tempPrice = this.addStockForm.price.toString();
    tempPrice = tempPrice.replace(/[^\\.\d]/g, ""); //清除"数字"和"."以外的字符
    tempPrice = tempPrice.replace(/^\./g, ""); //验证第一个字符是数字而不是.
    tempPrice = tempPrice.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的.
    tempPrice = tempPrice
      .replace(".", "$#$")
      .replace(/\./g, "")
      .replace("$#$", "."); //只允许输入一个小数点
    tempPrice = tempPrice.replace(/^(\\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
    this.addStockForm.price = tempPrice;
  }

  clearAddStockForm() {
    (this.$refs.addSurplusForm as ElForm).resetFields();
  }

  async onAddStockConfirm() {
    (this.$refs.addStockForm as ElForm).validate(async isValid => {
      if (isValid) {
        try {
          const confirmState = await this.$confirm(
            `将添加 ${this.addStockForm.goodsName}，价格 ${this.addStockForm.price}，参数：\n
      ${this.addStockForm.parameters}`,
            "确认添加操作",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          );
          if (confirmState === "confirm") {
            const stockId: number | null = await api.post(
              "supplier/stocks",
              this.addStockForm
            );
            if (stockId) {
              this.$message({
                type: "success",
                message: `${this.addStockForm.goodsName} 添加成功`
              });
              this.clearAddStockForm();
              this.addStockDialogVisible = false;
              await this.refreshSupplierStock();
            }
          }
        } catch {
          console.log("取消操作");
        }
      }
    });
  }

  async handleAddSurplus(index: number, row: SupplierStockValue) {
    this.addSurplusForm.goodsName = row.goodsName;
    this.addSurplusForm.stockId = row.stockId;
    this.addSurplusDialogVisible = true;
    this.currentStock = row;
  }

  async refreshSupplierStock() {
    this.supplierStocks = (await api.get(
      "supplier/stocks"
    )) as SupplierStockValue[];
  }

  mounted() {
    this.refreshSupplierStock();
  }
}
</script>

<style lang="scss"></style>
