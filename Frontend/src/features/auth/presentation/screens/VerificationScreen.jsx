import React from "react";
import { useVerifyOtp } from "../../hooks/useVerifyOtp";

// ─── Main Screen ──────────────────────────────────────────────────────────────
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
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes pop {
          0%   { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1);   opacity: 1; }
        }
      `}</style>

      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div
          className="w-full max-w-md rounded-[3.5rem] border border-slate-100 bg-white p-12 text-center shadow-2xl shadow-blue-100/50"
          style={{ animation: "fadeSlideUp 0.5s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          {/* Icon */}
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-blue-50 text-4xl text-[var(--color-primary)] shadow-inner">
            {isResetFlow ? "🔑" : "✉️"}
          </div>

          <h1 className="mb-3 text-3xl font-black italic tracking-tight text-slate-900">
            {isResetFlow ? "Password Reset Code" : "Verify Email"}
          </h1>
          <p className="mb-10 text-[11px] font-bold uppercase tracking-widest text-slate-400 leading-relaxed">
            {isResetFlow
              ? "We've sent a 6-digit reset code to your email address."
              : "We've sent a 6-digit verification code to your email address."}
          </p>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-center text-xs font-black uppercase tracking-widest text-red-600 shadow-sm" style={{ animation: "fadeSlideUp 0.3s ease both" }}>
              ⚠️ {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-center text-xs font-black uppercase tracking-widest text-emerald-600 shadow-sm" style={{ animation: "fadeSlideUp 0.3s ease both" }}>
              ✅ {successMsg}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-10">
            {/* OTP Input Boxes */}
            <div className="flex justify-center gap-3 md:gap-4" dir="ltr">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  name="otp"
                  maxLength="1"
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onFocus={(e) => e.target.select()}
                  required
                  className="h-14 w-12 rounded-2xl border border-slate-200 bg-slate-50 text-center text-2xl font-black text-slate-900 outline-none transition-all duration-200 focus:border-[var(--color-primary)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(91,124,250,0.12)] md:h-16 md:w-14"
                  style={{ animation: `pop 0.3s cubic-bezier(0.16,1,0.3,1) both ${index * 60}ms` }}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-[var(--color-primary)] py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-200 transition duration-200 hover:bg-[var(--color-primary-hover)] active:scale-95 disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </button>
          </form>

          <div className="mt-8">
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              Didn't receive a code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="ml-1 text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {resendLoading ? "Sending..." : "Resend"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerificationScreen;
