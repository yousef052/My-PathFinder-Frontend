// src/features/jobs/presentation/components/JobCard.jsx

import React, { useState } from "react";
import Button from "../../../../core/ui_components/Button";

const JobCard = ({ job, isAdmin, onDelete, onApply }) => {
  const [isApplying, setIsApplying] = useState(false); // 💡 تتبع حالة الـ Loading للزر

  const handleApplyClick = async () => {
    // 1. إذا كانت الوظيفة لها رابط خارجي، نفتح الرابط
    if (job.externalUrl) {
      window.open(job.externalUrl, "_blank");
      return;
    }

    // 2. إذا كانت تقديم داخلي في المنصة
    if (onApply) {
      setIsApplying(true);
      const success = await onApply(job.id || job.jobId);
      setIsApplying(false);

      if (success) {
        alert("تم إرسال طلب التقديم بنجاح! راجع قسم My Applications.");
      }
    } else {
      alert("تفاصيل التقديم غير متاحة حالياً.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all flex flex-col h-full group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3
            className="font-bold text-lg text-gray-800 line-clamp-1"
            title={job.jobTitle}
          >
            {job.jobTitle}
          </h3>
          <p className="text-sm text-[#5b7cfa] font-medium mt-1">
            {job.companyName}
          </p>
        </div>

        {isAdmin ? (
          <button
            onClick={() => onDelete(job.id)}
            className="text-gray-300 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-2 rounded-lg transition-colors"
            title="حذف الوظيفة"
          >
            🗑️
          </button>
        ) : job.matchPercentage ? (
          <span className="bg-green-50 text-green-600 text-xs font-bold px-2 py-1 rounded-lg">
            {job.matchPercentage}% Match
          </span>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="bg-gray-100 text-gray-600 text-[11px] font-bold px-2 py-1 rounded-md flex items-center">
          📍 {job.location || "Remote"}
        </span>
        <span className="bg-gray-100 text-gray-600 text-[11px] font-bold px-2 py-1 rounded-md flex items-center">
          💼 {job.jobType || "Full-time"}
        </span>
        {job.experienceLevel && (
          <span className="bg-gray-100 text-gray-600 text-[11px] font-bold px-2 py-1 rounded-md flex items-center">
            📈 {job.experienceLevel}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-1">
        {job.description}
      </p>

      <div className="mt-auto flex justify-between items-center border-t border-gray-100 pt-4">
        <div className="text-xs font-black text-gray-700 bg-slate-50 px-3 py-1.5 rounded-lg">
          {job.salaryMin && job.salaryMax
            ? `$${job.salaryMin} - $${job.salaryMax}`
            : "Salary not specified"}
        </div>

        {/* 💡 زر التقديم الذي يستدعي الـ API */}
        <Button
          variant="primary"
          className="shadow-lg shadow-primary/20 text-xs py-2 px-4"
          onClick={handleApplyClick}
          isLoading={isApplying}
        >
          {job.externalUrl ? "Apply Externally ↗" : "Apply Now"}
        </Button>
      </div>
    </div>
  );
};

export default JobCard;
