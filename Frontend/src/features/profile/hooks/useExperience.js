// src/features/profile/hooks/useExperience.js
import { useState, useEffect, useCallback } from "react";
import { experienceService } from "../services/experienceService";
import { useNavigate } from "react-router-dom";

export const useExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleUnauthorized = (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const fetchExperiences = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await experienceService.getMyExperiences();
      setExperiences(data?.data || data || []);
    } catch (err) {
      console.error("Failed to fetch experiences", err);
      handleUnauthorized(err);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  const handleAdd = async (data) => {
    setIsSubmitting(true);
    try {
      await experienceService.addExperience(data);
      await fetchExperiences();
      return true;
    } catch (err) {
      console.error("Failed to add experience", err);
      handleUnauthorized(err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await experienceService.deleteExperience(id);
      await fetchExperiences();
    } catch (err) {
      console.error("Failed to delete experience", err);
      handleUnauthorized(err);
    }
  };

  return { experiences, isLoading, isSubmitting, handleAdd, handleDelete };
};
