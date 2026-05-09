import { useCallback, useMemo, useState } from "react";
import { adminService } from "../services/adminService";

const toArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.result)) return data.result;
  return [];
};

const getErrorMessage = (error, fallback) => {
  const data = error?.response?.data;
  if (typeof data === "string") return data;
  return data?.message || data?.title || error?.message || fallback;
};

export const useAdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubcategoriesLoading, setIsSubcategoriesLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const stats = useMemo(
    () => ({
      categories: categories.length,
      subcategories: subcategories.length,
    }),
    [categories.length, subcategories.length],
  );

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await adminService.categories.getAll();
      setCategories(toArray(data));
      return true;
    } catch (error) {
      setError(getErrorMessage(error, "Failed to load categories."));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSubcategories = useCallback(async (category) => {
    if (!category?.id) {
      setSelectedCategory(null);
      setSubcategories([]);
      return false;
    }

    setSelectedCategory(category);
    setIsSubcategoriesLoading(true);
    setError(null);

    try {
      const data = await adminService.categories.getSubcategories(category.id);
      setSubcategories(toArray(data));
      return true;
    } catch (error) {
      setError(getErrorMessage(error, "Failed to load subcategories."));
      return false;
    } finally {
      setIsSubcategoriesLoading(false);
    }
  }, []);

  const saveCategory = useCallback(
    async (payload, id = null) => {
      setIsSaving(true);
      setError(null);

      try {
        if (id) {
          await adminService.categories.updateCategory(id, payload);
        } else {
          await adminService.categories.createCategory(payload);
        }

        await fetchCategories();
        return true;
      } catch (error) {
        setError(getErrorMessage(error, "Failed to save category."));
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [fetchCategories],
  );

  const deleteCategory = useCallback(
    async (id) => {
      setIsSaving(true);
      setError(null);

      try {
        await adminService.categories.deleteCategory(id);
        setCategories((prev) => prev.filter((category) => category.id !== id));
        if (selectedCategory?.id === id) {
          setSelectedCategory(null);
          setSubcategories([]);
        }
        return true;
      } catch (error) {
        setError(getErrorMessage(error, "Failed to delete category."));
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [selectedCategory],
  );

  const saveSubcategory = useCallback(
    async (payload, id = null) => {
      const categoryId = payload.categoryId || selectedCategory?.id;
      if (!categoryId) return false;

      setIsSaving(true);
      setError(null);

      try {
        if (id) {
          await adminService.categories.updateSubcategory(id, {
            ...payload,
            categoryId,
          });
        } else {
          await adminService.categories.createSubcategory({
            ...payload,
            categoryId,
          });
        }

        await fetchSubcategories({ ...selectedCategory, id: categoryId });
        return true;
      } catch (error) {
        setError(getErrorMessage(error, "Failed to save subcategory."));
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [fetchSubcategories, selectedCategory],
  );

  const deleteSubcategory = useCallback(async (id) => {
    setIsSaving(true);
    setError(null);

    try {
      await adminService.categories.deleteSubcategory(id);
      setSubcategories((prev) =>
        prev.filter((subcategory) => subcategory.id !== id),
      );
      return true;
    } catch (error) {
      setError(getErrorMessage(error, "Failed to delete subcategory."));
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const importJsonCategories = useCallback(
    async (file) => {
      if (!file) return false;

      setIsSaving(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", file);
        await adminService.categories.importJson(formData);
        await fetchCategories();
        if (selectedCategory) await fetchSubcategories(selectedCategory);
        return true;
      } catch (error) {
        setError(getErrorMessage(error, "Failed to import JSON file."));
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [fetchCategories, fetchSubcategories, selectedCategory],
  );

  return {
    categories,
    subcategories,
    selectedCategory,
    stats,
    isLoading,
    isSubcategoriesLoading,
    isSaving,
    error,
    fetchCategories,
    fetchSubcategories,
    saveCategory,
    deleteCategory,
    saveSubcategory,
    deleteSubcategory,
    importJsonCategories,
  };
};
