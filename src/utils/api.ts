import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:10001/", //https://sale-api.dreace.top/
  responseType: "json",
  withCredentials: true
});

api.interceptors.response.use(response => {
  if (response.data.code === 0) {
    return response.data.data;
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
