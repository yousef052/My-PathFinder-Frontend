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

export const useAdminJobSources = () => {
  const [jobSources, setJobSources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobSources = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminService.jobSources.getAll();
      setJobSources(toArray(data));
      return true;
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load job sources."));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveJobSource = useCallback(async (payload, id = null) => {
    setIsSaving(true);
    setError(null);
    try {
      if (id) {
        await adminService.jobSources.update(id, payload);
      } else {
        await adminService.jobSources.create(payload);
      }
      await fetchJobSources();
      return true;
    } catch (err) {
      setError(getErrorMessage(err, "Failed to save job source."));
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [fetchJobSources]);

  const deleteJobSource = useCallback(async (id) => {
    setIsSaving(true);
    setError(null);
    try {
      await adminService.jobSources.delete(id);
      setJobSources((prev) => prev.filter((source) => source.id !== id));
      return true;
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete job source."));
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    jobSources,
    isLoading,
    isSaving,
    error,
    fetchJobSources,
    saveJobSource,
    deleteJobSource,
  };
};
