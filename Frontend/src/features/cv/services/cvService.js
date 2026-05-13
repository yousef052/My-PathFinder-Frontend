// src/features/cv/services/cvService.js
import { apiClient } from "../../../core/network/apiClient";

export const cvService = {
  uploadCv: async (file, isPrimary = true) => {
    const formData = new FormData();
    formData.append("File", file); // PascalCase matches backend expected multipart key
    formData.append("IsPrimary", String(isPrimary));

    return apiClient.post("/Cv/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getMyCvs: async () => {
    const response = await apiClient.get("/Cv/my-cvs");
    return response.data;
  },

  compareCvs: async (cvIds) => {
    // Swagger: POST /api/Cv/compare - Payload: cvIds[]
    // Using camelCase 'cvIds' as per Swagger list provided
    return apiClient.post("/Cv/compare", { 
      cvIds: cvIds.map(id => Number(id)) 
    }).then(res => res.data?.data || res.data);
  },

  getRecommended: async () => {
    try {
      const response = await apiClient.get("/UserCareerPath/recommended");
      return response.data;
    } catch (err) {
      console.warn("Recommended paths not available yet.", err.response?.status);
      return [];
    }
  },

  deleteCv: async (cvId) => {
    const response = await apiClient.delete(`/Cv/${cvId}`);
    return response.data;
  },

  setPrimary: async (cvId) => {
    const response = await apiClient.put(`/Cv/${cvId}/set-primary`);
    return response.data;
  },
};
