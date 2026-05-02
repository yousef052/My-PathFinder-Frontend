// src/features/courses/hooks/useCourseProgress.js
import { useState, useCallback } from "react";
import { courseProgressService } from "../services/courseProgressService";

export const useCourseProgress = () => {
  const [userProgress, setUserProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyProgress = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await courseProgressService.getMyProgress();
      // حماية: التأكد من تخزين مصفوفة دائماً[cite: 39]
      setUserProgress(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load progress data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const enrollInCourse = async (courseId) => {
    setIsLoading(true);
    setError(null);
    try {
      await courseProgressService.enroll(courseId);
      await fetchMyProgress();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Enrollment failed.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCourseProgress = async (
    progressId,
    newlyCompletedLessons,
    notes = "",
  ) => {
    try {
      await courseProgressService.updateProgress(progressId, {
        newlyCompletedLessons,
        notes,
      });
      await fetchMyProgress();
      return true;
    } catch (err) {
      setError("Failed to update progress.");
      return false;
    }
  };

  const dropCourse = async (progressId) => {
    try {
      await courseProgressService.dropCourse(progressId);
      setUserProgress((prev) =>
        prev.filter((p) => (p.id || p.progressId) !== progressId),
      );
      return true;
    } catch (err) {
      setError("Failed to drop course.");
      return false;
    }
  };

  return {
    userProgress,
    isLoading,
    error,
    fetchMyProgress,
    enrollInCourse,
    updateCourseProgress,
    dropCourse,
  };
};
