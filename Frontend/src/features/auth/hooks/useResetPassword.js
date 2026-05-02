// src/features/auth/hooks/useResetPassword.js

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export const useResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError("كلمات المرور غير متطابقة.");
      setIsLoading(false);
      return;
    }

    const email = sessionStorage.getItem("pending_email");
    const otpCode = sessionStorage.getItem("reset_token");

    if (!email || !otpCode) {
      setError("بيانات الجلسة مفقودة. يرجى العودة لطلب كود جديد.");
      setIsLoading(false);
      return;
    }

    // 💡 التعديل الحاسم: استخدام otp لأن الباك إند يطلبه بالاسم
    const requestData = {
      email: email.trim(),
      otp: otpCode.trim(), // 👈 تم إعادتها إلى otp
      newPassword: formData.newPassword,
      confirmNewPassword: formData.confirmNewPassword,
    };

    try {
      await authService.resetPassword(requestData);
      sessionStorage.clear();
      alert("تم تغيير كلمة المرور بنجاح!");
      navigate("/login");
    } catch (err) {
      console.error("Reset Password Error:", err.response?.data);

      let backendError = "حدث خطأ أثناء تغيير كلمة المرور.";
      const data = err.response?.data;

      if (data) {
        if (typeof data === "string") backendError = data;
        else if (data.message) backendError = data.message;
        else if (data.errors && typeof data.errors === "object") {
          const firstErrorKey = Object.keys(data.errors)[0];
          backendError = data.errors[firstErrorKey][0];
        } else if (Array.isArray(data)) {
          backendError = data[0]?.description || backendError;
        }
      }

      setError(String(backendError));
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, isLoading, error, handleChange, handleReset };
};
