// src/features/cv/presentation/components/CompareResultModal.jsx
import React, { useState } from "react";

const Section = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-purple-100 last:border-0 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 px-2 group transition-all"
      >
        <span className="text-xl font-black text-slate-900 group-hover:text-purple-600 transition-colors">
          {title}
        </span>
        <span className={`text-purple-400 transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </button>
      <div className={`transition-all duration-500 ease-in-out ${isOpen ? "max-h-[1000px] pb-10 opacity-100" : "max-h-0 opacity-0"}`}>
        {children}
      </div>
    </div>
  );
};

const SkillTag = ({ text, type = "common" }) => (
  <div className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:scale-110 cursor-default ${
    type === "common" 
      ? "bg-purple-500 text-white shadow-lg shadow-purple-100" 
      : "bg-slate-200 text-slate-500"
  }`}>
    {text}
  </div>
);

const CompareResultModal = ({ isOpen, result, onClose }) => {
  if (!isOpen || !result) return null;

  // Mock data structure matching the image if result is generic
  const data = typeof result === "string" ? {
    commonSkills: ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6"],
    uniqueSkills: ["Skill 7", "Skill 8", "Skill 9", "Skill 10"],
    summary: result,
    recommendedCv: "Andrew George CV",
    recommendationText: "Based on the comparison, this candidate shows exceptional alignment with the core technical requirements."
  } : result;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-fade-in" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border-4 border-purple-100 overflow-hidden flex flex-col max-h-[92vh] animate-pop">
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-10 py-8 custom-scrollbar">
          
          <Section title="Comparison Data">
            <div className="space-y-10">
              
              {/* Common Skills */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Common Skills</h4>
                <div className="flex flex-wrap gap-3">
                  {(data.commonSkills || ["React", "Node.js", "System Design"]).map((s, i) => (
                    <SkillTag key={i} text={s} type="common" />
                  ))}
                </div>
              </div>

              {/* Unique Skills */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Unique Skills</h4>
                <div className="flex flex-wrap gap-3">
                  {(data.uniqueSkills || ["AWS", "Docker", "Redux"]).map((s, i) => (
                    <SkillTag key={i} text={s} type="unique" />
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* Comparison Summary Box */}
          <div className="mt-8 p-10 rounded-[2rem] border-2 border-purple-200 bg-purple-50/10 relative">
            <div className="absolute -top-3 left-8 bg-white px-3 text-[10px] font-black uppercase tracking-widest text-purple-500">
              Comparison Summary
            </div>
            <p className="text-sm font-medium leading-relaxed text-slate-600">
              {data.summary || "The comparison analysis reveals a strong overlap in core competencies, particularly in frontend architecture. However, the recommended profile exhibits superior proficiency in cloud-native technologies."}
            </p>
          </div>

          {/* Recommended CV Box */}
          <div className="mt-6 p-10 rounded-[2.5rem] bg-purple-500 text-white shadow-xl shadow-purple-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-sm font-black uppercase tracking-widest">Recommended CV</h4>
                <span className="text-[10px] font-black italic">{data.recommendedCv || "Andrew George CV"}</span>
              </div>
              <p className="text-sm font-medium opacity-90 leading-relaxed">
                {data.recommendationText || "This candidate is exceptionally suited for the Senior Developer role based on the matched skill density."}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-slate-50 flex justify-center">
          <button
            onClick={onClose}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95"
          >
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareResultModal;
