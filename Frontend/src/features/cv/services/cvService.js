// src/features/cv/services/cvService.js
import { apiClient } from "../../../core/network/apiClient";

export const cvService = {
  uploadCv: async (file, isPrimary = true) => {
    const formData = new FormData();
    formData.append("File", file); // مطابقة الاسم في Swagger
    formData.append("IsPrimary", isPrimary);

    return apiClient.post("/Cv/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getMyCvs: async () => {
    return apiClient.get("/Cv/my-cvs");
  },

  compareCvs: async (cvIds) => {
    // 💡 التفكير الهندسي: تجربة استخدام CvIds (Capital C) تحسباً لكون الباك إند Case-Sensitive
    return apiClient.post("/Cv/compare", { 
      CvIds: cvIds.map(id => Number(id)) 
    }).then(res => res.data?.data || res.data);
  },

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

  deleteCv: async (cvId) => {
    return apiClient.delete(`/Cv/${cvId}`);
  },

  setPrimary: async (cvId) => {
    return apiClient.put(`/Cv/${cvId}/set-primary`);
  },
};
