// src/features/jobs/hooks/useJobSources.js

import { useState, useCallback } from "react";
import { jobSourceService } from "../services/jobSourceService";

export const useJobSources = () => {
  const [sources, setSources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSources = useCallback(async (onlyActive = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await jobSourceService.getAll(onlyActive);
      setSources(Array.isArray(data) ? data : data?.data || data?.items || []);
    } catch (err) {
      setError(err.response?.data?.message || "فشل في جلب مصادر الوظائف.");
      setSources([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addSource = async (sourceData) => {
    setIsLoading(true);
    setError(null);
    try {
      await jobSourceService.create(sourceData);
      await fetchSources(false); // تحديث القائمة بعد الإضافة
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "فشل في إضافة المصدر.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSource = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await jobSourceService.delete(id);
      setSources((prev) => prev.filter((src) => src.id !== id));
      return true;
    } catch (err) {
      setError("فشل في حذف المصدر.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sources,
    isLoading,
    error,
    fetchSources,
    addSource,
    deleteSource,
  };
};
