import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { profileService } from "../services/profileService";

let cachedUser = null;
let profileRequest = null;
let profileBlockedUntil = 0;
let hasLoggedProfileWarning = false;

const PROFILE_RETRY_DELAY = 60 * 1000;

// Exported so login/logout hooks can wipe the cache on account switch
export const clearProfileCache = () => {
  cachedUser = null;
  profileRequest = null;
  profileBlockedUntil = 0;
  hasLoggedProfileWarning = false;
};

const decodeJwtPayload = (token) => {
  try {
    const payload = token?.split(".")?.[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );

    return JSON.parse(atob(paddedBase64));
  } catch {
    return null;
  }
};

const getFallbackUser = () => {
  const tokenPayload = decodeJwtPayload(localStorage.getItem("token"));
  const storedEmail =
    localStorage.getItem("userEmail") || localStorage.getItem("email");

  return {
    firstName: "",
    lastName: "",
    userName:
      tokenPayload?.unique_name ||
      tokenPayload?.name ||
      tokenPayload?.given_name ||
      "Professional User",
    email: tokenPayload?.email || storedEmail || "",
    role: tokenPayload?.role || tokenPayload?.Role,
  };
};

const normalizeProfile = (data) => {
  const profileData = data?.data || data || {};
  const fallbackUser = getFallbackUser();

  return {
    ...fallbackUser,
    ...profileData,
    email:
      profileData?.email ||
      profileData?.Email ||
      fallbackUser.email ||
      "",
  };
};

export const useProfile = ({ autoFetch = true } = {}) => {
  const [user, setUser] = useState(cachedUser);
  const [isLoading, setIsLoading] = useState(autoFetch && !cachedUser);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  const fetchUser = useCallback(
    async ({ force = false } = {}) => {
      if (!localStorage.getItem("token")) {
        cachedUser = null;
        setUser(null);
        setIsLoading(false);
        return null;
      }

      if (!force && cachedUser) {
        setUser(cachedUser);
        setIsLoading(false);
        return cachedUser;
      }

      if (!force && Date.now() < profileBlockedUntil) {
        const fallbackUser = cachedUser || getFallbackUser();
        cachedUser = fallbackUser;
        setUser(fallbackUser);
        setIsLoading(false);
        return fallbackUser;
      }

      setIsLoading(true);
      try {
        if (!profileRequest) {
          profileRequest = profileService.getProfile().finally(() => {
            profileRequest = null;
          });
        }

        const data = await profileRequest;
        const nextUser = normalizeProfile(data);
        cachedUser = nextUser;
        profileBlockedUntil = 0;
        hasLoggedProfileWarning = false;
        setUser(nextUser);
        return nextUser;
      } catch (err) {
        const fallbackUser = getFallbackUser();
        cachedUser = fallbackUser;
        setUser(fallbackUser);

        if (err.response?.status === 401) {
          cachedUser = null;
          localStorage.removeItem("token");
          navigate("/login");
        } else if (err.response?.status === 400) {
          profileBlockedUntil = Date.now() + PROFILE_RETRY_DELAY;
          if (!hasLoggedProfileWarning) {
            console.warn(
              "Profile is not available yet. Using token fallback until the profile is completed.",
            );
            hasLoggedProfileWarning = true;
          }
        } else if (!hasLoggedProfileWarning) {
          console.error("Failed to fetch profile:", err);
          hasLoggedProfileWarning = true;
        }

        return fallbackUser;
      } finally {
        setIsLoading(false);
      }
    },
    [navigate],
  );

  useEffect(() => {
    if (autoFetch) fetchUser();
  }, [autoFetch, fetchUser]);

  const updateProfile = async (profileData, profilePictureFile) => {
    setIsUpdating(true);
    try {
      await profileService.updateProfile(profileData, profilePictureFile);
      if (profileData.email) localStorage.setItem("userEmail", profileData.email);

      cachedUser = null;
      profileBlockedUntil = 0;
      await fetchUser({ force: true });
      return true;
    } catch (err) {
      if (err.response?.status === 401) {
        cachedUser = null;
        localStorage.removeItem("token");
        navigate("/login");
      }
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
