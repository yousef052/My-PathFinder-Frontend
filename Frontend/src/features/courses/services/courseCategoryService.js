// src/features/courses/services/courseCategoryService.js

import { apiClient } from "../../../core/network/apiClient";

export const courseCategoryService = {
  // --- عمليات التصنيفات الرئيسية (Categories) ---

  getAllCategories: async () => {
    const response = await apiClient.get("/CourseCategory/all");
    return response.data;
  },

  addCategory: async (categoryData) => {
    const response = await apiClient.post(
      "/CourseCategory/category/add",
      categoryData,
    );
    return response.data;
  },

  updateCategory: async (id, categoryData) => {
    const response = await apiClient.put(
      `/CourseCategory/category/update/${id}`,
      categoryData,
    );
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await apiClient.delete(
      `/CourseCategory/category/delete/${id}`,
    );
    return response.data;
  },

  // --- عمليات التصنيفات الفرعية (Subcategories) ---

  getSubcategoriesByCategoryId: async (categoryId) => {
    const response = await apiClient.get(
      `/CourseCategory/${categoryId}/subcategories`,
    );
    return response.data;
  },

  addSubcategory: async (subcategoryData) => {
    const response = await apiClient.post(
      "/CourseCategory/subcategory/add",
      subcategoryData,
    );
    return response.data;
  },

  updateSubcategory: async (id, subcategoryData) => {
    const response = await apiClient.put(
      `/CourseCategory/subcategory/update/${id}`,
      subcategoryData,
    );
    return response.data;
  },

  deleteSubcategory: async (id) => {
    const response = await apiClient.delete(
      `/CourseCategory/subcategory/delete/${id}`,
    );
    return response.data;
  },

  // --- عملية استيراد البيانات (Import JSON) ---

  importJson: async (formData) => {
    const response = await apiClient.post(
      "/CourseCategory/import-json",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },
};
