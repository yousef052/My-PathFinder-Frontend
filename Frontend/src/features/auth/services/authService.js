// src/features/auth/services/authService.js

import { apiClient } from "../../../core/network/apiClient";

export const authService = {
  login: async (credentials) => {
    return apiClient.post("/Auth/Login", {
      email: credentials.email,
      password: credentials.password,
    });
  },

  register: async (userData) => {
    const response = await apiClient.post("/Auth/Register", userData);
    return response.data;
  },

  confirmEmail: async (confirmData) => {
    const response = await apiClient.post("/Auth/Confirm-Email", confirmData);
    return response.data;
  },

  forgotPassword: async (emailData) => {
    const response = await apiClient.post("/Auth/Forgot-Password", emailData);
    return response.data;
  },

  resetPassword: async (resetData) => {
    const response = await apiClient.post("/Auth/Reset-Password", resetData);
    return response.data;
  },

  // 💡 التعديل هنا: الدالة تستقبل الكائن جاهزاً من الـ Hook
  googleLogin: async (payload) => {
    const response = await apiClient.post("/Auth/Google-login", payload);
    return response.data;
  },

  resendOtp: async (email) => {
    const response = await apiClient.post("/Auth/resend-otp", { email });
    return response.data;
  },
};
