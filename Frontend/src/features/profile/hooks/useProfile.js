// src/features/profile/hooks/useProfile.js
import { useState, useEffect, useCallback } from "react";
import { profileService } from "../services/profileService";

export const useProfile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await profileService.getProfile();
      const profileData = data?.data || data;
      const storedEmail =
        localStorage.getItem("userEmail") || localStorage.getItem("email");

      setUser({
        ...profileData,
        email: profileData?.email || profileData?.Email || storedEmail,
      });
    } catch (err) {
      console.warn("Fallback profile data activated.");
      setUser({
        firstName: "User",
        lastName: "Name",
        email: localStorage.getItem("userEmail") || "user@example.com",
        bio: "Software Engineering Professional",
        location: "Egypt",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const updateProfile = async (profileData, profilePictureFile) => {
    setIsUpdating(true);
    try {
      await profileService.updateProfile(profileData, profilePictureFile);
      if (profileData.email)
        localStorage.setItem("userEmail", profileData.email);
      await fetchUser();
      return true;
    } catch (err) {
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    user,
    isLoading,
    isUpdating,
    updateProfile,
    refreshProfile: fetchUser,
  };
};
