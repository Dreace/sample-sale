<template>
  <div>
    <div class="form">
      <el-form
        :label-position="labelPosition"
        label-width="80px"
        :model="traceInfoForm"
        ><div id="title" class="title">
          <h1>商品追溯</h1>
        </div>
        <el-form-item label="商品ID">
          <el-row :gutter="16">
            <el-col :span="14">
              <el-input v-model="goodsID"></el-input>
            </el-col>
            <el-col :span="2"
              ><el-button type="primary" @click="Check()"
                >查询</el-button
              ></el-col
            >
          </el-row>
        </el-form-item>
        <el-form-item label="存储编号 :">
          <span>{{ traceInfoForm.stockID }}</span>
        </el-form-item>
        <el-form-item label="生产日期 :">
          <span>{{ traceInfoForm.productionDate }}</span>
        </el-form-item>
        <el-form-item label="价格 :">
          <span>{{ traceInfoForm.price }}</span>
        </el-form-item>
        <el-form-item label="售出状态 :">
          <span>{{ traceInfoForm.state }}</span>
        </el-form-item>
        <el-form-item label="校验签名 :">
          <span>{{ signcheck }}</span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import api from "@/utils/api";
import Vue from "vue";
import Component from "vue-class-component";

interface FormValue {
  stockID: number;
  productionDate: string;
  price: number;
  sign: string;
  state: string;
}
@Component
export default class Trace extends Vue {
  formdata: FormValue[] = [];
  labelPosition = "right";
  goodsID = "";
  signcheck = true;
  traceInfoForm: FormValue = {
    stockID: 0,
    productionDate: "",
    price: 0,
    sign: "",
    state: ""
  };

  async Check() {
    const res = (await api.post("trace/trace", {
      goodsID: this.goodsID
    })) as FormValue;
    if (res !== null) {
      this.traceInfoForm.stockID = res.stockID;
      this.traceInfoForm.sign = res.sign;
      this.traceInfoForm.state = res.state;
      this.traceInfoForm.price = res.price;
      this.traceInfoForm.productionDate = res.productionDate;
    }
  }
}
</script>

<style>
.title {
  text-align: center;
}

.form {
  margin-top: 20px;
  margin: 0px auto;
  width: 500px;
  border: black;
}
</style>
