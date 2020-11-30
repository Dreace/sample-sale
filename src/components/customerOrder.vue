<template>
  <div class="form">
    <h2 class="title">电子订单收据</h2>
    <el-form>
      <el-row :gutter="24">
        <el-col :span="4"><div class="lineData">客户</div></el-col>
        <el-col :span="8"
          ><div class="lineData">{{ Order.customer }}</div></el-col
        >
        <el-col :span="4"><div class="lineData">结算方式</div></el-col>
        <el-col :span="8"
          ><div class="lineData">{{ Order.way }}</div></el-col
        >
      </el-row>
      <el-row :gutter="24">
        <el-col :span="4"><div class="lineData">收款组织</div></el-col>
        <el-col :span="8"
          ><div class="lineData">{{ Order.organize }}</div></el-col
        >
        <el-col :span="4"><div class="lineData">订单时间</div></el-col>
        <el-col :span="8"
          ><div class="lineData">{{ Order.date }}</div></el-col
        >
      </el-row>
      <el-row :gutter="24">
        <el-col :span="6"
          ><div class="lineData">{{ 订单编号 }}</div></el-col
        >
        <el-col :span="18"
          ><div class="lineData">{{ Order.ID }}</div></el-col
        >
      </el-row>
      <el-table :data="tableData" style="width:100%">
        <el-table-column type="index"> </el-table-column>
        <el-table-column
          property="ID"
          label="商品编号"
          width="180"
        ></el-table-column>
        <el-table-column
          property="Name"
          label="商品名称"
          width="180"
        ></el-table-column>
        <el-table-column
          property="UnitPrice"
          label="单价"
          width="100"
        ></el-table-column>
        <el-table-column
          property="Amount"
          label="数量"
          width="100"
        ></el-table-column>
        <el-table-column
          property="TotalPrice"
          label="金额"
          width="100"
        ></el-table-column>
      </el-table>
      <el-row :gutter="24">
        <el-col :span="6"><div class="lineData">合计</div></el-col>
        <el-col :span="18"
          ><div class="lineData">{{ Order.Sum }}</div></el-col
        >
      </el-row>
      <el-row :gutter="24">
        <el-col :span="6"><div class="lineData">交费说明</div></el-col>
        <el-col :span="18"
          ><div class="lineData">{{ Order.State }}</div></el-col
        >
      </el-row>
      <el-row :gutter="24">
        <el-col :span="6"><div class="lineData">校验密钥</div></el-col>
        <el-col :span="18"
          ><div class="lineData">{{ Order.scertkey }}</div></el-col
        >
      </el-row>
      <el-row :gutter="24">
        <el-col :span="4"><div class="lineData">经办人</div></el-col>
        <el-col :span="8"
          ><div class="lineData">{{ Order.operator }}</div></el-col
        >
        <el-col :span="4"><div class="lineData">公司签名</div></el-col>
        <el-col :span="8"
          ><div class="lineData">{{ Order.signature }}</div></el-col
        >
      </el-row>
    </el-form>
  </div>
</template>
<style>
.title {
  text-align: center;
}
.el-col {
  border-style: solid;
  border-width: 1px;
}
.lineData {
  text-align: center;
  height: 28px;
  font-size: 16px;
  line-height: 28px;
}
</style>
<script>
export default {
  data() {
    return {
      Order: {
        customer: "sad",
        way: "pos",
        organize: "撒打算",
        date: "1020-09-20",
        ID: "000123",
        Sum: "324342",
        State: "独守空房九点六十分九点十六分角度上考虑",
        scertkey: "KLDSJFLDKSJFLDSJFKDLSJFIOEFJSLMJVIOS",
        operator: "啊倒萨",
        signature: "dklsjfldsf"
      },
      tableData: [
        {
          ID: "021333",
          Name: "阿发发撒",
          Amount: "100",
          UnitPrice: "50",
          TotalPrice: "5000"
        },
        {
          ID: "03243242",
          Name: "啊发撒法发",
          Amount: "100",
          UnitPrice: "50",
          TotalPrice: "5000"
        },
        {
          ID: "03243244",
          Name: "撒大苏打",
          Amount: "100",
          UnitPrice: "50",
          TotalPrice: "5000"
        }
      ]
    };
  },
  methods: {}
};
</script>
