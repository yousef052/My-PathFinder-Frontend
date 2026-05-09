// src/features/courses/services/savedCourseService.js
import { apiClient } from "../../../core/network/apiClient";

export const savedCourseService = {
  // Get all saved courses
  getSavedCourses: async () => {
    const response = await apiClient.get("/SavedCourse");
    return response.data;
  },

  // Save a course
  saveCourse: async (courseId) => {
    const response = await apiClient.post("/SavedCourse", { courseId });
    return response.data;
  },

  // Remove a course from saved
  unsaveCourse: async (id) => {
    const response = await apiClient.delete(`/SavedCourse/${id}`);
    return response.data;
  },

  // Check if a course is saved
  checkIfSaved: async (courseId) => {
    const response = await apiClient.get(`/SavedCourse/${courseId}/check`);
    return response.data;
  },
};
