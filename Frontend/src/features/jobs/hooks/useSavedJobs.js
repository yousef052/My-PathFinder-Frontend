// src/features/jobs/hooks/useSavedJobs.js
import { useState, useCallback } from "react";
import { savedJobService } from "../services/savedJobService";

export const useSavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSavedJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await savedJobService.getSavedJobs();
      setSavedJobs(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      setError("فشل في جلب الوظائف المحفوظة.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleSaveJob = async (
    jobId,
    isCurrentlySaved,
    savedRecordId = null,
  ) => {
    try {
      if (isCurrentlySaved) {
        await savedJobService.unsaveJob(savedRecordId);
        setSavedJobs((prev) => prev.filter((job) => job.id !== savedRecordId));
        return { action: "unsaved", success: true };
      } else {
        const response = await savedJobService.saveJob(jobId);
        await fetchSavedJobs(); // تحديث القائمة
        return { action: "saved", success: true, data: response };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    savedJobs,
    isLoading,
    error,
    fetchSavedJobs,
    toggleSaveJob,
  };
};
