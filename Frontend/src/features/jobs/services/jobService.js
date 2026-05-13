// src/features/jobs/services/jobService.js

import { apiClient } from "../../../core/network/apiClient";

export const jobService = {
  // جلب الوظائف مع الفلاتر (SearchTerm, Location, JobType, ...)
  getAll: async (filters = {}) => {
    // Swagger provides /api/jobs which supports various query parameters
    const response = await apiClient.get("/jobs", { params: filters });
    return response.data;
  },

  // جلب وظيفة محددة
  getById: async (id) => {
    const response = await apiClient.get(`/jobs/${id}`);
    return response.data;
  },

  // إضافة وظيفة جديدة
  create: async (jobData) => {
    const response = await apiClient.post("/jobs", jobData);
    return response.data;
  },

  // تحديث وظيفة
  update: async (id, jobData) => {
    const response = await apiClient.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  // حذف وظيفة
  delete: async (id) => {
    const response = await apiClient.delete(`/jobs/${id}`);
    return response.data;
  },

  // جلب الوظائف المقترحة بالذكاء الاصطناعي
  getRecommended: async () => {
    try {
      const response = await apiClient.get("/jobs/recommended");
      return response.data;
    } catch (err) {
      console.warn("Recommended jobs not available yet.", err.response?.status);
      return [];
    }
  },

  // البحث السريع بالاسم (إن وجد اختلاف عن التصفية العامة)
  searchByName: async (name) => {
    const response = await apiClient.get("/jobs/search", { params: { name } });
    return response.data;
  }
};
