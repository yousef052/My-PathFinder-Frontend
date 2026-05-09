// src/features/profile/hooks/useEducation.js
import { useState, useEffect, useCallback } from "react";
import { educationService } from "../services/educationService";
import { useNavigate } from "react-router-dom";

export const useEducation = () => {
  const [educations, setEducations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleUnauthorized = (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const fetchEducations = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await educationService.getMyEducation();
      setEducations(data?.data || data || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch educations", err);
      setError("Failed to load education history.");
      handleUnauthorized(err);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchEducations();
  }, [fetchEducations]);

  const handleAdd = async (data, files) => {
    setIsSubmitting(true);
    try {
      await educationService.addEducation(data, files);
      await fetchEducations();
      return true;
    } catch (err) {
      console.error("Failed to add education", err);
      handleUnauthorized(err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await educationService.deleteEducation(id);
      await fetchEducations();
    } catch (err) {
      console.error("Failed to delete education", err);
      handleUnauthorized(err);
    }
  };

  const handleDeleteCertificate = async (educationId, certUrl) => {
    try {
      await educationService.deleteCertificate(educationId, certUrl);
      await fetchEducations();
    } catch (err) {
      console.error("Failed to delete certificate", err);
      handleUnauthorized(err);
    }
  };

  return {
    educations,
    isLoading,
    isSubmitting,
    error,
    handleAdd,
    handleDelete,
    handleDeleteCertificate,
    refreshEducations: fetchEducations,
  };
};
