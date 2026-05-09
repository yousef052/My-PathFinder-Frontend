// src/features/careerPath/services/userCareerPathService.js

import { apiClient } from "../../../core/network/apiClient";

export const userCareerPathService = {
  // جلب جميع المسارات التي التحق بها المستخدم
  getMyCareerPaths: async () => {
    const response = await apiClient.get("/UserCareerPath/my-career-paths");
    return response.data;
  },

  // جلب المسارات المفلترة حسب الحالة (NotStarted, InProgress, Completed, Cancelled)
  getPathsByStatus: async (status) => {
    const response = await apiClient.get("/UserCareerPath/GetCareerPaths", {
      params: { careerPathStatus: status },
    });
    return response.data;
  },

  // جلب تفاصيل مسار مسجل محدد
  getUserCareerPathById: async (userCareerPathId) => {
    const response = await apiClient.get(`/UserCareerPath/${userCareerPathId}`);
    return response.data;
  },

  // الالتحاق بمسار مهني جديد
  enroll: async (careerPathId) => {
    const response = await apiClient.post("/UserCareerPath/enroll", {
      careerPathId: careerPathId,
      careerPathStatus: "NotStarted",
    });
    return response.data;
  },

  // إلغاء الالتحاق بمسار
  unenroll: async (userCareerPathId) => {
    const response = await apiClient.delete(
      `/UserCareerPath/unenroll/${userCareerPathId}`,
    );
    return response.data;
  },

  // التحقق مما إذا كان المستخدم ملتحقاً بمسار معين
  checkEnrollment: async (careerPathId) => {
    const response = await apiClient.get(
      `/UserCareerPath/is-enrolled/${careerPathId}`,
    );
    return response.data;
  },

  // جلب المسارات الموصى بها (بناءً على التقييم المهني)
  getRecommended: async () => {
    try {
      const response = await apiClient.get("/UserCareerPath/recommended");
      return response.data;
    } catch (err) {
      // 💡 Swagger shows GET, but if it returns 400, it's likely a profile state issue
      console.warn("Recommended paths not available yet.", err.response?.status);
      return [];
    }
  },
};
