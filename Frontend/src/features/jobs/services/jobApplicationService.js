// src/features/jobs/services/jobApplicationService.js

import { apiClient } from "../../../core/network/apiClient";

export const jobApplicationService = {
  // التقديم على وظيفة
  applyForJob: async (applicationData) => {
    const response = await apiClient.post("/job-applications", applicationData);
    return response.data;
  },

  // جلب جميع الوظائف التي قدم عليها المستخدم
  getMyApplications: async () => {
    const response = await apiClient.get("/job-applications");
    return response.data;
  },

  // تحديث حالة أو ملاحظات التقديم
  updateApplication: async (id, updateData) => {
    const response = await apiClient.put(`/job-applications/${id}`, updateData);
    return response.data;
  },

  // سحب التقديم (حذف)
  deleteApplication: async (id) => {
    const response = await apiClient.delete(`/job-applications/${id}`);
    return response.data;
  },
};
