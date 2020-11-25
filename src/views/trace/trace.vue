<template>
  <div>
    <div class="form">
      <el-form
        :label-position="labelPosition"
        label-width="80px"
        :model="formLabelAlign"
        ><div id="title" class="title">
          <h1>商品追溯</h1>
        </div>
        <el-form-item label="商品ID">
          <el-row :gutter="16">
            <el-col :span="14">
              <el-input v-model="formLabelAlign.name"></el-input>
            </el-col>
            <el-col :span="2"
              ><el-button type="primary" @click="onSubmit"
                >查询</el-button
              ></el-col
            >
          </el-row>
        </el-form-item>
        <el-form-item label="相信信息 :">
          <span>fuck</span>
        </el-form-item>
        <el-form-item label="生成签名 :">
          <span>fuck</span>
        </el-form-item>
        <el-form-item label="交易结果 :">
          <span>fuck</span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "trace",

  methods: {
    onSubmit() {
      console.log("submit!");
    }
  },

  data() {
    return {
      labelPosition: "left",
      formLabelAlign: {
        name: "",
        region: "",
        type: ""
      }
    };
  }
};
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
