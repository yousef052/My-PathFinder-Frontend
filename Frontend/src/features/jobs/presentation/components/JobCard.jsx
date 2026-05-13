// src/features/jobs/presentation/components/JobCard.jsx
import React, { useState } from "react";
import Button from "../../../../core/ui_components/Button";
import { useSavedJobs } from "../../hooks/useSavedJobs";

const JobCard = ({ job, isAdmin, onDelete, onApply, isSaved: initialIsSaved, savedId: initialSavedId }) => {
  const { toggleSaveJob } = useSavedJobs();
  const [isApplying, setIsApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [savedId, setSavedId] = useState(initialSavedId);
  const [isSaving, setIsSaving] = useState(false);

  const handleApplyClick = async (e) => {
    if (e) e.stopPropagation();
    setIsApplying(true);
    if (job.externalUrl) {
      if (onApply) {
        await onApply(job.id || job.jobId, "External Application Link Clicked");
      }
      window.open(job.externalUrl, "_blank");
      setIsApplying(false);
      return;
    }

    if (onApply) {
      const success = await onApply(job.id || job.jobId);
      setIsApplying(false);
      if (success) {
        alert("Application sent successfully! Check 'My Applications'.");
      }
    } else {
      setIsApplying(false);
      alert("Application details not available.");
    }
  };

  const handleSaveClick = async (e) => {
    if (e) e.stopPropagation();
    setIsSaving(true);
    const result = await toggleSaveJob(job.id || job.jobId, isSaved ? savedId : null);
    if (!result.error) {
      setIsSaved(!isSaved);
      if (result.saved) {
        setSavedId(result.data?.id || result.data?.savedJobId);
      } else {
        setSavedId(null);
      }
    }
    setIsSaving(false);
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-glass hover:shadow-2xl hover:bg-white transition-all duration-700 flex flex-col h-full group relative hover:-translate-y-2">
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1 pr-10">
          <div className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-primary mb-3">Active Signal</div>
          <h3 className="font-black text-xl text-slate-900 italic tracking-tight line-clamp-2 leading-tight" title={job?.jobTitle || job?.title}>
            {job?.jobTitle || job?.title || "Untitled Position"}
          </h3>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mt-2">
            {job?.companyName || "External Provider"}
          </p>
        </div>

        <div className="flex items-start gap-2 absolute top-8 right-8">
          {!isAdmin && (
            <button
              onClick={handleSaveClick}
              disabled={isSaving}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                isSaved 
                  ? "bg-primary text-white shadow-primary/20 scale-110" 
                  : "bg-slate-50 text-slate-300 hover:text-primary hover:bg-white"
              }`}
            >
              {isSaving ? (
                <div className="w-3 h-3 border-2 border-current border-t-transparent animate-spin rounded-full" />
              ) : isSaved ? "🔖" : "📑"}
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => onDelete?.(job?.id)}
              className="text-slate-300 hover:text-red-500 bg-slate-50 hover:bg-red-50 w-10 h-10 flex items-center justify-center rounded-2xl transition-all shadow-sm"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <div className="bg-slate-50 text-slate-500 text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl border border-slate-100 flex items-center gap-2">
          <span className="opacity-50">📍</span> {job?.location || "Global"}
        </div>
        <div className="bg-slate-50 text-slate-500 text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl border border-slate-100 flex items-center gap-2">
          <span className="opacity-50">💼</span> {job?.jobType || "Full-time"}
        </div>
        {job?.experienceLevel && (
          <div className="bg-slate-50 text-slate-500 text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl border border-slate-100 flex items-center gap-2">
            <span className="opacity-50">📈</span> {job?.experienceLevel}
          </div>
        )}
      </div>

      <p className="text-sm font-medium text-slate-500 leading-relaxed line-clamp-3 mb-8 flex-1">
        {job?.description || "Curated professional opportunity synthesized for your specific trajectory node."}
      </p>

      <div className="mt-auto flex justify-between items-center border-t border-slate-100 pt-6">
        <div className="flex flex-col">
          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Stipend / Value</p>
          <div className="text-xs font-black text-slate-900">
            {job?.salaryMin && job?.salaryMax
              ? `$${job.salaryMin.toLocaleString()} — $${job.salaryMax.toLocaleString()}`
              : "Competitive Yield"}
          </div>
        </div>

        <button
          className="bg-primary text-white text-[9px] py-3 px-8 uppercase tracking-[0.2em] font-black rounded-2xl shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
          onClick={handleApplyClick}
          disabled={isApplying}
        >
          {isApplying ? "Engaging..." : job.externalUrl ? "External ↗" : "Integrate"}
        </button>
      </div>
    </div>
  );
};

export default JobCard;
