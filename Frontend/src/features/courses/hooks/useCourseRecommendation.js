import { useState, useCallback } from "react";
import { courseRecommendationService } from "../services/courseRecommendationService";

export const useCourseRecommendation = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecommendations = useCallback(async (jobTitle = "") => {
    setIsLoading(true);
    setError(null);
    try {
      // 💡 تنظيف النص لضمان عدم إرسال قيم وهمية للسيرفر[cite: 18]
      const cleanTitle =
        typeof jobTitle === "string" && jobTitle !== ":1" ? jobTitle : "";
      const data =
        await courseRecommendationService.getMyRecommendations(cleanTitle);

      const finalData = Array.isArray(data)
        ? data
        : data?.data || data?.items || [];
      setRecommendations(finalData);
    } catch (err) {
      setError("Failed to fetch recommendations.");
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { recommendations, isLoading, error, fetchRecommendations };
};
