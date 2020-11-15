<template>
  <div>
    <el-input v-model="input" v-on:input="reverse"></el-input>
    <p>{{ reversed }}</p>
    <el-table></el-table>
  </div>
</template>

<script lang="ts">
import api from "@/utils/api";
import Vue from "vue";
import Component from "vue-class-component";
@Component
export default class Stock extends Vue {
  input = "";
  reversed = "";

  async reverse() {
    this.reversed = await api.post("test/reverse", {
      payload: this.input
    });
  }
}
</script>

<style lang="scss"></style>
