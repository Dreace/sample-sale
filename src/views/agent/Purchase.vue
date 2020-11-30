<template>
  <div>
    <el-select
      v-on:change="refreshStock"
      v-model="supplierId"
      placeholder="选择供货商"
    >
      <el-option
        v-for="item in suppliers"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      >
      </el-option>
    </el-select>
    <el-button style="margin-left: 10px" v-on:click="cartDialogVisible = true"
      >查看购物车</el-button
    >
    <el-button v-on:click="refreshStock">刷新</el-button>
    <el-table :data="supplierStocks">
      <el-table-column prop="stockId" label="商品编号"></el-table-column>
      <el-table-column prop="goodsName" label="商品名称"></el-table-column>
      <el-table-column prop="surplus" label="库存"></el-table-column>
      <el-table-column prop="price" label="当前价格"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="onAddCart(scope.$index, scope.row)"
            >加入购物车
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="确认商品信息"
      :visible.sync="addCartDialogVisible"
      width="500px"
      destroy-on-close
    >
      <el-form ref="addCartForm" :model="addCartForm" label-width="80px">
        <el-form-item label="商品名称">
          <el-input disabled v-model="addCartForm.goodsName"></el-input>
        </el-form-item>
        <el-form-item label="单价">
          <el-input disabled v-model="addCartForm.price"></el-input>
        </el-form-item>
        <el-form-item label="购买数量">
          <el-input-number
            :min="1"
            v-model="addCartForm.quantity"
            v-on:change="
              addCartForm.total = addCartForm.price * addCartForm.quantity
            "
          >
          </el-input-number>
        </el-form-item>
        <el-form-item label="总价">
          <el-input disabled v-model="addCartForm.total"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="
            addCartDialogVisible = false;
            clearAddCartForm();
          "
          >取 消
        </el-button>
        <el-button type="primary" @click="onAddCartConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="cartDialogVisible" id="cart">
      <el-table :data="cartItems" show-summary :summary-method="summary">
        <el-table-column prop="goodsName" label="名称"></el-table-column>
        <el-table-column prop="price" label="单价"></el-table-column>
        <el-table-column prop="quantity" label="数量"></el-table-column>
        <el-table-column prop="total" label="总价"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="cartItems.splice(scope.$index, 1)"
              >移出
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cartDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="onCartConfirm"
          :disabled="cartItems.length === 0"
          >下 单
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
import { SupplierStockValue } from "@/views/supplier/Stock.vue";

interface AddCartFormValue {
  stockId: number;
  goodsName: string;
  price: number;
  total: number;
  quantity: number;
}

interface Supplier {
  id: number;
  name: string;
}

@Component
export default class Purchase extends Vue {
  supplierStocks: SupplierStockValue[] = [];
  currentStock: SupplierStockValue | null = null;
  addCartDialogVisible = false;
  addCartForm: AddCartFormValue = {
    price: 0,
    quantity: 0,
    total: 0,
    stockId: -1,
    goodsName: ""
  };
  supplierId = 1;
  suppliers: Supplier[] = [];
  cartItems: AddCartFormValue[] = [];
  cartDialogVisible = false;

  async refreshStock() {
    if (this.supplierId === -1) {
      return;
    }
    const supplierStocks = (await api.get(
      `agent/suppliers/${this.supplierId}/stocks`
    )) as SupplierStockValue[];
    this.supplierStocks = [];
    supplierStocks.forEach(stock => {
      if (stock.surplus > 0) {
        this.supplierStocks.push(stock);
      }
    });
  }

  onAddCart(index: number, row: SupplierStockValue) {
    this.currentStock = row;
    this.addCartDialogVisible = true;
    this.addCartForm.quantity = 1;
    this.addCartForm.goodsName = this.currentStock.goodsName;
    this.addCartForm.stockId = this.currentStock.stockId;
    this.addCartForm.price = this.currentStock.price;
    this.addCartForm.total = this.currentStock.price;
  }

  clearAddCartForm() {
    (this.$refs.addCartForm as ElForm).resetFields();
  }

  onAddCartConfirm() {
    if (
      this.currentStock &&
      this.addCartForm.quantity > this.currentStock.surplus
    ) {
      this.$message({
        message: `${this.currentStock.goodsName} 库存不足（剩余 ${this.currentStock.surplus} 件）`,
        type: "error"
      });
      return;
    }
    this.cartItems.push(Object.assign({}, this.addCartForm));
    this.clearAddCartForm();
    this.addCartDialogVisible = false;
  }

  async onCartConfirm() {
    await api.post("agent/orders", {
      supplierId: this.supplierId,
      items: this.cartItems
    });
    this.cartItems = [];
    this.cartDialogVisible = false;
  }

  summary(): Array<string | number> {
    const sums: Array<string | number> = ["合计", ""];
    let quantity = 0,
      total = 0;
    for (const item of this.cartItems) {
      quantity += item.quantity;
      total += item.total;
    }
    sums.push(quantity, total);
    return sums;
  }

  mounted() {
    this.getSuppliers();
  }

  async getSuppliers() {
    this.suppliers = await api.get("agent/suppliers");
    this.supplierId = this.suppliers[0].id;
    await this.refreshStock();
  }
}
</script>

<style lang="scss">
#cart {
  .el-dialog__body {
    height: 50vh;
    overflow: auto;
  }
}
</style>
