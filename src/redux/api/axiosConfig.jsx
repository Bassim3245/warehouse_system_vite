import axios from "axios";
import { logoutUser, refreshAccessToken } from "../userSlice/authActions";
import { getRefreshToken, getToken, removeToken } from "../../utils/handelCookie";
import { config } from "../../config/config";

export const axiosInstance = axios.create({
  baseURL: config?.apiUrl,
  timeout: 10000,
});

// Lazy store reference to break circular dependency:
// axiosConfig → store → apiSlice → axiosBaseQuery → axiosConfig
let _store;
export const injectStore = (store) => {
  _store = store;
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.authorization = ` ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is a 401 and the request has not already been retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          console.log("No refresh token available", refreshToken);
          removeToken();
          localStorage.clear();
          return Promise.reject(new Error("No refresh token available"));
        }
        // Dispatch refresh token action via lazy store reference
        const result = await _store.dispatch(refreshAccessToken()).unwrap();

        if (result?.accessToken) {
          originalRequest.headers.authorization = `Bearer ${result.accessToken}`;
          return axiosInstance(originalRequest);
        } else {
          throw new Error("Failed to refresh token");
        }
      } catch (err) {
        console.log("err", err);
        removeToken();
        localStorage.clear();
        if (_store) await _store.dispatch(logoutUser());
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
