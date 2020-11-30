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
          <el-row :gutter="22">
            <el-col :span="12">
              <el-input v-model="goodsId"></el-input>
            </el-col>
            <el-col :span="4"
              ><el-button type="primary" @click="Check()"
                >查询</el-button
              ></el-col
            >
          </el-row>
        </el-form-item>
        <el-form-item label="存储编号 :">
          <span>{{ traceInfoForm.stockId }}</span>
        </el-form-item>
        <el-form-item label="生产厂商 :">
          <span>{{ traceInfoForm.supplierId }}</span>
        </el-form-item>
        <el-form-item label="商品名字 :">
          <span>{{ traceInfoForm.goodsName }}</span>
        </el-form-item>
        <el-form-item label="商品参数 :">
          <span>{{ traceInfoForm.parameters }}</span>
        </el-form-item>
        <el-form-item label="生产日期 :">
          <span>{{ traceInfoForm.productionDate }}</span>
        </el-form-item>
        <el-form-item label="价格 :">
          <span>{{ traceInfoForm.price }}</span>
        </el-form-item>
        <el-form-item label="校验签名 :">
          <span>{{ traceInfoForm.check }}</span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import api from "@/utils/api";
import Vue from "vue";
import Component from "vue-class-component";
import { verify, cleartext, signature, key, sign } from "openpgp";
import { GoodsValue } from "@/views/supplier/Stock.vue";

interface FormValue {
  stockId: number;
  productionDate: number;
  price: number;
  sign: string;
  supplierId: string;
  goodsName: string;
  parameters: string;
  check?: boolean;
}
@Component
export default class Trace extends Vue {
  formdata: FormValue[] = [];
  labelPosition = "right";
  goodsId = "";
  privateKey: key.Key | null = null;
  traceInfoForm: FormValue = {
    stockId: 0,
    productionDate: 0,
    price: 0,
    sign: "",
    goodsName: "",
    supplierId: "",
    parameters: "",
    check: true
  };
  async Check() {
    const res = (await api.post("trace/trace", {
      goodsID: this.goodsId
    })) as FormValue;
    if (res !== null) {
      this.traceInfoForm.stockId = res.stockId;
      this.traceInfoForm.sign = res.sign;
      this.traceInfoForm.supplierId = res.supplierId;
      this.traceInfoForm.parameters = res.parameters;
      this.traceInfoForm.goodsName = res.goodsName;
      this.traceInfoForm.price = res.price;
      this.traceInfoForm.productionDate = res.productionDate;

      const goods: GoodsValue = {
        stockId: this.traceInfoForm.stockId,
        goodsId: this.goodsId,
        sign: this.traceInfoForm.sign,
        price: this.traceInfoForm.price,
        productionDate: this.traceInfoForm.productionDate,
        parameters: this.traceInfoForm.parameters
      };
      await this.checkSign(goods);
      this.traceInfoForm.check = goods.signValid;
    }
  }
  async checkSign(row: GoodsValue) {
    const goods: GoodsValue = {
      stockId: row.stockId,
      goodsId: row.goodsId,
      productionDate: row.productionDate,
      parameters: row.parameters,
      price: row.price,
      sign: "",
      signValid: this.traceInfoForm.check
    };
    console.log(goods);
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
}
</style>
