<template>
  <div>
    <div class="title">
      <h1>日志</h1>
      <div style="margin-top: 15px;">
        <el-row>
          <el-col>
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
                <el-option label="用户ID" value="1"></el-option>
                <el-option label="对象表" value="2"></el-option>
                <el-option label="细节" value="3"></el-option>
              </el-select>
              <el-button
                slot="append"
                icon="el-icon-search"
                v-on:click="searchLog()"
              ></el-button>
            </el-input>
          </el-col>
        </el-row>
      </div>
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
  search = "";
  searchSelect = "1";
  logForm: LogValue = {
    time: "",
    userId: 0,
    operation: "",
    table: "",
    detail: ""
  };
  async searchLog() {
    this.tableData = (await api.post("trace/log", {
      select: this.searchSelect,
      search: this.search
    })) as LogValue[];
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
.el-select .el-input {
  width: 98px;
}
.el-input {
  width: 500px;
}
</style>
