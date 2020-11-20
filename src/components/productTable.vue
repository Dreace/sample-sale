<template>
  <div>
    <!-- 表格 -->
    <div id="table">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <!-- 下拉菜单信息 -->
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="商品 ID">
                <span>{{ props.row.productID }}</span>
              </el-form-item>
              <el-form-item label="商品名称">
                <span>{{ props.row.productName }}</span>
              </el-form-item>
              <el-form-item label="商品分类">
                <span>{{ props.row.category }}</span>
              </el-form-item>
              <el-form-item label="所属店铺">
                <span>{{ props.row.shop }}</span>
              </el-form-item>
              <el-form-item label="代理商">
                <span>{{ props.row.agentName }}</span>
              </el-form-item>
              <el-form-item label="商品价格">
                <span>{{ props.row.productPrice }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="商品 ID" prop="productID"> </el-table-column>
        <el-table-column label="商品名称" prop="productName"> </el-table-column>
        <el-table-column label="商品价格" prop="productPrice">
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button size="mini" @click="toParent1">{{ msg1 }}</el-button>
            <el-button size="mini" type="danger" @click="toParent2">{{
              msg2
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
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
</style>

<script>
export default {
  props: ["msg1", "msg2", "tableData"],
  methods: {
    toParent1() {
      this.$emit("parentfun1");
    },
    toParent2() {
      this.$emit("parentfun2");
    }
  }
};
</script>
