<template>
  <div>
    <h1>商品信息</h1>
    <div style="margin-top: 15px;">
      <el-row :gutter="20">
        <el-col :span="2.5">
          <el-button
            v-on:click="dialogFindCartVisible = true"
            style="width: 120px;text-align: center"
            >查看购物车</el-button
          >
        </el-col>
        <el-col :span="2.5">
          <el-button
            v-on:click="refreshProduct"
            style="width: 100px;text-align: center"
            >刷 新</el-button
          >
        </el-col>
        <el-col :span="18">
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
      >
        <el-table-column label="商品 ID" prop="stockId"></el-table-column>
        <el-table-column label="商品名称" prop="goodsName"></el-table-column>
        <el-table-column label="库存" prop="surplus"></el-table-column>
        <el-table-column label="商品价格" prop="price"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="AddCart(scope.$index, scope.row)"
              >加入购物车</el-button
            >
            <el-button @click="FindInfo(scope.$index, scope.row)"
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
            :model="stockInfoform"
            label-position="left"
            inline
            class="demo-table-expand"
          >
            <el-form-item label="商品编号：">
              <span>{{ stockInfoform.stockID }}</span>
            </el-form-item>
            <el-form-item label="商品名称：">
              <span>{{ stockInfoform.goodsName }}</span>
            </el-form-item>

            <el-form-item label="库存：">
              <span>{{ stockInfoform.surplus }}</span>
            </el-form-item>
            <el-form-item label="供货商：">
              <span>{{ stockInfoform.supplierId }}</span>
            </el-form-item>
            <el-form-item label="价格：">
              <span>{{ stockInfoform.price }}</span>
            </el-form-item>
            <el-form-item label="生产日期：">
              <span>{{ stockInfoform.modifytime }}</span>
            </el-form-item>
            <el-row>
              <el-form-item label="描述：">
                <span>{{ stockInfoform.parameters }}</span>
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
        title="购物车"
        :visible.sync="dialogFindCartVisible"
        :close-on-click-modal="true"
      >
        <span>
          <el-table :data="cartItems" show-summary :summary-method="summary">
            <el-table-column prop="goodsName" label="名称"> </el-table-column>
            <el-table-column prop="price" label="单价"></el-table-column>
            <el-table-column prop="quantity" label="数量"></el-table-column>
            <el-table-column prop="total" label="总价"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="cartItems.splice(scope.$index, 1)"
                  >移出</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogFindCartVisible = false">取 消</el-button>
          <el-button @click="Buy" :disabled="cartItems.length === 0"
            >下 单</el-button
          >
        </span>
      </el-dialog>
    </div>

    <div class="AddToCart">
      <el-dialog
        title="确认商品信息"
        :visible.sync="dialogAddVisible"
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
              dialogAddVisible = false;
              clearAddCartForm;
            "
            >取 消
          </el-button>
          <el-button type="primary" @click="AddCartConfirm">确 定</el-button>
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

<script lang="ts">
import api from "@/utils/api";
import Vue from "vue";
import Component from "vue-class-component";
import { ElForm } from "element-ui/types/form";

interface TableVale {
  stockId: number;
  goodsName: string;
  surplus: number;
  price: number;
}
interface AddCartValue {
  stockId: number;
  goodsName: string;
  price: number;
  total: number;
  quantity: number;
}
interface StockInfoValue {
  stockID: number;
  goodsName: string;
  modifytime: number;
  parameters: string;
  surplus: number;
  price: number;
  supplierId: number;
}

@Component
export default class Product extends Vue {
  tableData: TableVale[] = [];
  currentStock: TableVale | null = null;
  cartItems: AddCartValue[] = [];
  pagesizes = 10;
  currentPage1 = 1;
  pagetotal = 1;
  search = "";
  searchSelect = "";
  dialogFindStockVisible = false;
  dialogFindCartVisible = false;
  dialogAddVisible = false;
  addCartForm: AddCartValue = {
    price: 0,
    quantity: 0,
    total: 0,
    stockId: 0,
    goodsName: ""
  };
  stockInfoform: StockInfoValue = {
    stockID: 0,
    goodsName: "",
    modifytime: 0,
    parameters: "",
    surplus: 0,
    price: 0,
    supplierId: 0
  };

  async FindInfo(index: number, row: TableVale) {
    this.dialogFindStockVisible = true;
    const res = (await api.post("customer/stockInfo", row)) as StockInfoValue;
    if (res !== null) {
      this.stockInfoform.stockID = res.stockID;
      this.stockInfoform.goodsName = res.goodsName;
      this.stockInfoform.modifytime = res.modifytime;
      this.stockInfoform.parameters = res.parameters;
      this.stockInfoform.price = res.price;
      this.stockInfoform.supplierId = res.supplierId;
      this.stockInfoform.surplus = res.surplus;
    }
  }
  async Buy() {
    await api.post("customer/customerOrder", this.cartItems);
    this.dialogFindCartVisible = false;
  }
  AddCart(index: number, row: TableVale) {
    this.dialogAddVisible = true;
    this.currentStock = row;
    this.addCartForm.quantity = 1;
    this.addCartForm.goodsName = this.currentStock.goodsName;
    this.addCartForm.stockId = this.currentStock.stockId;
    this.addCartForm.price = this.currentStock.price;
    this.addCartForm.total = this.currentStock.price;
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
  clearAddCartForm() {
    (this.$refs.addCartForm as ElForm).resetFields();
  }
  AddCartConfirm() {
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
    this.dialogAddVisible = false;
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
    this.tableData = (await api.post("customer/search", {
      select: this.searchSelect,
      search: this.search
    })) as TableVale[];
  }
  async refreshProduct() {
    this.tableData = (await api.get("customer/stocks")) as TableVale[];
    this.pagetotal = this.tableData.length;
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
