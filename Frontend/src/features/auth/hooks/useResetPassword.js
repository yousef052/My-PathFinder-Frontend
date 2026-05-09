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
      setError("بيانات الجلسة مفقودة. جاري تحويلك لطلب كود جديد...");
      setTimeout(() => navigate("/recover-password"), 2500);
      setIsLoading(false);
      return;
    }

    // تجهيز الـ Payload حسب متطلبات Swagger
    const requestData = {
      email: email.trim(),
      otp: otpCode.trim(),
      newPassword: formData.newPassword,
      confirmNewPassword: formData.confirmNewPassword,
    };

    try {
      await authService.resetPassword(requestData);
      sessionStorage.clear();
      alert("تمت العملية! تم تغيير كلمة المرور بنجاح.");
      navigate("/login");
    } catch (err) {
      let backendError = "حدث خطأ أثناء تغيير كلمة المرور.";
      const data = err.response?.data;

      if (data) {
        if (typeof data === "string") backendError = data;
        else if (data.message) backendError = data.message;
        else if (data.errors) {
          const firstKey = Object.keys(data.errors)[0];
          backendError = data.errors[firstKey][0];
        } else if (Array.isArray(data)) {
          backendError = data[0]?.description || backendError;
        }
      }

      const errorStr = String(backendError).toLowerCase();

      if (errorStr.includes("nonalphanumeric")) {
        setError("كلمة المرور يجب أن تحتوي على رمز خاص (@, #, $).");
      } else if (errorStr.includes("upper")) {
        setError("كلمة المرور يجب أن تحتوي على حرف كبير (A-Z).");
      } else if (errorStr.includes("digit")) {
        setError("كلمة المرور يجب أن تحتوي على رقم واحد على الأقل.");
      } else if (errorStr.includes("otp") || errorStr.includes("expired")) {
        setError("عذراً، انتهت صلاحية الكود. يرجى طلب كود جديد.");
        sessionStorage.removeItem("reset_token");
        setTimeout(() => navigate("/recover-password"), 3500);
      } else {
        setError(String(backendError));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, isLoading, error, handleChange, handleReset };
};
