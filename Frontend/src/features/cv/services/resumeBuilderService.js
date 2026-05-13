// src/features/cv/services/resumeBuilderService.js
import { apiClient } from "../../../core/network/apiClient";

export const resumeBuilderService = {
  generatePdf: async (pdfData) => {
    // إرسال طلب POST للباك إند مع تحديد نوع الاستجابة blob لضمان استقبال الملف بشكل سليم
    const response = await apiClient.post(
      "/ResumeBuilder/generate-pdf",
      pdfData,
      {
        responseType: "blob",
      },
    );
    return response.data;
  },
};
