// src/features/dashboard/services/dashboardService.js
import { apiClient } from "../../../core/network/apiClient";

export const dashboardService = {
  // جلب ملخص البيانات للوحة التحكم
  getSummary: async () => {
    const response = await apiClient.get("/Dashboard");
    return response.data;
  }
};
