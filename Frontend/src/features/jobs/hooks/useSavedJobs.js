// src/features/jobs/hooks/useSavedJobs.js
import { useState, useCallback } from "react";
import { savedJobService } from "../services/savedJobService";

export const useSavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSavedJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await savedJobService.getSavedJobs();
      setSavedJobs(data?.data || data || []);
    } catch (err) {
      setError("Failed to fetch saved jobs");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleSaveJob = async (jobId, savedRecordId = null) => {
    try {
      if (savedRecordId) {
        await savedJobService.unsaveJob(savedRecordId);
        setSavedJobs((prev) => prev.filter((item) => (item.id || item.savedJobId) !== savedRecordId));
        return { saved: false };
      } else {
        const response = await savedJobService.saveJob(jobId);
        await fetchSavedJobs();
        return { saved: true, data: response };
      }
    } catch (err) {
      console.error("Error toggling job save state:", err);
      return { error: err };
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
