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

export const useAdminGlobalSkills = () => {
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchSkills = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminService.skills.getGlobalSkills();
      setSkills(toArray(data));
      return true;
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load skills."));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createSkill = useCallback(async (payload) => {
    setIsSaving(true);
    setError(null);
    try {
      await adminService.skills.createGlobalSkill(payload);
      await fetchSkills();
      return true;
    } catch (err) {
      setError(getErrorMessage(err, "Failed to create skill."));
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [fetchSkills]);

  return {
    skills,
    isLoading,
    isSaving,
    error,
    fetchSkills,
    createSkill,
  };
};
