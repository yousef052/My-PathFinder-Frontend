// src/features/jobs/hooks/useJobApplications.js

import { useState, useCallback } from "react";
import { jobApplicationService } from "../services/jobApplicationService";

export const useJobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await jobApplicationService.getMyApplications();
      setApplications(
        Array.isArray(data) ? data : data?.data || data?.items || [],
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "حدث خطأ أثناء جلب طلبات التقديم.",
      );
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const applyForJob = async (jobId, notes = "") => {
    setIsLoading(true);
    setError(null);
    try {
      await jobApplicationService.applyForJob({ jobId, notes });
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "فشل في إرسال طلب التقديم.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateApplication = async (id, status, notes) => {
    setIsLoading(true);
    setError(null);
    try {
      await jobApplicationService.updateApplication(id, { status, notes });
      await fetchApplications(); // تحديث القائمة لتعكس التعديلات
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "فشل في تحديث الطلب.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteApplication = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await jobApplicationService.deleteApplication(id);
      setApplications((prev) => prev.filter((app) => app.id !== id));
      return true;
    } catch (err) {
      setError("فشل في سحب طلب التقديم.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    applications,
    isLoading,
    error,
    fetchApplications,
    applyForJob,
    updateApplication,
    deleteApplication,
  };
};
