// src/features/careerMatch/hooks/useCareerMatch.js

import { useState, useCallback } from "react";
import { careerMatchService } from "../services/careerMatchService";

export const useCareerMatch = () => {
  const [questionnaire, setQuestionnaire] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuestionnaire = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await careerMatchService.getQuestionnaire();
      setQuestionnaire(response?.data || response);
    } catch (err) {
      setError("فشل في جلب أسئلة التقييم المهني.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitQuestionnaire = async (answers) => {
    if (!questionnaire) return;

    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        questionnaireId: Number(
          questionnaire.id || questionnaire.questionnaireId,
        ),
        answers: answers.map((a) => ({
          questionId: Number(a.questionId),
          answer: String(a.answer),
        })),
      };

      const result = await careerMatchService.submitAnswers(payload);
      setMatchResult(result?.data || result);
      return true;
    } catch (err) {
      console.error("Submission Error:", err);
      // 💡 قراءة الرسالة المباشرة من السيرفر (زي No career paths found)
      const serverError = err.response?.data?.message || err.response?.data;
      setError(
        typeof serverError === "string"
          ? serverError
          : "فشل في تحليل النتيجة. تأكد من وجود مسارات مهنية في قاعدة البيانات.",
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    questionnaire,
    matchResult,
    isLoading,
    error,
    fetchQuestionnaire,
    submitQuestionnaire,
  };
};
