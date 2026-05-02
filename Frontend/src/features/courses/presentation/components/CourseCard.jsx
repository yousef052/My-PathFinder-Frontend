// src/features/courses/presentation/components/CourseCard.jsx

import React, { useState } from "react";
import Button from "../../../../core/ui_components/Button"; // 💡 استيراد الزر

const CourseCard = ({ course, onEnroll }) => {
  // معالجة مسار الصورة لضمان ظهورها بشكل سليم
  const rawPic = course.thumbnailUrl || course.ThumbnailUrl;
  const finalThumbnail = rawPic
    ? rawPic.startsWith("http")
      ? rawPic
      : `https://pathfinder.tryasp.net${rawPic}`
    : null;

  // تحديد ما إذا كان الكورس مجانياً
  const isFree = course.price === 0 || course.price === null;

  // 💡 حالة التسجيل
  const [isEnrolling, setIsEnrolling] = useState(false);

  // 💡 دالة تنفيذ التسجيل
  const handleEnrollClick = async () => {
    if (onEnroll) {
      setIsEnrolling(true);
      const success = await onEnroll(course.id || course.Id || course.courseId);
      setIsEnrolling(false);
      if (success) {
        alert("تم التسجيل بنجاح! راجع صفحة My Learning.");
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col group cursor-pointer h-full">
      {/* صورة الكورس */}
      <div className="h-40 bg-gray-100 w-full relative overflow-hidden shrink-0">
        {finalThumbnail ? (
          <img
            src={finalThumbnail}
            alt={course.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl opacity-50">
            📚
          </div>
        )}

        {/* شارة السعر أو "مجاني" */}
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 text-xs font-black rounded-full text-primary shadow-sm">
          {isFree ? "Free" : `$${course.price}`}
        </span>

        {/* شارة مستوى الصعوبة */}
        {course.difficultyLevel && (
          <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur px-2 py-1 text-[10px] font-black rounded text-white uppercase tracking-wider">
            {course.difficultyLevel}
          </span>
        )}
      </div>

      {/* تفاصيل الكورس */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-2 h-14">
          {course.name || course.Name}
        </h3>

        <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">
          {course.description || course.Description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-4 font-bold">
          <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
            ⏱️ {course.durationHours || 0} Hours
          </span>
          <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md text-amber-600">
            ⭐ {course.rating ? Number(course.rating).toFixed(1) : "N/A"}
          </span>
        </div>
      </div>

      {/* 💡 زر التسجيل أسفل البطاقة */}
      <div className="p-4 border-t border-gray-50 bg-slate-50/50 mt-auto shrink-0">
        <Button
          onClick={handleEnrollClick}
          isLoading={isEnrolling}
          className="w-full py-2 text-xs font-bold shadow-lg shadow-primary/20"
        >
          Enroll Now
        </Button>
      </div>
    </div>
  );
};

export default CourseCard;
