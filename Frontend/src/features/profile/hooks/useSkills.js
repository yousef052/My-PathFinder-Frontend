// src/features/profile/hooks/useSkills.js
import { useState, useEffect, useCallback } from "react";
import { skillService } from "../services/skillsService";

export const useSkills = () => {
  const [mySkills, setMySkills] = useState([]);
  const [globalSkills, setGlobalSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMySkills = useCallback(async () => {
    try {
      const data = await skillService.getMySkills();
      setMySkills(data?.data || data || []);
    } catch (err) {
      console.error("Fetch skills error", err);
    }
  }, []);

  const fetchGlobalSkills = useCallback(async () => {
    try {
      const data = await skillService.getGlobalSkills();
      setGlobalSkills(data?.data || data || []);
    } catch (err) {
      console.error("Fetch global error", err);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchMySkills(), fetchGlobalSkills()]).finally(() =>
      setIsLoading(false),
    );
  }, [fetchMySkills, fetchGlobalSkills]);

  const handleAddMySkill = async (skillData) => {
    setIsSubmitting(true);
    try {
      // إرسال البيانات للباك إند[cite: 34]
      await skillService.addMySkill({
        skillId: skillData.skillId,
        proficiencyLevel: skillData.proficiencyLevel || "Beginner",
        source: skillData.source || "Manual",
      });
      await fetchMySkills(); // تحديث القائمة فوراً
      return true;
    } catch (err) {
      console.error("Backend error during skill add", err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMySkill = async (userSkillId) => {
    const previous = [...mySkills];
    setMySkills((prev) =>
      prev.filter((s) => (s.userSkillId || s.id) !== userSkillId),
    );
    try {
      await skillService.removeMySkill(userSkillId);
    } catch (err) {
      setMySkills(previous);
    }
  };

  return {
    mySkills,
    globalSkills,
    isLoading,
    isSubmitting,
    handleAddMySkill,
    handleRemoveMySkill,
  };
};
