// src/features/courses/hooks/useSavedCourses.js
import { useState, useCallback } from "react";
import { savedCourseService } from "../services/savedCourseService";

export const useSavedCourses = () => {
  const [savedCourses, setSavedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSavedCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await savedCourseService.getSavedCourses();
      setSavedCourses(data?.data || data || []);
    } catch (err) {
      setError("Failed to fetch saved courses");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleSaveCourse = async (courseId, savedId = null) => {
    try {
      if (savedId) {
        await savedCourseService.unsaveCourse(savedId);
        setSavedCourses((prev) => prev.filter((c) => (c.id || c.savedCourseId) !== savedId));
        return { saved: false };
      } else {
        const response = await savedCourseService.saveCourse(courseId);
        // Refresh to get the new list with IDs
        await fetchSavedCourses();
        return { saved: true, data: response };
      }
    } catch (err) {
      console.error("Error toggling course save state:", err);
      return { error: err };
    }
  };

  return {
    savedCourses,
    isLoading,
    error,
    fetchSavedCourses,
    toggleSaveCourse,
  };
};
