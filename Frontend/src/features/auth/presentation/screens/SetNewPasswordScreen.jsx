import React from "react";
import { useResetPassword } from "../../hooks/useResetPassword";
import { Link } from "react-router-dom";

const inputCls =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-bold text-slate-700 outline-none transition duration-200 focus:border-[var(--color-primary)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(91,124,250,0.08)]";

const Field = ({ label, required, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-[11px] font-black uppercase tracking-widest text-slate-500">
      {label}{required && <span className="ml-0.5 text-red-400">*</span>}
    </span>
    {children}
  </label>
);

const SetNewPasswordScreen = () => {
  const { formData, isLoading, error, handleChange, handleReset } = useResetPassword();

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>

      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div
          className="w-full max-w-md rounded-[3.5rem] border border-slate-100 bg-white p-10 shadow-2xl shadow-blue-100/50 sm:p-12"
          style={{ animation: "fadeSlideUp 0.5s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          {/* Icon */}
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-blue-50 text-4xl text-[var(--color-primary)] shadow-inner">
            🔐
          </div>

          <div className="mb-10 text-center">
            <h1 className="mb-2 text-3xl font-black italic tracking-tight text-slate-900">
              New Password
            </h1>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Please enter your new secure password
            </p>
          </div>

          {error && (
            <div className="mb-8 rounded-2xl border border-red-100 bg-red-50 p-4 text-center text-xs font-black uppercase tracking-widest text-red-600 shadow-sm leading-relaxed" style={{ animation: "fadeSlideUp 0.3s ease both" }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-5">
            <Field label="New Password" required>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={inputCls}
                required
                disabled={isLoading}
              />
            </Field>

            <Field label="Confirm New Password" required>
              <input
                type="password"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={inputCls}
                required
                disabled={isLoading}
              />
            </Field>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-[var(--color-primary)] py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-200 transition duration-200 hover:bg-[var(--color-primary-hover)] active:scale-95 disabled:opacity-50"
              >
                {isLoading ? "Updating Password..." : "Update Password"}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Remembered your old password?{" "}
              <Link to="/login" className="ml-1 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SetNewPasswordScreen;
