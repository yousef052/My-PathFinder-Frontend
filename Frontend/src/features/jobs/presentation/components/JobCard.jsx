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
    <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all flex flex-col h-full group relative">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 pr-8">
          <h3 className="font-bold text-lg text-gray-800 line-clamp-1" title={job?.jobTitle || job?.title}>
            {job?.jobTitle || job?.title || "Untitled Position"}
          </h3>
          <p className="text-sm text-[#5b7cfa] font-medium mt-1">
            {job?.companyName || "External Provider"}
          </p>
        </div>

        <div className="flex items-start gap-2 absolute top-6 right-6">
          {!isAdmin && (
            <button
              onClick={handleSaveClick}
              disabled={isSaving}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                isSaved 
                  ? "bg-blue-50 text-[#5b7cfa] shadow-sm" 
                  : "bg-gray-50 text-gray-300 hover:text-[#5b7cfa]"
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
              className="text-gray-300 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-2 rounded-lg transition-colors"
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="bg-gray-50 text-gray-600 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border border-slate-100">
          📍 {job?.location || "Remote"}
        </span>
        <span className="bg-gray-50 text-gray-600 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border border-slate-100">
          💼 {job?.jobType || "Full-time"}
        </span>
        {job?.experienceLevel && (
          <span className="bg-gray-50 text-gray-600 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border border-slate-100">
            📈 {job?.experienceLevel}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-1">
        {job?.description || "No description available."}
      </p>

      <div className="mt-auto flex justify-between items-center border-t border-gray-100 pt-4">
        <div className="text-[10px] font-black text-gray-700 bg-slate-50 px-3 py-2 rounded-xl">
          {job?.salaryMin && job?.salaryMax
            ? `$${job.salaryMin} - $${job.salaryMax}`
            : "Salary Undisclosed"}
        </div>

        <Button
          variant="primary"
          className="shadow-lg shadow-blue-100 text-[10px] py-2 px-6 uppercase tracking-widest font-black"
          onClick={handleApplyClick}
          isLoading={isApplying}
        >
          {job.externalUrl ? "External ↗" : "Apply"}
        </Button>
      </div>
    </div>
  );
};

export default JobCard;
