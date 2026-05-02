// src/features/courses/hooks/useCourses.js

import { useState, useCallback } from "react";
import { courseService } from "../services/courseService";

export const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // جلب الكورسات مع تمرير الفلاتر
  const fetchCourses = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await courseService.getAll(filters);
      // التأكد من أن البيانات مصفوفة (في حال كان الباك إند يغلفها بـ items أو data)
      setCourses(Array.isArray(data) ? data : data.items || data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء جلب الكورسات.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // إضافة كورس جديد
  const addCourse = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      await courseService.create(formData);
      await fetchCourses(); // تحديث القائمة فوراً
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "فشل في إضافة الكورس.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // حذف كورس
  const deleteCourse = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await courseService.delete(id);
      setCourses((prev) => prev.filter((course) => course.id !== id));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "فشل في حذف الكورس.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    courses,
    isLoading,
    error,
    fetchCourses,
    addCourse,
    deleteCourse,
  };
};
