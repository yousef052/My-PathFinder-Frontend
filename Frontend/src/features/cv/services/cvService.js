// src/features/cv/services/cvService.js
import { apiClient } from "../../../core/network/apiClient";

export const cvService = {
  uploadCv: async (file, isPrimary = true) => {
    const formData = new FormData();
    formData.append("File", file); // مطابقة الاسم في Swagger[cite: 32]
    formData.append("IsPrimary", isPrimary);

    return apiClient.post("/Cv/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getMyCvs: async () => {
    return apiClient.get("/Cv/my-cvs");
  },

  compareCvs: async (cvIds) => {
    // إرسال مصفوفة المعرفات مغلفة في كائن[cite: 32]
    return apiClient.post("/Cv/compare", { cvIds: cvIds });
  },

  deleteCv: async (cvId) => {
    return apiClient.delete(`/Cv/${cvId}`);
  },

  setPrimary: async (cvId) => {
    return apiClient.put(`/Cv/${cvId}/set-primary`);
  },
};
