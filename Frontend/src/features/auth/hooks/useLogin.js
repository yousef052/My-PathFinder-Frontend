import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../core/context/AuthContext";
import { authService } from "../services/authService";
import { clearProfileCache } from "../../profile/hooks/useProfile";

export const useLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { refreshAuthState } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 💡 دالة مساعدة لاصطياد التوكن أياً كان الهيكل القادم من الباك إند
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

      // استخراج التوكن بالدالة المساعدة
      const token = extractToken(response);

      // 💡 فحص هندسي صارم: يجب أن يكون نصاً طويلاً (وليس undefined أو object)
      if (token && typeof token === "string" && token.length > 20) {
        clearProfileCache();
        localStorage.setItem("token", token);
        refreshAuthState();
        navigate("/dashboard");
      } else {
        console.error("Failed to extract token. Response:", response);
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
      // 1. استخراج التوكن من رد جوجل
      const googleToken = credentialResponse.credential;

      // 2. تجهيز الـ Payload حسب الـ Swagger
      const requestData = {
        idToken: googleToken,
      };

      // 3. إرسال الطلب
      const response = await authService.googleLogin(requestData);

      // استخراج التوكن بالدالة المساعدة
      const token = extractToken(response);

      // فحص هندسي صارم قبل الحفظ
      if (token && typeof token === "string" && token.length > 20) {
        clearProfileCache();
        localStorage.setItem("token", token);
        refreshAuthState();
        navigate("/dashboard");
      } else {
        console.error("Failed to extract Google token. Response:", response);
        setError("فشل في قراءة بيانات حساب جوجل من الخادم.");
      }
    } catch (err) {
      console.error("Google Login Error:", err.response?.data);
      setError(
        "فشل تسجيل الدخول بواسطة جوجل، تأكد من اتصالك أو صلاحيات الحساب.",
      );
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
