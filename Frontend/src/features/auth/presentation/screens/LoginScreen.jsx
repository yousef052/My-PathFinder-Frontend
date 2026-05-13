// src/features/auth/presentation/screens/LoginScreen.jsx
import React from "react";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { motion, AnimatePresence } from "framer-motion";
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

  const inputCls = "w-full rounded-[1.25rem] border border-slate-200 bg-slate-50 px-6 py-5 text-base font-bold text-slate-700 outline-none transition-all duration-300 focus:border-[var(--color-primary)] focus:bg-white focus:ring-8 focus:ring-[var(--color-primary)]/5 shadow-inner";

  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-8 relative bg-slate-50 overflow-hidden">
      
      {/* ─── Animated Background Orbs ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[100px]" 
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl p-10 md:p-20 rounded-[4rem] bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-white/20 relative z-10"
      >
        <div className="mb-14 text-center">
          <motion.div 
            whileHover={{ rotate: 180, scale: 1.1 }}
            className="mx-auto mb-10 flex h-20 w-32 items-center justify-center rounded-[1.5rem] bg-slate-950 text-[11px] font-black uppercase tracking-[0.5em] text-white shadow-2xl"
          >
            Portal
          </motion.div>
          <h1 className="mb-4 text-5xl md:text-6xl font-black tracking-tighter text-slate-950 italic uppercase leading-none">
            Welcome Back
          </h1>
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">
            Access PathFinder Protocol
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="mb-10 rounded-[2rem] bg-red-50 p-6 text-center text-[11px] font-black uppercase tracking-widest text-red-500 border-2 border-red-100 animate-shake shadow-lg shadow-red-100"
          >
            ⚠️ {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-3">Neural Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="explorer@pathfinder.ai"
              className={inputCls}
              required
              disabled={isLoading}
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <div className="flex justify-between items-center px-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Security Key</label>
              <Link to="/recover-password" title="Forgot Password" className="text-[9px] font-black uppercase tracking-widest text-[var(--color-primary)] hover:underline">Lost access?</Link>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={inputCls}
              required
              disabled={isLoading}
            />
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="relative w-full py-6 bg-[var(--color-primary)] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-indigo-100 transition-all disabled:opacity-50"
          >
            <span className="relative z-10">{isLoading ? "Synchronizing..." : "Initiate Login →"}</span>
          </motion.button>
        </form>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 space-y-10 text-center"
        >
          <div className="flex items-center gap-6">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-300">Third-Party Auth</span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          <div className="flex justify-center transform hover:scale-110 transition-transform active:scale-95 shadow-2xl shadow-indigo-50 rounded-[2rem]">
             <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                shape="pill"
                theme="outline"
                text="continue_with"
                width="100%"
              />
          </div>

          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
            New to the path?{" "}
            <Link to="/signup" className="text-[var(--color-primary)] hover:underline font-black ml-2">Begin Journey</Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
