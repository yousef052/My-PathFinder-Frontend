// src/features/auth/presentation/screens/SignUpScreen.jsx
import React from "react";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { motion, AnimatePresence } from "framer-motion";
import { useSignUp } from "../../hooks/useSignUp";

const SignUpScreen = () => {
  const {
    formData,
    isLoading,
    error,
    handleChange,
    handleSignUp,
    handleGoogleSuccess,
    handleGoogleError,
  } = useSignUp();

  const inputCls = "w-full rounded-[1.25rem] border border-slate-200 bg-slate-50 px-6 py-5 text-base font-bold text-slate-700 outline-none transition-all duration-300 focus:border-[var(--color-primary)] focus:bg-white focus:ring-8 focus:ring-[var(--color-primary)]/5 shadow-inner";

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 100 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring",
        damping: 20,
        stiffness: 100,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-8 relative bg-slate-50 overflow-hidden">
      
      {/* ─── Animated Background Orbs ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.3, 1, 1.3],
            x: [0, -50, 0],
            rotate: [0, -10, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[100px]" 
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl p-10 md:p-20 rounded-[4rem] bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/20 relative z-10"
      >
        <motion.div variants={itemVariants} className="mb-14 text-center">
          <motion.div 
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.8 }}
            className="mx-auto mb-10 flex h-20 w-40 items-center justify-center rounded-[1.5rem] bg-slate-950 text-[11px] font-black uppercase tracking-[0.5em] text-white shadow-2xl"
          >
            Onboarding
          </motion.div>
          <h1 className="mb-4 text-5xl md:text-6xl font-black tracking-tighter text-slate-950 italic uppercase leading-none">
            Join the Era
          </h1>
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">
            PathFinder Intelligence Protocol
          </p>
        </motion.div>

        {error && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-10 rounded-[2rem] bg-red-50 p-6 text-center text-[11px] font-black uppercase tracking-widest text-red-500 border-2 border-red-100 animate-shake shadow-lg shadow-red-100"
          >
            ⚠️ System Error: {error}
          </motion.div>
        )}

        <form onSubmit={handleSignUp} className="space-y-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <motion.div variants={itemVariants} className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-3">First Identity</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={inputCls} placeholder="John" disabled={isLoading} required />
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-3">Last Identity</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={inputCls} placeholder="Doe" disabled={isLoading} required />
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="space-y-3">
            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-3">System Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} className={inputCls} placeholder="johndoe_proto" disabled={isLoading} required />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-3">
            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-3">Neural Address (Email)</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputCls} placeholder="alex@pathfinder.ai" disabled={isLoading} required />
          </motion.div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <motion.div variants={itemVariants} className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-3">Access Key</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className={inputCls} placeholder="••••••••" disabled={isLoading} required />
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-3">Verify Key</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={inputCls} placeholder="••••••••" disabled={isLoading} required />
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="pt-8">
            <motion.button
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="relative w-full py-6 bg-[var(--color-primary)] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-indigo-200 transition-all disabled:opacity-50"
            >
              <span className="relative z-10">{isLoading ? "Synchronizing Protocols..." : "Initiate Onboarding ↗"}</span>
            </motion.button>
          </motion.div>
        </form>

        <motion.div variants={itemVariants} className="mt-16 space-y-10 text-center">
          <div className="flex items-center gap-6">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-300">Collaborative Entry</span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          <div className="flex justify-center transform hover:scale-110 transition-transform active:scale-95 shadow-2xl shadow-indigo-50 rounded-[2rem]">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                shape="pill"
                theme="outline"
                text="signup_with"
                width="100%"
              />
          </div>

          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
            Node already exists?{" "}
            <Link to="/login" className="text-[var(--color-primary)] hover:underline font-black ml-2">Access Portal</Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignUpScreen;
