<template>
  <div>
    <div id="title" class="title">
      <h1>商品追溯</h1>
    </div>
    <div id="search" class="input">
      <el-input placeholder="请输入商品ID" v-model="input">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div>
      <el-table
        :data="tableData"
        style="width: 100%"
        :row-class-name="tableRowClassName"
      >
        <el-table-column prop="goodsID" label="商品ID"> </el-table-column>
        <el-table-column prop="result" label="校验结果"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "trace",
  input: "",

  methods: {
    tableRowClassName({ row }) {
      if (row.result === "false") {
        return "warning-row";
      } else if (row.result === "true") {
        return "success-row";
      }
      return "";
    }
  },
  data() {
    return {
      tableData: [
        {
          goodsID: "2016-05-02",
          result: "false"
        },
        {
          goodsID: "2016-05-04",
          result: "true"
        },
        {
          goodsID: "2016-05-01",
          result: "true"
        },
        {
          goodsID: "2016-05-03",
          result: "false"
        }
      ]
    };
  }
};
</script>

<style>
.title {
  text-align: center;
}
.input {
  margin-top: 15px;
  width: auto;
  padding: 10px;
}
.el-table .warning-row {
  background: #ff8888;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
