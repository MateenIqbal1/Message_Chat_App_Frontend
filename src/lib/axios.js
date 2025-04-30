import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: 'https://message-chat-app-backend.vercel.app/',
});

axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
