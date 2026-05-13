// src/core/network/apiClient.js
import axios from "axios";

export const apiClient = axios.create({
  // baseURL: "https://pathfinder.tryasp.net/api", // Old direct URL
  baseURL: "/api", // Use Vite Proxy to avoid CORS
  timeout: 60000, // Increased to 60s due to server latency
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 1. Request Interceptor: حماية التوكن قبل الإرسال
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // 💡 حماية صارمة: التأكد أن التوكن موجود وليس نصاً فاسداً
    if (
      token &&
      token !== "undefined" &&
      token !== "null" &&
      token !== "[object Object]"
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 2. Response Interceptor: التعامل مع الـ 401 مركزياً
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 💡 إذا رد السيرفر بـ 401، ننظف الذاكرة ونطرد المستخدم فوراً لتجنب اللوب
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // نستخدم window.location لضمان الخروج من أي شاشة
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
