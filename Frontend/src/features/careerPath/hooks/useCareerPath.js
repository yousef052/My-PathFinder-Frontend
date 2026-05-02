// src/features/careerPath/hooks/useCareerPath.js

import { useState, useCallback } from "react";
import { careerPathService } from "../services/careerPathService";

export const useCareerPath = () => {
  const [careerPaths, setCareerPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // جلب جميع المسارات
  const fetchCareerPaths = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await careerPathService.getAll();
      setCareerPaths(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "حدث خطأ أثناء جلب المسارات المهنية.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // إضافة مسار جديد
  const addCareerPath = async (newData) => {
    setIsLoading(true);
    setError(null);
    try {
      await careerPathService.create(newData);
      await fetchCareerPaths(); // تحديث القائمة بعد الإضافة
      return true; // إرجاع true للـ Component ليعرف أن العملية نجحت
    } catch (err) {
      setError(err.response?.data?.message || "فشل في إضافة المسار المهني.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // تحديث مسار
  const updateCareerPath = async (id, updatedData) => {
    setIsLoading(true);
    setError(null);
    try {
      await careerPathService.update(id, updatedData);
      await fetchCareerPaths(); // تحديث القائمة
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "فشل في تحديث المسار المهني.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // حذف مسار
  const deleteCareerPath = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await careerPathService.delete(id);
      // إزالة العنصر من الـ State مباشرة لتحديث الواجهة بسرعة بدون إعادة طلب من السيرفر
      setCareerPaths((prev) => prev.filter((path) => path.id !== id));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "فشل في حذف المسار المهني.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    careerPaths,
    currentPath,
    isLoading,
    error,
    fetchCareerPaths,
    addCareerPath,
    updateCareerPath,
    deleteCareerPath,
  };
};
