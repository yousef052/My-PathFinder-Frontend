// src/features/courses/presentation/components/CourseCard.jsx
import React, { useState } from "react";
import Button from "../../../../core/ui_components/Button";
import { resolveMediaUrl } from "../../../../core/utils/mediaUrl";
import { useSavedCourses } from "../../hooks/useSavedCourses";

const CourseCard = ({ course, onEnroll, isSaved: initialIsSaved, savedId: initialSavedId }) => {
  const { toggleSaveCourse } = useSavedCourses();
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [savedId, setSavedId] = useState(initialSavedId);
  const [isSaving, setIsSaving] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  const rawPic = course?.thumbnailUrl || course?.ThumbnailUrl;
  const finalThumbnail = resolveMediaUrl(rawPic);
  const isFree = course?.price === 0 || course?.price === null;

  const handleEnrollClick = async (e) => {
    if (e) e.stopPropagation();
    if (onEnroll) {
      setIsEnrolling(true);
      await onEnroll(course?.id || course?.Id || course?.courseId);
      setIsEnrolling(false);
    }
  };

  const handleSaveClick = async (e) => {
    if (e) e.stopPropagation();
    setIsSaving(true);
    const result = await toggleSaveCourse(course?.id || course?.courseId, isSaved ? savedId : null);
    if (!result.error) {
      setIsSaved(!isSaved);
      if (result.saved) {
        setSavedId(result.data?.id || result.data?.savedCourseId);
      } else {
        setSavedId(null);
      }
    }
    setIsSaving(false);
  };

  return (
    <div className="premium-card group cursor-pointer h-full relative flex flex-col bg-white overflow-hidden">
      <div className="h-52 bg-slate-100 w-full relative overflow-hidden shrink-0">
        {finalThumbnail ? (
          <img
            src={finalThumbnail}
            alt={course?.name || "Course"}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-40 group-hover:scale-125 transition-transform duration-1000 bg-gradient-to-br from-primary/5 to-secondary/10">
            📚
          </div>
        )}

        <div className="absolute top-4 right-4 z-10">
          <span className="bg-white/95 backdrop-blur-xl px-5 py-2.5 text-[11px] font-black rounded-2xl text-primary shadow-xl border border-white/40">
            {isFree ? "COMPLIMENTARY" : `$${course?.price}`}
          </span>
        </div>

        <button
          onClick={handleSaveClick}
          disabled={isSaving}
          className={`absolute top-4 left-4 w-12 h-12 rounded-2xl flex items-center justify-center transition-all z-10 backdrop-blur-xl border border-white/40 ${
            isSaved 
              ? "bg-primary text-white shadow-2xl shadow-primary/20" 
              : "bg-white/80 text-slate-400 hover:text-primary hover:scale-110 shadow-lg"
          }`}
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
          ) : (
            <span className="text-xl">{isSaved ? "🔖" : "📑"}</span>
          )}
        </button>

        <div className="absolute bottom-4 left-4 flex gap-2">
          {course?.difficultyLevel && (
            <span className="bg-neutral-900/80 backdrop-blur-xl px-4 py-2 text-[10px] font-black rounded-xl text-white uppercase tracking-widest z-10 shadow-2xl">
              {course.difficultyLevel}
            </span>
          )}
        </div>
      </div>

      <div className="p-8 flex-1 flex flex-col bg-white">
        <div className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary-dark opacity-60">
          <span>{course?.instructor || "Professional Mentor"}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300"></span>
          <span>Curated Path</span>
        </div>
        
        <h3 className="font-black text-2xl text-slate-900 mb-3 line-clamp-2 leading-tight tracking-tight group-hover:text-primary transition-colors">
          {course?.name || course?.Name || "Untitled Course"}
        </h3>

        <p className="text-sm font-medium text-slate-500 mb-8 line-clamp-2 flex-1 leading-relaxed">
          {course?.description || course?.Description || "Master these professional skills with expert-led training."}
        </p>

        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest border-t border-slate-100 pt-6">
          <div className="flex items-center gap-2.5 bg-primary-lightest/50 px-4 py-2 rounded-2xl text-primary">
            <span className="text-lg opacity-80">⏱️</span> {course?.durationHours || 12}H
          </div>
          <div className="flex items-center gap-2.5 bg-warning/10 px-4 py-2 rounded-2xl text-warning-dark">
            <span className="text-lg">⭐</span> {course?.rating ? Number(course.rating).toFixed(1) : "4.9"}
          </div>
        </div>
      </div>

      <div className="p-8 bg-neutral-50/50 mt-auto shrink-0">
        <Button
          onClick={handleEnrollClick}
          isLoading={isEnrolling}
          fullWidth
          className="shadow-primary hover:shadow-2xl transition-all !py-5 !rounded-[1.5rem]"
          variant="primary"
        >
          Enroll in Path 🚀
        </Button>
      </div>
    </div>

  );
};

export default CourseCard;
