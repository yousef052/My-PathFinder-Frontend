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

export const useAdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchCourses = useCallback(async (searchTerm = "") => {
    setIsLoading(true);
    setError(null);
    try {
      const data = searchTerm.trim()
        ? await adminService.courses.search({ name: searchTerm })
        : await adminService.courses.getAll();
      setCourses(toArray(data));
      return true;
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load courses."));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveCourse = useCallback(async (formData, id = null) => {
    setIsSaving(true);
    setError(null);
    try {
      if (id) {
        await adminService.courses.update(id, formData);
      } else {
        await adminService.courses.create(formData);
      }
      await fetchCourses();
      return true;
    } catch (err) {
      setError(getErrorMessage(err, "Failed to save course."));
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [fetchCourses]);

  const deleteCourse = useCallback(async (id) => {
    setIsSaving(true);
    setError(null);
    try {
      await adminService.courses.delete(id);
      setCourses((prev) => prev.filter((course) => course.id !== id));
      return true;
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete course."));
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    courses,
    isLoading,
    isSaving,
    error,
    fetchCourses,
    saveCourse,
    deleteCourse,
  };
};
