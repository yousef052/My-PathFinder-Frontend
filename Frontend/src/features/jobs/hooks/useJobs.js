// src/features/jobs/hooks/useJobs.js

import { useState, useCallback } from "react";
import { jobService } from "../services/jobService";

export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]); // 💡 مصفوفة للوظائف المقترحة
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // جلب كل الوظائف مع الفلاتر
  const fetchJobs = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await jobService.getAll(filters);
      setJobs(Array.isArray(data) ? data : data?.data || data?.items || []);
    } catch (err) {
      setError(err.response?.data?.message || "فشل في جلب الوظائف.");
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 💡 جلب الوظائف المقترحة بالذكاء الاصطناعي
  const fetchRecommended = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await jobService.getRecommended();
      setRecommendedJobs(
        Array.isArray(data) ? data : data?.data || data?.items || [],
      );
    } catch (err) {
      console.error("Failed to fetch recommendations", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addJob = async (jobData) => {
    setIsLoading(true);
    try {
      await jobService.create(jobData);
      await fetchJobs();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "فشل في إضافة الوظيفة.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteJob = async (id) => {
    setIsLoading(true);
    try {
      await jobService.delete(id);
      setJobs((prev) => prev.filter((job) => job.id !== id));
      setRecommendedJobs((prev) => prev.filter((job) => job.id !== id));
      return true;
    } catch (err) {
      setError("فشل في حذف الوظيفة.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    jobs,
    recommendedJobs,
    isLoading,
    error,
    fetchJobs,
    fetchRecommended,
    addJob,
    deleteJob,
  };
};
