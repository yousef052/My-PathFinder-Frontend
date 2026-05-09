// src/features/auth/hooks/useVerifyOtp.js

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export const useVerifyOtp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const navigate = useNavigate();

  const isResetFlow = sessionStorage.getItem("is_password_reset") === "true";

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setError("يرجى إدخال الكود كاملاً (6 أرقام)");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    const email = sessionStorage.getItem("pending_email");

    try {
      if (isResetFlow) {
        // 💡 العودة للمنطق المطابق للـ Swagger:
        // لا يوجد API للتحقق هنا، لذا نحفظ الكود وننتقل فوراً لشاشة الباسورد الجديد
        sessionStorage.setItem("reset_token", code);
        navigate("/set-new-password");
      } else {
        // في حالة تسجيل حساب جديد (التأكيد العادي)
        await authService.confirmEmail({ email, otp: code });
        sessionStorage.removeItem("pending_email");
        navigate("/login");
      }
    } catch (err) {
      setError("كود التحقق غير صحيح أو منتهي الصلاحية.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    const email = sessionStorage.getItem("pending_email");
    if (!email) {
      setError("الإيميل مفقود، يرجى المحاولة من البداية.");
      return;
    }

    setResendLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (isResetFlow) {
        await authService.forgotPassword({ email });
      } else {
        await authService.resendOtp(email);
      }
      setSuccessMsg("تم إعادة إرسال الكود بنجاح.");
    } catch (err) {
      setError("فشل في إعادة الإرسال، حاول لاحقاً.");
    } finally {
      setResendLoading(false);
    }
  };

  return {
    otp,
    isLoading,
    resendLoading,
    error,
    successMsg,
    handleChange,
    handleVerify,
    handleResend,
  };
};
