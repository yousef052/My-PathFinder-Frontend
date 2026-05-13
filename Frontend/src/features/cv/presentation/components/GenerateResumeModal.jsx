// src/features/cv/presentation/components/GenerateResumeModal.jsx
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../../../core/ui_components/Button";
import { useResumeBuilder } from "../../hooks/useResumeBuilder";

const GenerateResumeModal = ({ isOpen, onClose }) => {
  const { generateAndDownloadResume, isGenerating, error } = useResumeBuilder();
  const [formData, setFormData] = useState({
    targetJobTitle: "",
    style: "Professional",
    language: "English",
    additionalNotes: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.targetJobTitle) return;

    const success = await generateAndDownloadResume(formData);
    if (success) onClose();
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop with extreme blur and heavy fade */}
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80"
        />

        {/* Modal Container with bouncy entrance */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -5, y: 100 }}
          animate={{ scale: 1, opacity: 1, rotate: 0, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-[3rem] sm:rounded-[4rem] bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/20 flex flex-col max-h-[90vh]"
        >
          {/* Animated Header */}
          <motion.div 
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            className="p-8 md:p-12 border-b border-gray-50 bg-gradient-to-br from-[var(--color-primary)] via-indigo-600 to-purple-600 text-white text-center relative overflow-hidden"
          >
            {/* Animated Background Orbs */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"
            />
            <motion.div 
              animate={{ 
                scale: [1.2, 1, 1.2],
                rotate: [90, 0, 90],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/30 rounded-full blur-3xl"
            />

            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="text-6xl md:text-7xl block mb-4 filter drop-shadow-2xl"
            >
              📄
            </motion.span>
            <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase">
              AI Resume Builder
            </h2>
            <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-70 mt-2">
              Future-Ready Intelligence
            </p>
          </motion.div>

          {/* Form Content with extreme responsiveness */}
          <div className="p-8 md:p-12 space-y-8 overflow-y-auto custom-scrollbar">
            {error && (
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-xs font-black text-red-500 bg-red-50 p-5 rounded-[2rem] border border-red-100 text-center animate-shake"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <motion.div 
                whileFocus={{ scale: 1.02 }}
                className="space-y-3"
              >
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">
                  Target Job Title *
                </label>
                <input
                  required
                  value={formData.targetJobTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, targetJobTitle: e.target.value })
                  }
                  className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-base font-bold focus:bg-white focus:border-[var(--color-primary)] outline-none transition-all shadow-inner"
                  placeholder="e.g. Senior Software Engineer"
                />
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">
                    Visual Style
                  </label>
                  <select
                    value={formData.style}
                    onChange={(e) =>
                      setFormData({ ...formData, style: e.target.value })
                    }
                    className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-sm font-black outline-none focus:border-indigo-400 appearance-none cursor-pointer"
                  >
                    <option value="Professional">Professional</option>
                    <option value="Modern">Modern</option>
                    <option value="Creative">Creative</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">
                    Language
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) =>
                      setFormData({ ...formData, language: e.target.value })
                    }
                    className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-sm font-black outline-none focus:border-indigo-400 appearance-none cursor-pointer"
                  >
                    <option value="English">English</option>
                    <option value="Arabic">Arabic</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">
                  Specific Focus / Notes
                </label>
                <textarea
                  value={formData.additionalNotes}
                  onChange={(e) =>
                    setFormData({ ...formData, additionalNotes: e.target.value })
                  }
                  className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] text-sm font-medium h-32 resize-none outline-none focus:bg-white focus:border-purple-400 transition-all shadow-inner"
                  placeholder="Mention key projects or specific technologies you want to highlight..."
                />
              </div>

              <div className="pt-6 flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 0.95, opacity: 0.6 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-5 text-slate-400 font-black text-[11px] uppercase tracking-widest order-2 sm:order-1"
                >
                  Go Back
                </motion.button>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-[2] order-1 sm:order-2"
                >
                  <Button
                    type="submit"
                    isLoading={isGenerating}
                    className="w-full py-6 rounded-[2rem] bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200"
                  >
                    {isGenerating ? "Crafting..." : "Generate & Download"}
                  </Button>
                </motion.div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default GenerateResumeModal;
