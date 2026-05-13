// src/features/auth/hooks/useSignUp.js

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../core/context/AuthContext";
import { authService } from "../services/authService";

export const useSignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { refreshAuthState } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("كلمات المرور غير متطابقة.");
      setIsLoading(false);
      return;
    }

    try {
      await authService.register(formData);

      sessionStorage.setItem("pending_email", formData.email);
      sessionStorage.setItem("is_password_reset", "false");

      navigate("/verify-otp");
    } catch (err) {
      let backendError =
        err.response?.data?.message ||
        err.response?.data ||
        "حدث خطأ غير متوقع.";

      if (Array.isArray(err.response?.data)) {
        backendError = err.response.data[0]?.description || backendError;
      }

      if (typeof backendError === "string") {
        if (
          backendError.includes("غير ابجدي رقمي") ||
          backendError.includes("NonAlphanumeric")
        ) {
          setError(
            "كلمة المرور ضعيفة: يجب أن تحتوي على رمز خاص واحد على الأقل (مثل @, #, $, %).",
          );
        } else if (
          backendError.includes("Upper") ||
          backendError.includes("كبير")
        ) {
          setError(
            "كلمة المرور ضعيفة: يجب أن تحتوي على حرف إنجليزي كبير (A-Z).",
          );
        } else if (
          backendError.includes("Digit") ||
          backendError.includes("رقم")
        ) {
          setError(
            "كلمة المرور ضعيفة: يجب أن تحتوي على رقم واحد على الأقل (0-9).",
          );
        } else {
          setError(backendError);
        }
      } else {
        setError("فشل التسجيل، تأكد من صحة البيانات.");
      }
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
      const token = response?.token || response?.tokenValue || response;

      if (token) {
        localStorage.setItem("token", token);
        refreshAuthState();
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Google SignUp Error:", err.response?.data);
      setError("فشل إنشاء الحساب بواسطة جوجل، حاول مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("تم إلغاء عملية إنشاء الحساب بواسطة جوجل.");
  };

  return {
    formData,
    isLoading,
    error,
    handleChange,
    handleSignUp,
    handleGoogleSuccess,
    handleGoogleError,
  };
};
