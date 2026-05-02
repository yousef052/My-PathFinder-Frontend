// src/features/courses/hooks/useCoursePlatform.js

import { useState, useCallback } from "react";
import { coursePlatformService } from "../services/coursePlatformService";

export const useCoursePlatform = () => {
  const [platforms, setPlatforms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlatforms = useCallback(async (onlyActive = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await coursePlatformService.getAll(onlyActive);
      setPlatforms(data);
    } catch (err) {
      setError(err.response?.data?.message || "فشل في جلب المنصات.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addPlatform = async (data) => {
    setIsLoading(true);
    try {
      await coursePlatformService.add(data);
      await fetchPlatforms();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "فشل في إضافة المنصة.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePlatform = async (id) => {
    setIsLoading(true);
    try {
      await coursePlatformService.delete(id);
      setPlatforms((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (err) {
      setError("فشل في حذف المنصة.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    platforms,
    isLoading,
    error,
    fetchPlatforms,
    addPlatform,
    deletePlatform,
  };
};
