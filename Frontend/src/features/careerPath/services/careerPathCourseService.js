// src/features/careerPath/services/careerPathCourseService.js

import { apiClient } from "../../../core/network/apiClient";

export const careerPathCourseService = {
  // جلب جميع الكورسات المرتبطة بمسار مهني معين
  getByCareerPathId: async (careerPathId) => {
    const response = await apiClient.get(
      `/CareerPathCourse/career-path/${careerPathId}`,
    );
    return response.data;
  },

  // إضافة كورس جديد للمسار المهني
  create: async (careerPathCourseData) => {
    const response = await apiClient.post(
      "/CareerPathCourse",
      careerPathCourseData,
    );
    return response.data;
  },

  // إزالة كورس من المسار المهني
  delete: async (id) => {
    const response = await apiClient.delete(`/CareerPathCourse/${id}`);
    return response.data;
  },
};
