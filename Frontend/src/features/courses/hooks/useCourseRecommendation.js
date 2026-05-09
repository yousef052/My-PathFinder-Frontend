import { useCallback, useState } from "react";
import { courseRecommendationService } from "../services/courseRecommendationService";

export const useCourseRecommendation = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecommendations = useCallback(async (jobTitle = "") => {
    const cleanTitle =
      typeof jobTitle === "string" && jobTitle.trim() && jobTitle !== ":1"
        ? jobTitle.trim()
        : "";

    if (!cleanTitle) {
      setRecommendations([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data =
        await courseRecommendationService.getMyRecommendations(cleanTitle);
      setRecommendations(
        Array.isArray(data) ? data : data?.data || data?.items || [],
      );
    } catch {
      setError("Failed to fetch recommendations.");
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { recommendations, isLoading, error, fetchRecommendations };
};
