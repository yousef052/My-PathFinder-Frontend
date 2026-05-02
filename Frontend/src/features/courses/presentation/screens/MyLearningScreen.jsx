// src/features/courses/presentation/screens/MyLearningScreen.jsx
import React, { useEffect } from "react";
import { useCourseProgress } from "../../hooks/useCourseProgress";
import Button from "../../../../core/ui_components/Button";
import { Link } from "react-router-dom";

const MyLearningScreen = () => {
  const {
    userProgress,
    isLoading,
    error,
    fetchMyProgress,
    updateCourseProgress,
    dropCourse,
  } = useCourseProgress();

  useEffect(() => {
    fetchMyProgress();
  }, [fetchMyProgress]);

  const handleDrop = async (item) => {
    // 💡 البحث عن الـ ID الصحيح أياً كان مسماه لضمان استقرار الطلب
    const pId = item.id || item.progressId || item.userCourseId;
    if (!pId) return alert("Error: Progress ID not found.");

    if (
      window.confirm(
        "Are you sure you want to drop this course? Your progress will be lost.",
      )
    ) {
      await dropCourse(pId);
    }
  };

  const handleNextLesson = async (item) => {
    const pId = item.id || item.progressId || item.userCourseId;

    // 💡 الإصلاح الجوهري: نرسل الرقم 1 فقط (درس واحد جديد مكتمل)
    // السيرفر مبرمج على إضافة هذه القيمة إلى ما لديه في قاعدة البيانات
    const incrementValue = 1;

    // حماية إضافية لعدم تجاوز عدد الدروس الكلي
    if (item.completedLessons >= item.totalLessons) {
      return alert("You have already completed all lessons in this course!");
    }

    await updateCourseProgress(
      pId,
      incrementValue,
      "Successfully completed a new lesson",
    );
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Header Section */}
      <div className="bg-white p-10 rounded-[3rem] border border-white shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            My Learning Journey
          </h2>
          <p className="text-gray-400 font-medium text-[10px] mt-1 uppercase tracking-[0.2em] px-1">
            Track your professional growth
          </p>
        </div>
        <Link
          to="/courses"
          className="bg-blue-50 text-[#5b7cfa] px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#5b7cfa] hover:text-white transition-all shadow-sm"
        >
          Explore More
        </Link>
      </div>

      {error && (
        <div className="p-5 bg-red-50 text-red-600 rounded-3xl font-black text-center border-2 border-red-100 animate-shake">
          ⚠️ {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5b7cfa]"></div>
        </div>
      ) : userProgress.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[3rem] border border-white shadow-sm">
          <span className="text-6xl block mb-6 opacity-20">🎓</span>
          <h3 className="text-xl font-black text-gray-700">
            You haven't started any courses yet.
          </h3>
          <Link to="/courses">
            <Button className="mt-8 px-10 shadow-lg shadow-blue-100">
              Browse Catalog
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {userProgress.map((prog, index) => {
            const currentId =
              prog.id || prog.progressId || prog.userCourseId || index;

            // حساب النسبة المئوية بدقة مع حمايتها من تجاوز الـ 100%[cite: 37]
            const completed = prog.completedLessons || 0;
            const total = prog.totalLessons || 1;
            const percentage = Math.min(
              Math.round((completed / total) * 100),
              100,
            );

            return (
              <div
                key={currentId}
                className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col group hover:shadow-xl transition-all h-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-blue-50 text-[#5b7cfa] rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                    📚
                  </div>
                  <button
                    onClick={() => handleDrop(prog)}
                    className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    title="Drop Course"
                  >
                    ✕
                  </button>
                </div>

                <h3 className="font-black text-gray-900 text-lg mb-2 line-clamp-2 leading-tight h-14">
                  {prog.courseName || prog.course?.name || "Course Title"}
                </h3>

                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-6">
                  {completed} / {total} Lessons Finished
                </p>

                <div className="mt-auto space-y-4">
                  <div className="w-full bg-slate-50 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                    <span>Progress Status</span>
                    <span className="text-emerald-500 font-black">
                      {percentage}%
                    </span>
                  </div>
                  <Button
                    onClick={() => handleNextLesson(prog)}
                    fullWidth
                    className="mt-6 py-4 text-[10px] rounded-2xl"
                    disabled={percentage >= 100}
                  >
                    {percentage >= 100
                      ? "🎉 Course Completed"
                      : "Complete Next Lesson"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyLearningScreen;
