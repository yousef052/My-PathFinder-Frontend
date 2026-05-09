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
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col group cursor-pointer h-full relative">
      <div className="h-40 bg-gray-100 w-full relative overflow-hidden shrink-0">
        {finalThumbnail ? (
          <img
            src={finalThumbnail}
            alt={course?.name || "Course"}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl opacity-50">
            📚
          </div>
        )}

        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 text-xs font-black rounded-full text-[#5b7cfa] shadow-sm z-10">
          {isFree ? "Free" : `$${course?.price}`}
        </span>

        <button
          onClick={handleSaveClick}
          disabled={isSaving}
          className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 ${
            isSaved 
              ? "bg-[#5b7cfa] text-white shadow-lg shadow-blue-100" 
              : "bg-white/90 text-gray-400 hover:text-[#5b7cfa]"
          }`}
        >
          {isSaving ? (
            <div className="w-3 h-3 border-2 border-current border-t-transparent animate-spin rounded-full" />
          ) : isSaved ? "🔖" : "📑"}
        </button>

        {course?.difficultyLevel && (
          <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur px-2 py-1 text-[10px] font-black rounded text-white uppercase tracking-wider z-10">
            {course.difficultyLevel}
          </span>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-2 h-14">
          {course?.name || course?.Name || "Untitled Course"}
        </h3>

        <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">
          {course?.description || course?.Description || "No description available."}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-4 font-bold">
          <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
            ⏱️ {course?.durationHours || 0} Hours
          </span>
          <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md text-amber-600">
            ⭐ {course?.rating ? Number(course.rating).toFixed(1) : "N/A"}
          </span>
        </div>
      </div>

      <div className="p-4 border-t border-gray-50 bg-slate-50/50 mt-auto shrink-0">
        <Button
          onClick={handleEnrollClick}
          isLoading={isEnrolling}
          className="w-full py-2 text-xs font-bold shadow-lg shadow-blue-100"
        >
          Enroll Now
        </Button>
      </div>
    </div>
  );
};

export default CourseCard;
