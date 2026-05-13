// src/features/dashboard/services/recentSearchService.js
import { apiClient } from "../../../core/network/apiClient";

export const recentSearchService = {
  // جلب سجل البحث الأخير للكورسات
  getCourseHistory: async () => {
    const response = await apiClient.get("/RecentSearch/courses");
    return response.data;
  },

  // مسح سجل بحث الكورسات
  clearCourseHistory: async () => {
    const response = await apiClient.delete("/RecentSearch/courses");
    return response.data;
  },

  // جلب سجل البحث الأخير للوظائف
  getJobHistory: async () => {
    const response = await apiClient.get("/RecentSearch/jobs");
    return response.data;
  },

  // مسح سجل بحث الوظائف
  clearJobHistory: async () => {
    const response = await apiClient.delete("/RecentSearch/jobs");
    return response.data;
  },

  // جلب سجل البحث الأخير للمسارات المهنية
  getCareerPathHistory: async () => {
    const response = await apiClient.get("/RecentSearch/careerpaths");
    return response.data;
  },

  // مسح سجل بحث المسارات المهنية
  clearCareerPathHistory: async () => {
    const response = await apiClient.delete("/RecentSearch/careerpaths");
    return response.data;
  },

  // حذف سجل بحث محدد بالـ ID
  deleteSearchRecord: async (id) => {
    const response = await apiClient.delete(`/RecentSearch/${id}`);
    return response.data;
  }
};
