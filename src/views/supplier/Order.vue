<template>
  <div>
    <el-button v-on:click="refreshAgentOrders">刷新</el-button>
    <el-table :data="agentOrders">
      <el-table-column prop="orderId" label="订单编号"></el-table-column>
      <el-table-column prop="agentId" label="代理商标识"></el-table-column>
      <el-table-column prop="createTime" label="创建时间">
        <template slot-scope="scope">
          {{ new Date(scope.row.createTime * 1000).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag
            type="success"
            v-if="scope.row.supplierSign && scope.row.agentSign"
          >
            已完成
          </el-tag>
          <el-tag v-else-if="scope.row.supplierSign">
            已签名
          </el-tag>
          <el-tag type="warning" v-else>
            未签名
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            v-on:click="signOrder(scope.$index, scope.row)"
            >签名
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import api from "@/utils/api";
import Vue from "vue";
import Component from "vue-class-component";
import { ElForm } from "element-ui/types/form";

interface AgentOrderValue {
  orderId: number;
  supplierId: number;
  agentId: number;
  supplierSign?: string;
  agentSign?: string;
  createTime: number;
}

@Component
export default class Order extends Vue {
  agentOrders: AgentOrderValue[] = [];

  async refreshAgentOrders() {
    this.agentOrders = await api.get("supplier/orders");
  }

  async signOrder(index: number, row: AgentOrderValue) {
    console.log(row);
  }

  mounted() {
    this.refreshAgentOrders();
  }
}
</script>

<style scoped></style>
