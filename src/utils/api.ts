import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:10001/",
  responseType: "json",
  withCredentials: true
});

api.interceptors.response.use(response => {
  if (response.data.code === 0) {
    return response.data.data;
  }
});

export default api;
