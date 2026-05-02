// src/features/courses/services/coursePlatformService.js

import { apiClient } from "../../../core/network/apiClient";

export const coursePlatformService = {
  // جلب كل المنصات مع فلتر النشط فقط
  getAll: async (onlyActive = true) => {
    const response = await apiClient.get("/CoursePlatform/Get-All-Platforms", {
      params: { onlyActive },
    });
    return response.data;
  },

  // جلب منصة محددة
  getById: async (id) => {
    const response = await apiClient.get(`/CoursePlatform/${id}`);
    return response.data;
  },

  // إضافة منصة (JSON)
  add: async (platformData) => {
    const response = await apiClient.post("/CoursePlatform/add", platformData);
    return response.data;
  },

  // تحديث منصة (multipart/form-data)
  update: async (id, formData) => {
    const response = await apiClient.put(
      `/CoursePlatform/update/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  },

  // حذف منصة
  delete: async (id) => {
    const response = await apiClient.delete(`/CoursePlatform/delete/${id}`);
    return response.data;
  },
};
