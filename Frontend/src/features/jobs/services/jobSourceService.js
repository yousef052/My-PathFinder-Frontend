// src/features/jobs/services/jobSourceService.js

import { apiClient } from "../../../core/network/apiClient";

export const jobSourceService = {
  // جلب جميع المصادر (مع خيار تصفية النشط فقط)
  getAll: async (onlyActive = true) => {
    const response = await apiClient.get("/job-sources", {
      params: { onlyActive },
    });
    return response.data;
  },

  // جلب مصدر محدد
  getById: async (id) => {
    const response = await apiClient.get(`/job-sources/${id}`);
    return response.data;
  },

  // إضافة مصدر جديد
  create: async (sourceData) => {
    const response = await apiClient.post("/job-sources", sourceData);
    return response.data;
  },

  // تحديث بيانات مصدر
  update: async (id, sourceData) => {
    const response = await apiClient.put(`/job-sources/${id}`, sourceData);
    return response.data;
  },

  // حذف مصدر
  delete: async (id) => {
    const response = await apiClient.delete(`/job-sources/${id}`);
    return response.data;
  },
};
