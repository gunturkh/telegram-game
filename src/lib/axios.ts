import axios, { InternalAxiosRequestConfig } from "axios";
import { API_URL } from "../utils/constants";
import { useAuthStore } from "../store/auth";

const http = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(
  async (request: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    // console.log("token inside axios", token);
    if (token) {
      request.headers["Authorization"] = `Bearer ${token}`;
    }
    return request;
  },
  (error) => Promise.reject(error)
);

export default http;
