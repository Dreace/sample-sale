import axios from "axios";

const api = axios.create({
  baseURL: "https://sale-api.dreace.top/",
  responseType: "json",
  withCredentials: true
});

api.interceptors.response.use(response => {
  if (response.data.code === 0) {
    return response.data.data;
  }
});

export default api;
