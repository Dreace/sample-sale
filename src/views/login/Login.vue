<template>
  <div class="login-container">
    <div class="login-title">我啪就点进来了,很快啊!</div>
    <el-tabs class="tabs" stretch="true">
      <el-tab-pane label="登陆">
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
              placeholder="登陆密码"
              show-password
              prefix-icon="el-icon-lock"
            />
          </el-form-item>
          <el-button
            class="loginButton"
            type="primary"
            @click="submitLogin('loginForm')"
            >登录</el-button
          >
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="注册">
        <el-form
          :model="registeredForm"
          :rules="registeredRules"
          hide-required-asterisk
          class="el-form"
          ref="registeredForm"
        >
          <el-form-item prop="competence">
            <el-select
              class="selectRole"
              v-model="registeredForm.competence"
              placeholder="用户身份"
            >
              <el-option label="客户" value="0"></el-option>
              <el-option label="代理商" value="1"></el-option>
              <el-option label="供货商" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="userName">
            <el-input
              v-model="registeredForm.userName"
              placeholder="用户名"
              prefix-icon="el-icon-user"
            />
          </el-form-item>
          <el-form-item prop="email">
            <el-input
              v-model="registeredForm.email"
              placeholder="邮箱"
              prefix-icon="el-icon-message"
            />
          </el-form-item>
          <el-row :gutter="10">
            <el-col span="12">
              <el-form-item prop="password">
                <el-input
                  v-model="registeredForm.password"
                  placeholder="登陆密码"
                  show-password
                  prefix-icon="el-icon-lock"
                />
              </el-form-item>
            </el-col>
            <el-col span="12">
              <el-form-item prop="confirmPassword">
                <el-input
                  v-model="registeredForm.confirmPassword"
                  placeholder="确认登陆密码"
                  show-password
                  prefix-icon="el-icon-lock"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col span="12">
              <el-form-item prop="keyPassword">
                <el-input
                  v-model="registeredForm.keyPassword"
                  placeholder="私钥密码"
                  show-password
                  prefix-icon="el-icon-key"
                />
              </el-form-item>
            </el-col>
            <el-col span="12">
              <el-form-item prop="confirmKeyPassword">
                <el-input
                  v-model="registeredForm.confirmKeyPassword"
                  placeholder="确认私钥密码"
                  show-password
                  prefix-icon="el-icon-key"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-button
            class="registeredButton"
            type="primary"
            @click="submitRegistered('registeredForm')"
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

interface LoginFormValue {
  userName: string;
  password: string;
}
interface LoginRulesCheck {
  userName: Array<object>;
  password: Array<object>;
}
interface RegisteredFormValue {
  userName: string;
  competence: string;
  password: string;
  confirmPassword: string;
  keyPassword: string;
  confirmKeyPassword: string;
  email: string;
}
interface RegisteredRulesCheck {
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
  competence: string;
  access_token: string;
}
@Component
export default class Login extends Vue {
  loginForm: LoginFormValue = { userName: "", password: "" };
  registeredForm: RegisteredFormValue = {
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
    rule: RegisteredRulesCheck,
    value: string,
    callback: any
  ) => {
    if (value !== this.registeredForm.password) {
      callback(new Error());
    } else {
      callback();
    }
  };
  validateKeyPassword = (
    rule: RegisteredRulesCheck,
    value: string,
    callback: any
  ) => {
    if (value !== this.registeredForm.keyPassword) {
      callback(new Error());
    } else {
      callback();
    }
  };
  registeredRules: RegisteredRulesCheck = {
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
      { required: true, message: "请输入登陆密码", trigger: "blur" },
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
        message: "请再次输入登陆密码",
        trigger: "blur"
      },
      {
        validator: this.validatePassword,
        min: 3,
        max: 20,
        message: "与登陆密码不一致",
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
        min: 3,
        max: 20,
        message: "密码长度在 3 到 20 个字符",
        trigger: "blur"
      }
    ]
  };
  submitLogin(formName: string) {
    const ref: ElForm = this.$refs[formName] as ElForm;
    ref.validate(async (valid: boolean) => {
      if (valid) {
        const res = (await api.post("/login", {
          username: this.loginForm.userName,
          password: this.loginForm.password
        })) as UserInformation;
        if (res !== null) {
          //若登陆成功则跳转页面
          switch (res.competence) {
            case "0": //供货商
              await this.$router.push({ path: "stock" }); //stock页面
              break;
            case "1": //代理商
              //await this.$router.push({ path: "stock" }); //stock页面
              break;
            case "2": //客户
              //await this.$router.push({ path: "stock" }); //stock页面
              break;
          }
          localStorage.setItem("access_token", res.access_token);
        }
      } else {
        console.log("error submit!");
        return false;
      }
    });
  }
  submitRegistered(formName: string) {
    const ref: ElForm = this.$refs[formName] as ElForm;
    ref.validate(async (valid: boolean) => {
      if (valid) {
        const res = await api.post("user/registered", {
          username: this.registeredForm.userName,
          password: this.registeredForm.password
        });
        console.log("submit!");
        // if (res !== null) {
        // }
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
.registeredButton {
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
