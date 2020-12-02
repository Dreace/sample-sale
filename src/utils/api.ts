import axios from "axios";
import { Message } from "element-ui";

const codeMessage: any = {
  "200": "服务器成功返回请求的数据。",
  "201": "新建或修改数据成功。",
  "202": "一个请求已经进入后台排队（异步任务）。",
  "204": "删除数据成功。",
  "400": "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  "401": "用户没有权限（令牌、用户名、密码错误）。",
  "403": "用户得到授权，但是访问是被禁止的。",
  "404": "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  "406": "请求的格式不可得。",
  "410": "请求的资源被永久删除，且不会再得到的。",
  "422": "当创建一个对象时，发生一个验证错误。",
  "500": "服务器发生错误，请检查服务器。",
  "502": "网关错误。",
  "503": "服务不可用，服务器暂时过载或维护。",
  "504": "网关超时。"
};

const api = axios.create({
  // baseURL: "https://sale-api.dreace.top/",
  baseURL: "http://127.0.0.1:10001/",
  responseType: "json",
  withCredentials: true
});

api.interceptors.response.use(
  response => {
    if (response.data.code === 0) {
      console.log(response.data.data);
      return response.data.data;
    } else {
      Message.error(response.data.message);
      return null;
    }
  },
  error => {
    if (!error || !error.response) {
      Message.error("未知错误");
    } else {
      Message.error(codeMessage[error.response.status] || "未知错误");
    }

    return null;
  }
);
//axios请求拦截器
api.interceptors.request.use(
  config => {
    //在发送请求前添加token(第一次登陆请求传送空字符)
    config.headers = {
      Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
      ...config.headers
    };
    return config;
  },
  error => {
    window.console.log(error);
    return Promise.reject(error);
  }
);

export default api;
