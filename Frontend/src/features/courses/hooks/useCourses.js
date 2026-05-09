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

  // 💡 الدالة المسؤولة عن التسجيل في الكورس
  const enrollInCourse = async (courseId) => {
    try {
      await courseService.enroll(courseId);
      return true;
    } catch (err) {
      if (
        err.response?.status === 400 &&
        err.response?.data?.includes("already")
      ) {
        alert("You are already enrolled in this course!");
      } else {
        console.error("Enrollment failed:", err);
        alert("Failed to enroll in the course. Please try again.");
      }
      return false;
    }
  };

  return {
    courses,
    isLoading,
    error,
    fetchCourses,
    addCourse,
    deleteCourse,
    enrollInCourse, // 💡 تصدير الدالة لتستخدمها الشاشة
  };
};
