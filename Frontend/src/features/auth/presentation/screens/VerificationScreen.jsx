// src/features/auth/presentation/screens/VerificationScreen.jsx
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F8F9FD] p-6">
      <div className="w-full max-w-md bg-white rounded-[3rem] p-12 shadow-2xl shadow-blue-100 border border-white animate-fade-in text-center">
        <div className="w-20 h-20 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto mb-8 text-3xl shadow-inner">
          ✉️
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-3">
          Verification Email
        </h1>
        <p className="text-gray-400 font-medium text-xs leading-relaxed mb-10 px-4">
          We've sent a 6-digit verification code to <br /> your email
          address.[cite: 11]
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100">
            ⚠️ {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 text-green-600 text-xs font-bold rounded-2xl border border-green-100">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-10">
          <div className="flex justify-between gap-2" dir="ltr">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
                className="w-12 h-14 text-center text-xl font-black text-primary bg-slate-50 border-2 border-transparent rounded-2xl focus:border-primary focus:bg-white outline-none transition-all shadow-sm"
              />
            ))}
          </div>
          <Button
            type="submit"
            isLoading={isLoading}
            fullWidth
            className="py-4"
          >
            Verify
          </Button>
        </form>

        <p className="mt-10 text-[10px] text-gray-400 font-black uppercase tracking-widest">
          Didn't receive code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading}
            className="text-primary hover:underline ml-1 uppercase"
          >
            {resendLoading ? "Sending..." : "Resend"}
          </button>
        </p>
      </div>
    </div>
  );
};
export default VerificationScreen;
