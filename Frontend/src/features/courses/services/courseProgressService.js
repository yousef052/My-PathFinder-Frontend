// src/features/courses/services/courseProgressService.js

import { apiClient } from "../../../core/network/apiClient";

export const courseProgressService = {
  // جلب تقدم المستخدم الحالي في كافة الكورسات المسجل بها
  getMyProgress: async () => {
    const response = await apiClient.get("/CourseProgress/my-progress");
    return response.data;
  },

  // التسجيل في كورس جديد
  enroll: async (courseId) => {
    const response = await apiClient.post("/CourseProgress/enroll", { courseId });
    return response.data;
  },

  // تحديث التقدم (عدد الدروس المكتملة والملاحظات)
  updateProgress: async (progressId, updateData) => {
    const response = await apiClient.put(
      `/CourseProgress/UpdateProgress/${progressId}`,
      updateData,
    );
    return response.data;
  },

  // حذف (إسقاط) كورس من قائمة التقدم
  dropCourse: async (progressId) => {
    const response = await apiClient.delete(
      `/CourseProgress/drop/${progressId}`,
    );
    return response.data;
  },
};
