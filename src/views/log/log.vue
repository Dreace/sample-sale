<template>
  <div>
    <div class="title">
      <h1>
        日志
      </h1>
    </div>
    <div class="table">
      <el-table
        :data="
          tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)
        "
        border
        style="width: 100%"
      >
        <el-table-column prop="time" label="时间"> </el-table-column>
        <el-table-column prop="userId" label="用户ID"> </el-table-column>
        <el-table-column prop="operation" label="操作"> </el-table-column>
        <el-table-column prop="table" label="对象表"> </el-table-column>
        <el-table-column prop="detail" label="细节"> </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-sizes="[20, 50, 100, 200]"
          :page-size="pagesize"
          layout="total, sizes,prev, pager, next"
          :total="tableData.length"
          prev-text="上一页"
          next-text="下一页"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import api from "@/utils/api";
import Vue from "vue";
import Component from "vue-class-component";

interface LogValue {
  time: string;
  userId: number;
  operation: string;
  table: string;
  detail: string;
}
@Component
export default class Log extends Vue {
  tableData: LogValue[] = [];
  currentPage = 1;
  pagesize = 20;
  logForm: LogValue = {
    time: "",
    userId: 0,
    operation: "",
    table: "",
    detail: ""
  };
  mounted() {
    this.getlog();
  }
  async getlog() {
    this.tableData = (await api.get("trace/log")) as LogValue[];
  }
  async handleSizeChange(size: number) {
    this.pagesize = size;
  }
  async handleCurrentChange(currentPage: number) {
    this.currentPage = currentPage;
  }
}
</script>

<style>
.title {
  text-align: center;
}
</style>
