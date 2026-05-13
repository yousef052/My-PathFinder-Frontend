import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);

const ROLE_CLAIM =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

const decodeJwtPayload = (token) => {
  const payload = token?.split(".")?.[1];
  if (!payload) return null;

  const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
  const paddedBase64 = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "=",
  );

  return JSON.parse(atob(paddedBase64));
};

const getRoleFromToken = (token) => {
  try {
    const payload = decodeJwtPayload(token);
    if (!payload) return "User";

    // Check all values in the payload for "admin" just in case the claim name is unexpected
    const isAnyAdmin = Object.values(payload).some((val) => {
      if (typeof val === "string" && val.toLowerCase() === "admin") return true;
      if (Array.isArray(val) && val.some((v) => typeof v === "string" && v.toLowerCase() === "admin")) return true;
      return false;
    });

    if (isAnyAdmin) return "Admin";

    const role = payload[ROLE_CLAIM] || payload.role || payload.Role;
    if (Array.isArray(role)) return role[0] || "User";
    return role || "User";
  } catch (error) {
    return "User";
  }
};

const getInitialAuthState = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return { isAuthenticated: false, userRole: null };
  }

  try {
    return {
      isAuthenticated: true,
      userRole: getRoleFromToken(token),
    };
  } catch (error) {
    console.error("Token decoding failed:", error);
    return { isAuthenticated: false, userRole: null };
  }
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(getInitialAuthState);

  const checkAuthState = useCallback(() => {
    setAuthState(getInitialAuthState());
  }, []);

  useEffect(() => {
    checkAuthState();

    const handleStorageChange = (event) => {
      if (event.key === "token") checkAuthState();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [checkAuthState]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setAuthState({ isAuthenticated: false, userRole: null });
  }, []);

  const value = useMemo(() => {
    const normalizedRole = authState.userRole?.toString().toLowerCase();

    return {
      isAuthenticated: authState.isAuthenticated,
      userRole: authState.userRole,
      isAdmin: normalizedRole === "admin",
      refreshAuthState: checkAuthState,
      logout,
    };
  }, [authState, checkAuthState, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
