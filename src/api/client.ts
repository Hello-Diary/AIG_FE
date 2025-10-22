import axios from "axios";

const apiKey = process.env.EXPO_PUBLIC_API_KEY

export const axiosInstance = axios.create({
  baseURL: apiKey,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log("[API Error]", err.response?.data || err.message);
    return Promise.reject(err);
  }
);