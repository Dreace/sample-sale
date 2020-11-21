<template>
  <div>
    <el-button v-on:click="refreshSupplierStock">刷新</el-button>
    <!--    <el-input v-model="input" v-on:input="reverse"></el-input>-->
    <!--    <p>{{ reversed }}</p>-->
    <el-table :data="supplierStocks">
      <el-table-column prop="stockId" label="商品编号"></el-table-column>
      <el-table-column prop="goodsName" label="商品名称"></el-table-column>
      <el-table-column prop="surplus" label="库存"></el-table-column>
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
            @click="handleAddStock(scope.$index, scope.row)"
            >增加库存
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="商品信息"
      :visible.sync="addStockDialogVisible"
      width="400px"
      destroy-on-close
    >
      <el-form ref="addStockForm" :model="addStockForm" label-width="80px">
        <el-form-item label="商品名称">
          <el-input v-model="addStockForm.goodsName" disabled></el-input>
        </el-form-item>
        <el-form-item label="增加数量">
          <el-input-number
            :min="1"
            v-model="addStockForm.quantity"
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
            v-model="addStockForm.password"
            clearable
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
  </div>
</template>

<script lang="ts">
import api from "@/utils/api";
import Vue from "vue";
import { sign, message, cleartext, key, convertStream } from "openpgp";
import Component from "vue-class-component";
import Key = key.Key;
import { ElForm } from "element-ui/types/form";

interface SupplierStockValue {
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

@Component
export default class Stock extends Vue {
  input = "";
  reversed = "";
  supplierStocks: SupplierStockValue[] = [];
  addStockDialogVisible = false;
  addStockForm: AddStockFormValue = {
    stockId: -1,
    goodsName: "",
    quantity: 1,
    privateKey: "",
    password: ""
  };
  privateKey: Key | null = null;
  currentStock: SupplierStockValue | null = null;

  cellFormatter(row: SupplierStockValue): string {
    return new Date(row.modifyTime * 1000).toLocaleString();
  }

  readPrivateKey(event: Event) {
    const fileReader = new FileReader();
    fileReader.onload = async () => {
      // const {
      //   keys: [privateKey]
      // } = await
      this.privateKey = (await key.readArmored(fileReader.result)).keys[0];
      console.log(this.privateKey);
    };
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      fileReader.readAsText(files[0]);
    }
  }

  async onAddStockConfirm() {
    if (!this.privateKey) {
      this.$message({
        message: "未选择私钥文件",
        type: "error"
      });
      return;
    }
    (this.$refs.addStockForm as ElForm).validate(async isValid => {
      if (isValid && this.currentStock) {
        try {
          if (this.privateKey && !this.privateKey.isDecrypted()) {
            await this.privateKey.decrypt(this.addStockForm.password);
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
          params: { count: this.addStockForm.quantity }
        });
        const signed = [];
        for (const id of ids) {
          const preSign = {
            stockId: this.currentStock.stockId,
            goodsId: id,
            productionDate: Date.now(),
            parameters: this.currentStock.parameters,
            price: this.currentStock.price
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
        console.log(signed);
        await api.put(`supplier/stocks/${this.currentStock.stockId}`, signed);
      }
    });
  }

  clearAddStockForm() {
    (this.$refs.addStockForm as ElForm).resetFields();
  }

  async handleAddStock(index: number, row: SupplierStockValue) {
    this.addStockForm.goodsName = row.goodsName;
    this.addStockForm.stockId = row.stockId;
    this.addStockDialogVisible = true;
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
