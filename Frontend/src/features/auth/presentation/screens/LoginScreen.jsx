// src/features/auth/presentation/screens/LoginScreen.jsx
import React from "react";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useLogin } from "../../hooks/useLogin";

const LoginScreen = () => {
  const {
    formData,
    isLoading,
    error,
    handleChange,
    handleLogin,
    handleGoogleSuccess,
    handleGoogleError,
  } = useLogin();

  const inputCls = "w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-700 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10";

  return (
    <div className="flex min-h-screen items-center justify-center p-6 relative bg-slate-50">
      
      <div 
        className="w-full max-w-md p-10 sm:p-14 rounded-[3.5rem] bg-white shadow-2xl shadow-blue-100/50 border border-slate-100 relative z-10"
        style={{ animation: "animate-pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}
      >
        <div className="mb-12 text-center animate-fade-in-up">
          <div className="mx-auto mb-8 flex h-16 w-32 items-center justify-center rounded-2xl bg-slate-950 text-[10px] font-black uppercase tracking-[0.4em] text-white shadow-2xl">
            Identity
          </div>
          <h1 className="mb-3 text-4xl font-black tracking-tight text-slate-950 italic">Welcome</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            PathFinder Identity Portal
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded-2xl bg-red-50 p-4 text-center text-[10px] font-black uppercase tracking-widest text-red-500 border border-red-100 animate-shake">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Node</label>
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              placeholder="explorer@pathfinder.ai"
              className={inputCls}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Security Key</label>
              <Link to="/recover-password" title="Forgot Password" className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline">Lost access?</Link>
            </div>
            <input
              type="password"
              name="Password"
              value={formData.Password}
              onChange={handleChange}
              placeholder="••••••••"
              className={inputCls}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative mt-4 w-full py-5 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-200 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 overflow-hidden"
          >
            <span className="relative z-10">{isLoading ? "Synchronizing..." : "Initiate Login →"}</span>
          </button>
        </form>

        <div className="mt-12 space-y-8 text-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-300">Third-Party Auth</span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          <div className="flex justify-center hover:scale-105 transition-transform active:scale-95">
             <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                shape="pill"
                theme="outline"
                text="continue_with"
                width="100%"
              />
          </div>

          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            New to the path?{" "}
            <Link to="/signup" className="text-primary hover:underline font-black ml-1">Begin Journey</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
