import axios from "axios";
import { Message } from "element-ui";

const api = axios.create({
  // baseURL: "https://sale-api.dreace.top/",
  baseURL: "http://127.0.0.1:10001/",
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

export default api;
