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
    // Exclude phoneNumber if API doesn't support it
    const { phoneNumber, ...payload } = userData;
    const response = await apiClient.post("/Auth/Register", payload);
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

  googleLogin: async (payload) => {
    const response = await apiClient.post("/Auth/Google-login", payload);
    return response.data;
  },

  resendOtp: async (email) => {
    const response = await apiClient.post("/Auth/resend-otp", { email });
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post("/Auth/logout");
    return response.data;
  },
};
