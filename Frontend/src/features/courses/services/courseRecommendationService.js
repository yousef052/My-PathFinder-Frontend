// src/features/courses/services/courseRecommendationService.js

import { apiClient } from "../../../core/network/apiClient";

export const courseRecommendationService = {
  // جلب توصيات الكورسات بناءً على المسمى الوظيفي المستهدف
  getMyRecommendations: async (targetJobTitle = "") => {
    const response = await apiClient.get(
      "/CourseRecommendation/my-recommendations",
      {
        params: { targetJobTitle },
      },
    );
    return response.data;
  },
};
