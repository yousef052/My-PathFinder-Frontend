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

export const useAdminPlatforms = () => {
  const [platforms, setPlatforms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlatforms = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminService.platforms.getAll();
      setPlatforms(toArray(data));
      return true;
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load platforms."));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const savePlatform = useCallback(async (payload, id = null) => {
    setIsSaving(true);
    setError(null);
    try {
      if (id) {
        await adminService.platforms.update(id, payload);
      } else {
        await adminService.platforms.create(payload);
      }
      await fetchPlatforms();
      return true;
    } catch (err) {
      setError(getErrorMessage(err, "Failed to save platform."));
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [fetchPlatforms]);

  const deletePlatform = useCallback(async (id) => {
    setIsSaving(true);
    setError(null);
    try {
      await adminService.platforms.delete(id);
      setPlatforms((prev) => prev.filter((platform) => platform.id !== id));
      return true;
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete platform."));
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    platforms,
    isLoading,
    isSaving,
    error,
    fetchPlatforms,
    savePlatform,
    deletePlatform,
  };
};
