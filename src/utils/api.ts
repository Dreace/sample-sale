import axios from "axios";
import { Message } from "element-ui";

const api = axios.create({
  baseURL: "https://sale-api.dreace.top/",
  // baseURL: "http://127.0.0.1:10001/",
  responseType: "json",
  withCredentials: true
});

api.interceptors.response.use(response => {
  if (response.data.code === 0) {
    console.log(response.data.data);
    return response.data.data;
  } else {
    Message.error(response.data.message);
    return null;
  }
});
//axios请求拦截器
api.interceptors.request.use(
  config => {
    //在发送请求前添加token(第一次登陆请求传送空字符)
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`
    };
    return config;
  },
  error => {
    window.console.log(error);
    return Promise.reject(error);
  }
);

export default api;
