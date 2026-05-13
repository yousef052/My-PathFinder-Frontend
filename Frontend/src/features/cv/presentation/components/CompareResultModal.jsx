// src/features/cv/presentation/components/CompareResultModal.jsx
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const Section = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b themed-border last:border-0 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 px-2 group transition-all"
      >
        <span className="text-xl font-black text-slate-900 group-hover:themed-text transition-colors">
          {title}
        </span>
        <motion.span 
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="themed-text opacity-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="pb-10 overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SkillTag = ({ text, type = "common" }) => (
  <motion.div 
    whileHover={{ scale: 1.1, rotate: 2 }}
    className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all cursor-default ${
      type === "common" 
        ? "themed-button shadow-lg" 
        : "bg-slate-100 text-slate-400"
    }`}
  >
    {text}
  </motion.div>
);

const CompareResultModal = ({ isOpen, result, onClose }) => {
  if (!isOpen || !result) return null;

  const data = typeof result === "string" ? {
    commonSkills: ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6"],
    uniqueSkills: ["Skill 7", "Skill 8", "Skill 9", "Skill 10"],
    summary: result,
    recommendedCv: "Andrew George CV",
    recommendationText: "Based on the comparison, this candidate shows exceptional alignment with the core technical requirements."
  } : result;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" 
          onClick={onClose} 
        />
        
        {/* Modal */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          className="relative w-full max-w-2xl bg-white rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] border-4 border-white overflow-hidden flex flex-col max-h-[92vh]"
        >
          
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-10 py-10 custom-scrollbar">
            
            <Section title="Synthesis Report">
              <div className="space-y-12">
                
                {/* Common Skills */}
                <div className="space-y-5">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Universal Alignment</h4>
                  <div className="flex flex-wrap gap-3">
                    {(data.commonSkills || ["React", "Node.js", "System Design"]).map((s, i) => (
                      <SkillTag key={i} text={s} type="common" />
                    ))}
                  </div>
                </div>

                {/* Unique Skills */}
                <div className="space-y-5">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Candidate Variance</h4>
                  <div className="flex flex-wrap gap-3">
                    {(data.uniqueSkills || ["AWS", "Docker", "Redux"]).map((s, i) => (
                      <SkillTag key={i} text={s} type="unique" />
                    ))}
                  </div>
                </div>
              </div>
            </Section>

            {/* Comparison Summary Box */}
            <div className="mt-10 p-10 rounded-[3rem] border-2 themed-border themed-bg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[var(--theme-color)]" />
              <div className="mb-4 text-[10px] font-black uppercase tracking-[0.4em] themed-text">
                AI Narrative Synthesis
              </div>
              <p className="text-sm font-medium leading-relaxed text-slate-600 italic">
                "{data.summary || "The comparison analysis reveals a strong overlap in core competencies, particularly in frontend architecture. However, the recommended profile exhibits superior proficiency in cloud-native technologies."}"
              </p>
            </div>

            {/* Recommended CV Box */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="mt-8 p-10 rounded-[3rem] themed-button shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 transition-transform group-hover:scale-150 duration-1000" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-xs font-black uppercase tracking-[0.4em]">Optimized Match</h4>
                  <span className="text-[9px] font-black italic bg-white/20 px-3 py-1 rounded-full">{data.recommendedCv || "Primary Candidate"}</span>
                </div>
                <p className="text-sm font-bold opacity-90 leading-relaxed tracking-tight">
                  {data.recommendationText || "This candidate is exceptionally suited for the Senior Developer role based on the matched skill density and architectural experience."}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Footer Actions */}
          <div className="p-8 border-t border-slate-50 flex justify-center bg-slate-50/30">
            <button
              onClick={onClose}
              className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-black transition-all shadow-xl active:scale-95"
            >
              Close Intelligence Feed
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default CompareResultModal;
