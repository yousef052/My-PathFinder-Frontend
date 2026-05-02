// src/features/careerPath/hooks/useCareerPathCourse.js

import { useState, useCallback } from "react";
import { careerPathCourseService } from "../services/careerPathCourseService";

export const useCareerPathCourse = () => {
  const [pathCourses, setPathCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // جلب الكورسات الخاصة بمسار معين
  const fetchPathCourses = useCallback(async (careerPathId) => {
    if (!careerPathId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data =
        await careerPathCourseService.getByCareerPathId(careerPathId);
      setPathCourses(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "حدث خطأ أثناء جلب كورسات المسار.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // إضافة كورس للمسار
  const addCourseToPath = async (newData) => {
    setIsLoading(true);
    setError(null);
    try {
      await careerPathCourseService.create(newData);
      // تحديث القائمة فوراً بعد الإضافة الناجحة
      if (newData.careerPathId) {
        await fetchPathCourses(newData.careerPathId);
      }
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "فشل في ربط الكورس بالمسار.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // إزالة كورس من المسار
  const removeCourseFromPath = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await careerPathCourseService.delete(id);
      // إزالة العنصر محلياً لتحديث الواجهة بسرعة
      setPathCourses((prev) => prev.filter((item) => item.id !== id));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "فشل في إزالة الكورس من المسار.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    pathCourses,
    isLoading,
    error,
    fetchPathCourses,
    addCourseToPath,
    removeCourseFromPath,
  };
};
