// src/features/auth/hooks/useForgotPassword.js

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export const useForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleForgot = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await authService.forgotPassword({ email });
      // حفظ الإيميل وتحديد نوع العملية
      sessionStorage.setItem("pending_email", email);
      sessionStorage.setItem("is_password_reset", "true");
      navigate("/verify-email");
    } catch (err) {
      setError(err.response?.data?.message || "فشل في إرسال كود التحقق.");
    } finally {
      setIsLoading(false);
    }
  };

  return { email, setEmail, isLoading, error, handleForgot };
};
