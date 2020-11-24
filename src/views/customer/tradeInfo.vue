<template>
  <div>
    <h1>订单管理</h1>
    <!-- 表格 -->
    <div id="trade">
      <el-table
        :data="
          tableData.filter(
            data =>
              !search || data.name.toLowerCase().includes(search.toLowerCase())
          )
        "
        style="width: 100%"
      >
        <el-table-column label="订单编号" prop="tradeID"></el-table-column>
        <el-table-column label="收款方" prop="shopName"> </el-table-column>
        <el-table-column label="收款金额" prop="tradePrice"> </el-table-column>
        <el-table-column label="订单时间" prop="tradeDate"> </el-table-column>
        <el-table-column align="right">
          <!-- eslint-disable-next-line -->
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="search"
              size="medium"
              placeholder="输入关键字搜索"
              icon="el-icon-search"
            ></el-input>
          </template>
          <!-- eslint-disable-next-line -->
          <template slot-scope="scope">
            <el-button size="mini" @click="Download">下 载</el-button>
            <el-button size="mini" @click="dialogVisible = true"
              >查 看</el-button
            >
            <el-button size="mini" type="danger" @click="Delete()"
              >删 除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <template>
        <el-dialog
          class="order_dialog"
          :visible.sync="dialogVisible"
          :show-close="true"
        >
          <span>
            <customerOrder></customerOrder>
          </span>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false"
              >确 定</el-button
            >
          </span>
        </el-dialog>
      </template>
    </div>
  </div>
</template>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.order_dialog {
  width: 100%;
  height: 100%;
}
</style>

<script>
import { Component, Vue } from "vue-property-decorator";
import customerOrder from "@/components/customerOrder.vue"; // @ is an alias to /src

export default {
  components: {
    customerOrder
  },
  methods: {
    Download() {
      alert("下载中");
    },
    Delete() {
      alert("删除失败");
    },
    SearchWord() {
      alert(this.inoput2);
    }
  },
  data() {
    return {
      dialogVisible: false,
      search: "",
      // eslint-disable-next-line vue/no-dupe-keys
      tableData: [
        {
          tradeID: "12987122",
          shopName: "撒旦",
          tradeDate: "2016-03-13",
          tradePrice: "200w"
        },
        {
          tradeID: "12987122",
          shopName: "萨达",
          tradeDate: "2017-04-01",
          tradePrice: "100w"
        },
        {
          tradeID: "12987122",
          shopName: "微信",
          tradeDate: "2018-10-20",
          tradePrice: "300w"
        }
      ]
    };
  }
};
</script>
