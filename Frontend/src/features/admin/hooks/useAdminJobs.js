import { useCallback, useState } from "react";
import { adminService } from "../services/adminService";

const toArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.result)) return data.result;
  if (Array.isArray(data?.result?.items)) return data.result.items;
  if (Array.isArray(data?.result?.data)) return data.result.data;
  return [];
};

const getErrorMessage = (error, fallback) => {
  const data = error?.response?.data;
  if (typeof data === "string") return data;
  return data?.message || data?.title || error?.message || fallback;
};

export const useAdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async (searchTerm = "") => {
    setIsLoading(true);
    setError(null);
    try {
      const params = searchTerm.trim() ? { SearchTerm: searchTerm } : {};
      const data = await adminService.jobs.getAll(params);
      setJobs(toArray(data));
      return true;
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load jobs."));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveJob = useCallback(async (formData, id = null) => {
    setIsSaving(true);
    setError(null);
    try {
      if (id) {
        await adminService.jobs.update(id, formData);
      } else {
        await adminService.jobs.create(formData);
      }
      await fetchJobs();
      return true;
    } catch (err) {
      setError(getErrorMessage(err, "Failed to save job."));
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [fetchJobs]);

  const deleteJob = useCallback(async (id) => {
    setIsSaving(true);
    setError(null);
    try {
      await adminService.jobs.delete(id);
      setJobs((prev) => prev.filter((job) => job.id !== id));
      return true;
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete job."));
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    jobs,
    isLoading,
    isSaving,
    error,
    fetchJobs,
    saveJob,
    deleteJob,
  };
};
