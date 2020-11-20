<template>
  <div class="login-container">
    <div class="login-title">我啪就点进来了,很快啊!</div>
    <el-form
      :model="form"
      :rules="rules"
      hide-required-asterisk="true"
      label-width="70px"
      class="el-form"
      ref="loginForm"
    >
      <el-form-item label="用户名" prop="userName">
        <el-input
          v-model="form.userName"
          placeholder="请输入用户名"
          prefix-icon="el-icon-user-solid"
        />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          placeholder="请输入密码"
          show-password
          prefix-icon="el-icon-s-promotion"
        />
      </el-form-item>
      <el-form-item class="login-button">
        <el-button type="primary" @click="onSubmit('loginForm')"
          >登录</el-button
        >
        <el-button @click="resetForm('loginForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import api from "@/utils/api";
import Vue from "vue";
import Component from "vue-class-component";
import { ElForm } from "element-ui/types/form";

interface FormValue {
  userName: string;
  password: string;
}
interface RulesCheck {
  userName: Array<object>;
  password: Array<object>;
}
@Component
export default class Login extends Vue {
  form: FormValue = { userName: "", password: "" };
  rules: RulesCheck = {
    userName: [
      { required: true, message: "请输入用户名", trigger: "blur" },
      {
        min: 3,
        max: 20,
        message: "用户名长度在 3 到 20 个字符",
        trigger: "blur"
      }
    ],
    password: [
      { required: true, message: "请输入密码", trigger: "blur" },
      {
        min: 3,
        max: 20,
        message: "密码长度在 3 到 20 个字符",
        trigger: "blur"
      }
    ]
  };
  resetForm(formName: string) {
    const ref: ElForm = this.$refs[formName] as ElForm;
    ref.resetFields();
  }
  onSubmit(formName: string) {
    const ref: ElForm = this.$refs[formName] as ElForm;
    ref.validate(async (valid: boolean) => {
      if (valid) {
        const res = await api.post("user/Login", {
          name: this.form.userName,
          password: this.form.password
        });
        if (res !== null) {
          //若登陆成功则跳转页面
          await this.$router.push({ path: "stock" }); //暂定stock页面
          localStorage.setItem("access_token", res.data);
        }
      } else {
        console.log("error submit!");
        return false;
      }
    });
  }
}
</script>

<style scoped>
.login-button {
  width: 80%;
  margin: 0 auto;
}

.login-title {
  font-size: 1.5em;
  line-height: 3em;
  text-align: center;
}

.el-form {
  width: 70%;
  margin: 0 auto;
}

.login-container {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  background-color: white;
  padding: 10px;
  max-width: 450px;
  margin: 150px auto 0;
}
</style>
