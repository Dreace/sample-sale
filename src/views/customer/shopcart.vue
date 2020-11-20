<template>
  <div>
    <div id="Search">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-autocomplete
            class="inline-input"
            v-model="searchinput"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            :popper-append-to-body="false"
            :trigger-on-focus="false"
            @select="handleSelect"
          ></el-autocomplete>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-search" @click="SearchWord()"
            >搜 索</el-button
          >
        </el-col>
      </el-row>
    </div>
    <div id="Table">
      <productTable
        :tableData="tableData"
        :msg1="msg1"
        :msg2="msg2"
        @parentfun1="Buy"
        @parentfun2="Delete"
      ></productTable>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import productTable from "@/components/productTable.vue"; // @ is an alias to /src

export default {
  data() {
    return {
      searchinput: "",
      msg1: "购买",
      msg2: "删除",
      tableData: [
        {
          productID: "10000",
          productName: "筑基丹1",
          category: "江浙小吃、小吃零食",
          shop: "王小虎店4",
          agentName: "淘宝1",
          productPrice: "100w"
        },
        {
          productID: "11111",
          productName: "筑基丹2",
          category: "江浙小吃、小吃零食",
          shop: "王小虎店3",
          agentName: "淘宝2",
          productPrice: "200w"
        },
        {
          productID: "22222",
          productName: "筑基丹3",
          category: "江浙小吃、小吃零食",
          shop: "王小虎店2",
          agentName: "淘宝3",
          productPrice: "300w"
        },
        {
          productID: "33333",
          productName: "筑基丹4",
          category: "江浙小吃、小吃零食",
          shop: "王小虎店1",
          agentName: "淘宝4",
          productPrice: "400w"
        }
      ]
    };
  },
  methods: {
    Buy() {
      alert("fuck3");
    },
    Delete() {
      alert("fuck4");
    },
    SearchWord() {
      alert(this.searchinput);
    },
    querySearchAsync(queryString, callback) {
      let list = [{}];
      //调用的后台接口
      // val url = 后台接口地址 + queryString;
      // eslint-disable-next-line prefer-const
      let url = "D:/GitHub/mysale/text.json" + queryString;
      //从后台获取到对象数组
      this.$axios
        .get(url)
        .then(response => {
          //在这里为这个数组中每一个对象加一个value字段, 因为autocomplete只识别value字段并在下拉列中显示
          for (const i of response.data) {
            i.value = i.想要展示的数据; //将想要展示的数据作为value
          }
          list = response.data;
          callback(list);
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleSelete(item) {
      console.log(item);
    }
  },
  components: {
    productTable
  }
};
</script>

<style scoped></style>
