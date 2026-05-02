// src/features/courses/hooks/useCourseCategory.js

import { useState, useCallback } from "react";
import { courseCategoryService } from "../services/courseCategoryService";

export const useCourseCategory = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // جلب التصنيفات الرئيسية
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await courseCategoryService.getAllCategories();
      setCategories(data);
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء جلب التصنيفات.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // جلب التصنيفات الفرعية لتصنيف محدد
  const fetchSubcategories = useCallback(async (categoryId) => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data =
        await courseCategoryService.getSubcategoriesByCategoryId(categoryId);
      setSubcategories(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "حدث خطأ أثناء جلب التصنيفات الفرعية.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // إضافة تصنيف رئيسي
  const addCategory = async (name) => {
    setIsLoading(true);
    setError(null);
    try {
      await courseCategoryService.addCategory({ name });
      await fetchCategories();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "فشل في إضافة التصنيف.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // حذف تصنيف رئيسي
  const deleteCategory = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await courseCategoryService.deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "فشل في حذف التصنيف.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // إضافة تصنيف فرعي
  const addSubcategory = async (name, categoryId) => {
    setIsLoading(true);
    setError(null);
    try {
      await courseCategoryService.addSubcategory({ name, categoryId });
      await fetchSubcategories(categoryId);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "فشل في إضافة التصنيف الفرعي.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // حذف تصنيف فرعي
  const deleteSubcategory = async (id, categoryId) => {
    setIsLoading(true);
    setError(null);
    try {
      await courseCategoryService.deleteSubcategory(id);
      setSubcategories((prev) => prev.filter((sub) => sub.id !== id));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "فشل في حذف التصنيف الفرعي.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // استيراد التصنيفات عبر ملف JSON
  const importJsonCategories = async (file) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      await courseCategoryService.importJson(formData);
      await fetchCategories(); // تحديث القائمة بالبيانات الجديدة
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "فشل في استيراد الملف.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    categories,
    subcategories,
    isLoading,
    error,
    fetchCategories,
    fetchSubcategories,
    addCategory,
    deleteCategory,
    addSubcategory,
    deleteSubcategory,
    importJsonCategories,
  };
};
