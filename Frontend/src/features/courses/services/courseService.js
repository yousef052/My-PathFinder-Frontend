// src/features/courses/services/courseService.js

import { apiClient } from "../../../core/network/apiClient";

export const courseService = {
  // جلب كل الكورسات مع دعم الفلاتر
  getAll: async (filters = {}) => {
    const searchTerm = filters.SearchTerm || filters.name;
    if (searchTerm) {
      const response = await apiClient.get("/Course/search", { params: { name: searchTerm } });
      return response.data;
    }
    const response = await apiClient.get("/Course/all", { params: filters });
    return response.data;
  },

  // جلب تفاصيل كورس معين
  getById: async (id) => {
    const response = await apiClient.get(`/Course/${id}`);
    return response.data;
  },

  // إضافة كورس جديد (يستخدم FormData لرفع الصورة ThumbnailFile)
  create: async (courseFormData) => {
    const response = await apiClient.post("/Course/add", courseFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // تحديث كورس (يستخدم FormData)
  update: async (id, courseFormData) => {
    const response = await apiClient.put(
      `/Course/update/${id}`,
      courseFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  // حذف كورس
  delete: async (id) => {
    const response = await apiClient.delete(`/Course/delete/${id}`);
    return response.data;
  },

  // التسجيل في كورس (POST /CourseProgress/enroll با body { courseId })
  enroll: async (courseId) => {
    const response = await apiClient.post("/CourseProgress/enroll", { courseId });
    return response.data;
  },
};
