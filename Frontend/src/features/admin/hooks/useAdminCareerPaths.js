import { useCallback, useMemo, useState } from "react";
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

export const useAdminCareerPaths = () => {
  const [careerPaths, setCareerPaths] = useState([]);
  const [pathCourses, setPathCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [selectedCareerPath, setSelectedCareerPath] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCoursesLoading, setIsCoursesLoading] = useState(false);
  const [error, setError] = useState(null);

  const stats = useMemo(() => {
    const total = careerPaths.length;
    const count = (level) =>
      careerPaths.filter(
        (p) => (p.difficultyLevel || p.DifficultyLevel || "").toLowerCase() === level,
      ).length;

    return {
      total,
      beginner: count("beginner"),
      intermediate: count("intermediate"),
      advanced: count("advanced"),
    };
  }, [careerPaths]);

  const fetchCareerPaths = useCallback(async (searchTerm = "") => {
    setIsLoading(true);
    setError(null);

    try {
      const data = searchTerm.trim()
        ? await adminService.careerPaths.search({ name: searchTerm })
        : await adminService.careerPaths.getAll();
      setCareerPaths(toArray(data));
      return true;
    } catch (error) {
      setError(getErrorMessage(error, "Failed to load career paths."));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await adminService.categories.getAll();
      setCategories(toArray(data));
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  }, []);

  const fetchAllCourses = useCallback(async () => {
    try {
      const data = await adminService.courses.getAll();
      setAllCourses(toArray(data));
    } catch (err) {
      console.error("Failed to load courses", err);
    }
  }, []);

  const saveCareerPath = useCallback(
    async (payload, id = null) => {
      setIsSaving(true);
      setError(null);

      try {
        if (id) {
          await adminService.careerPaths.update(id, payload);
        } else {
          await adminService.careerPaths.create(payload);
        }

        await fetchCareerPaths();
        return true;
      } catch (error) {
        setError(getErrorMessage(error, "Failed to save career path."));
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [fetchCareerPaths],
  );

  const deleteCareerPath = useCallback(async (id) => {
    setIsSaving(true);
    setError(null);

    try {
      await adminService.careerPaths.delete(id);
      setCareerPaths((prev) => prev.filter((path) => path.id !== id));
      return true;
    } catch (error) {
      setError(getErrorMessage(error, "Failed to delete career path."));
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const fetchPathCourses = useCallback(async (careerPath) => {
    if (!careerPath?.id) return false;

    setSelectedCareerPath(careerPath);
    setIsCoursesLoading(true);
    setError(null);

    try {
      const data = await adminService.careerPathCourses.getByCareerPathId(
        careerPath.id,
      );
      setPathCourses(toArray(data));
      return true;
    } catch (error) {
      setError(getErrorMessage(error, "Failed to load linked courses."));
      return false;
    } finally {
      setIsCoursesLoading(false);
    }
  }, []);

  const linkCourseToPath = useCallback(
    async (payload) => {
      if (!selectedCareerPath?.id) return false;

      setIsSaving(true);
      setError(null);

      try {
        await adminService.careerPathCourses.create({
          ...payload,
          careerPathId: selectedCareerPath.id,
        });
        await fetchPathCourses(selectedCareerPath);
        return true;
      } catch (error) {
        setError(getErrorMessage(error, "Failed to link course."));
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [fetchPathCourses, selectedCareerPath],
  );

  const unlinkCourseFromPath = useCallback(async (id) => {
    setIsSaving(true);
    setError(null);

    try {
      await adminService.careerPathCourses.delete(id);
      setPathCourses((prev) => prev.filter((course) => course.id !== id));
      return true;
    } catch (error) {
      setError(getErrorMessage(error, "Failed to unlink course."));
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const clearSelectedCareerPath = useCallback(() => {
    setSelectedCareerPath(null);
    setPathCourses([]);
  }, []);

  return {
    careerPaths,
    pathCourses,
    categories,
    allCourses,
    selectedCareerPath,
    stats,
    isLoading,
    isSaving,
    isCoursesLoading,
    error,
    fetchCareerPaths,
    fetchCategories,
    fetchAllCourses,
    saveCareerPath,
    deleteCareerPath,
    fetchPathCourses,
    linkCourseToPath,
    unlinkCourseFromPath,
    clearSelectedCareerPath,
  };
};
