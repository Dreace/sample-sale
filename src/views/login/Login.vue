<template>
  <div class="login-container">
    <div class="login-title">代理销售软件</div>
    <el-tabs v-model="activeTabName" class="tabs" :stretch="true">
      <el-tab-pane name="LoginTab" label="登录">
        <el-form
          :model="loginForm"
          :rules="loginRules"
          hide-required-asterisk
          class="el-form"
          ref="loginForm"
        >
          <el-form-item prop="userName">
            <el-input
              v-model="loginForm.userName"
              placeholder="用户名"
              prefix-icon="el-icon-user"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              placeholder="登录密码"
              show-password
              prefix-icon="el-icon-lock"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              class="loginButton"
              type="primary"
              :loading="isloading"
              @click="submitLogin('loginForm')"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane name="RegisterTab" label="注册">
        <el-form
          :model="registerForm"
          :rules="registerRules"
          hide-required-asterisk
          class="el-form"
          ref="registerForm"
        >
          <el-form-item prop="competence">
            <el-select
              class="selectRole"
              v-model="registerForm.competence"
              placeholder="用户身份"
            >
              <el-option label="客户" :value="2"></el-option>
              <el-option label="代理商" :value="1"></el-option>
              <el-option label="供货商" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="userName">
            <el-input
              v-model="registerForm.userName"
              placeholder="用户名"
              prefix-icon="el-icon-user"
            />
          </el-form-item>
          <el-form-item prop="email">
            <el-input
              v-model="registerForm.email"
              placeholder="邮箱"
              prefix-icon="el-icon-message"
            />
          </el-form-item>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item prop="password">
                <el-input
                  v-model="registerForm.password"
                  placeholder="登录密码"
                  show-password
                  prefix-icon="el-icon-lock"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="confirmPassword">
                <el-input
                  v-model="registerForm.confirmPassword"
                  placeholder="确认登录密码"
                  show-password
                  prefix-icon="el-icon-lock"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item prop="keyPassword">
                <el-input
                  v-model="registerForm.keyPassword"
                  placeholder="私钥密码"
                  show-password
                  prefix-icon="el-icon-key"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="confirmKeyPassword">
                <el-input
                  v-model="registerForm.confirmKeyPassword"
                  placeholder="确认私钥密码"
                  show-password
                  prefix-icon="el-icon-key"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-button
            class="registerButton"
            type="primary"
            :loading="isloading"
            @click="submitRegister('registerForm')"
            >注册</el-button
          >
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import api from "@/utils/api";
import Vue from "vue";
import Component from "vue-class-component";
import { ElForm } from "element-ui/types/form";
import FileSaver from "file-saver";
interface LoginFormValue {
  userName: string;
  password: string;
}
interface LoginRulesCheck {
  userName: Array<object>;
  password: Array<object>;
}
interface RegisterFormValue {
  userName: string;
  competence: string;
  password: string;
  confirmPassword: string;
  keyPassword: string;
  confirmKeyPassword: string;
  email: string;
}
interface RegisterRulesCheck {
  userName: Array<object>;
  password: Array<object>;
  competence: Array<object>;
  confirmPassword: Array<object>;
  keyPassword: Array<object>;
  confirmKeyPassword: Array<object>;
  email: Array<object>;
}
interface UserInformation {
  id: number;
  username: string;
  password: string;
  email: string;
  competence: number;
  access_token: string;
}
interface EncryptedPrivateKey {
  encryptedPrivateKey: string;
}
@Component
export default class Login extends Vue {
  isloading = false;
  activeTabName = "LoginTab";
  loginForm: LoginFormValue = { userName: "", password: "" };
  registerForm: RegisterFormValue = {
    userName: "",
    competence: "",
    password: "",
    confirmPassword: "",
    keyPassword: "",
    confirmKeyPassword: "",
    email: ""
  };
  loginRules: LoginRulesCheck = {
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
  validatePassword = (
    rule: RegisterRulesCheck,
    value: string,
    callback: (error: Error | void) => void
  ) => {
    if (value !== this.registerForm.password) {
      callback(new Error());
    } else {
      callback();
    }
  };
  validateKeyPassword = (
    rule: RegisterRulesCheck,
    value: string,
    callback: (error: Error | void) => void
  ) => {
    if (value !== this.registerForm.keyPassword) {
      callback(new Error());
    } else {
      callback();
    }
  };
  validateEmail = (
    rule: RegisterRulesCheck,
    value: string,
    callback: (error: Error | void) => void
  ) => {
    const emailRules = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    if (!emailRules.test(value)) {
      callback(new Error("请输入正确的邮箱格式"));
    } else {
      callback();
    }
  };
  registerRules: RegisterRulesCheck = {
    competence: [
      { required: true, message: "请选择用户身份", trigger: "blur" }
    ],
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
      { required: true, message: "请输入登录密码", trigger: "blur" },
      {
        min: 3,
        max: 20,
        message: "密码长度在 3 到 20 个字符",
        trigger: "blur"
      }
    ],
    confirmPassword: [
      {
        required: true,
        message: "请再次输入登录密码",
        trigger: "blur"
      },
      {
        validator: this.validatePassword,
        min: 3,
        max: 20,
        message: "与登录密码不一致",
        trigger: "blur"
      }
    ],
    keyPassword: [
      { required: true, message: "请输入私钥密码", trigger: "blur" },
      {
        min: 3,
        max: 20,
        message: "密码长度在 3 到 20 个字符",
        trigger: "blur"
      }
    ],
    confirmKeyPassword: [
      {
        required: true,
        message: "请再次输入私钥密码",
        trigger: "blur"
      },
      {
        validator: this.validateKeyPassword,
        min: 3,
        max: 20,
        message: "与私钥密码不一致",
        trigger: "blur"
      }
    ],
    email: [
      { required: true, message: "请输入邮箱", trigger: "blur" },
      {
        validator: this.validateEmail,
        min: 3,
        max: 20,
        message: "请输入正确邮箱格式",
        trigger: "blur"
      }
    ]
  };
  submitLogin(formName: string) {
    const ref: ElForm = this.$refs[formName] as ElForm;
    ref.validate(async (valid: boolean) => {
      if (valid) {
        this.isloading = true;
        const res = (await api.post("/login", {
          username: this.loginForm.userName,
          password: this.loginForm.password
        })) as UserInformation;
        if (res !== null) {
          //若登录成功则跳转页面
          sessionStorage.setItem("competence", res.competence.toString());
          switch (res.competence) {
            case 0: //供货商
              await this.$router.push({ path: "/supplier/stock" });
              console.log(this.$route.path);
              break;
            case 1: //代理商
              await this.$router.push({ path: "/agent/purchase" });
              console.log(this.$route.path);
              break;
            case 2: //客户
              await this.$router.push({ path: "/customer/productinfo" });
              console.log(this.$route.path);
              break;
            case 3: //管理员
              await this.$router.push({ path: "/admin/log" });
              console.log(this.$route.path);
              break;
          }
          localStorage.setItem("access_token", res.access_token);
        }
        this.isloading = false;
      } else {
        console.log("error submit!");
        return false;
      }
    });
  }
  submitRegister(formName: string) {
    const ref: ElForm = this.$refs[formName] as ElForm;
    ref.validate(async (valid: boolean) => {
      if (valid) {
        this.isloading = true;
        const res = (await api.post("user/register", {
          name: this.registerForm.userName,
          password: this.registerForm.password,
          email: this.registerForm.email,
          competence: this.registerForm.competence,
          keyPassword: this.registerForm.keyPassword
        })) as EncryptedPrivateKey;
        if (res !== null) {
          this.activeTabName = "LoginTab"; //跳转回登录页面
          this.loginForm.userName = this.registerForm.userName;
          this.loginForm.password = this.registerForm.password;
          const file = new File([res.encryptedPrivateKey], "PriavetKey.pem", {
            type: "text/plain;charset=utf-8"
          });
          FileSaver.saveAs(file); //将已加密的私钥储存在本地
          this.$message({
            showClose: true,
            message: "私钥已下载到本地",
            type: "success"
          });
        }
        this.isloading = false;
      } else {
        console.log("error submit!");
        return false;
      }
    });
  }
}
</script>

<style scoped>
.tabs {
  width: 90%;
  margin: 0 auto;
}
.selectRole {
  width: 100%;
}
.loginButton {
  width: 100%;
  margin: 0 auto;
}
.registerButton {
  width: 100%;
  margin: 0 auto;
}
.login-title {
  font-size: 1.5em;
  line-height: 3em;
  text-align: center;
}

.el-form {
  width: 100%;
  margin: 0 auto;
}

.login-container {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  background-color: white;
  padding: 10px;
  max-width: 350px;
  margin: 100px auto 0;
}
</style>
