import React from "react";
import { useVerifyOtp } from "../../hooks/useVerifyOtp";
import Button from "../../../../core/ui_components/Button";

const VerificationScreen = () => {
  const {
    otp,
    isLoading,
    resendLoading,
    error,
    successMsg,
    handleChange,
    handleVerify,
    handleResend,
  } = useVerifyOtp();

  const isResetFlow = sessionStorage.getItem("is_password_reset") === "true";

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F8F9FD] p-6">
      <div className="w-full max-w-md bg-white rounded-[3rem] p-12 shadow-2xl shadow-blue-100 border border-white animate-fade-in text-center">
        <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl shadow-sm">
          {isResetFlow ? "🔑" : "✉️"}
        </div>

        <h1 className="text-2xl font-black text-gray-900 mb-2">
          {isResetFlow ? "Password Reset Code" : "Verification Email"}
        </h1>

        <p className="text-gray-400 font-medium text-xs leading-relaxed mb-8">
          {isResetFlow
            ? "We've sent a 6-digit reset code to your email address."
            : "We've sent a 6-digit verification code to your email address."}
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100 text-center animate-shake">
            ⚠️ {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 text-green-600 text-xs font-bold rounded-2xl border border-green-100 text-center">
            ✅ {successMsg}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-8">
          <div className="flex justify-center gap-2 md:gap-4" dir="ltr">
            {otp.map((data, index) => (
              <input
                className="w-10 h-12 md:w-12 md:h-14 text-center text-lg md:text-xl font-black text-gray-900 bg-slate-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                type="text"
                name="otp"
                maxLength="1"
                key={index}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
                required
              />
            ))}
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            fullWidth
            className="py-4 mt-6 font-bold tracking-wider"
          >
            VERIFY
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[11px] text-gray-400 font-black uppercase">
            Didn't receive code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading}
              className="text-primary hover:underline ml-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendLoading ? "Sending..." : "Resend"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerificationScreen;
