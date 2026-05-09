// src/features/careerPath/hooks/useUserCareerPath.js

import { useState, useCallback } from "react";
import { userCareerPathService } from "../services/userCareerPathService";

export const useUserCareerPath = () => {
  const [myPaths, setMyPaths] = useState([]);
  const [recommendedPaths, setRecommendedPaths] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyPaths = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userCareerPathService.getMyCareerPaths();
      setMyPaths(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      setError("فشل في جلب مساراتك المهنية.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchRecommendedPaths = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userCareerPathService.getRecommended();
      setRecommendedPaths(Array.isArray(data) ? data : data?.data || []);
    } catch {
      setRecommendedPaths([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const enrollInPath = async (careerPathId) => {
    setIsLoading(true);
    setError(null);
    try {
      await userCareerPathService.enroll(careerPathId);
      await fetchMyPaths(); // تحديث القائمة بعد الالتحاق
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "فشل في الالتحاق بالمسار.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const unenrollFromPath = async (userCareerPathId) => {
    setIsLoading(true);
    setError(null);
    try {
      await userCareerPathService.unenroll(userCareerPathId);
      setMyPaths((prev) =>
        prev.filter(
          (p) =>
            p.id !== userCareerPathId &&
            p.userCareerPathId !== userCareerPathId,
        ),
      );
      return true;
    } catch (err) {
      setError("فشل في إلغاء الالتحاق.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    myPaths,
    recommendedPaths,
    isLoading,
    error,
    fetchMyPaths,
    fetchRecommendedPaths,
    enrollInPath,
    unenrollFromPath,
  };
};
