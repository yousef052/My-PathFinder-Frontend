// src/features/careerPath/services/careerPathService.js

import { apiClient } from "../../../core/network/apiClient";

export const careerPathService = {
  // جلب كل المسارات
  getAll: async () => {
    const response = await apiClient.get("/CareerPath");
    return response.data;
  },

  // جلب مسار محدد بالـ ID
  getById: async (id) => {
    const response = await apiClient.get(`/CareerPath/${id}`);
    return response.data;
  },

  // إضافة مسار جديد
  create: async (careerPathData) => {
    const response = await apiClient.post(
      "/CareerPath/add new careerPath",
      careerPathData,
    );
    return response.data;
  },

  // تحديث مسار موجود
  update: async (id, careerPathData) => {
    const response = await apiClient.put(
      `/CareerPath/updatecareerPath/${id}`,
      careerPathData,
    );
    return response.data;
  },

  // حذف مسار
  delete: async (id) => {
    const response = await apiClient.delete(
      `/CareerPath/deletecareerPath/${id}`,
    );
    return response.data;
  },
};
