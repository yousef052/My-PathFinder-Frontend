// src/features/jobs/services/savedJobService.js
import { apiClient } from "../../../core/network/apiClient";

export const savedJobService = {
  // جلب كل الوظائف المحفوظة
  getSavedJobs: async () => {
    const response = await apiClient.get("/saved-jobs");
    return response.data;
  },

  // حفظ وظيفة جديدة
  saveJob: async (jobId, notes = "") => {
    const response = await apiClient.post("/saved-jobs", { jobId, notes });
    return response.data;
  },

  // إزالة وظيفة من المحفوظات
  unsaveJob: async (id) => {
    const response = await apiClient.delete(`/saved-jobs/${id}`);
    return response.data;
  },

  // التحقق إذا كانت الوظيفة محفوظة مسبقاً (لأغراض الـ UI)
  checkIfSaved: async (jobId) => {
    const response = await apiClient.get(`/saved-jobs/${jobId}/check`);
    return response.data; // يتوقع رد boolean أو object يحتوي الحالة
  },
};
