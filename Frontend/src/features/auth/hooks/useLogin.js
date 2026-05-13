import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../core/context/AuthContext";
import { authService } from "../services/authService";
import { clearProfileCache } from "../../profile/hooks/useProfile";

export const useLogin = () => {
  const [formData, setFormData] = useState({ Email: "", Password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { refreshAuthState } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const extractToken = (response) => {
    if (!response) return null;
    if (typeof response === "string") return response;
    if (typeof response.data === "string") return response.data;
    if (response.data?.token) return response.data.token;
    if (response.data?.tokenValue) return response.data.tokenValue;
    if (response.token) return response.token;
    if (response.tokenValue) return response.tokenValue;
    return null;
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(formData);
      const token = extractToken(response);

      if (token && typeof token === "string" && token.length > 20) {
        clearProfileCache();
        localStorage.setItem("token", token);
        refreshAuthState();
        navigate("/dashboard");
      } else {
        setError("خطأ في قراءة بيانات الدخول من الخادم.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "بيانات الدخول غير صحيحة.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError(null);
    try {
      const googleToken = credentialResponse.credential;
      const response = await authService.googleLogin({ idToken: googleToken });
      const token = extractToken(response);

      if (token && typeof token === "string" && token.length > 20) {
        clearProfileCache();
        localStorage.setItem("token", token);
        refreshAuthState();
        navigate("/dashboard");
      } else {
        setError("فشل في قراءة بيانات حساب جوجل من الخادم.");
      }
    } catch (err) {
      setError("فشل تسجيل الدخول بواسطة جوجل.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("تم إلغاء عملية تسجيل الدخول بواسطة جوجل.");
  };

  return {
    formData,
    isLoading,
    error,
    handleChange,
    handleLogin,
    handleGoogleSuccess,
    handleGoogleError,
  };
};
