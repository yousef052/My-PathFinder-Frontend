// src/features/courses/presentation/screens/CoursesScreen.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCourses } from "../../hooks/useCourses";
import { useCourseProgress } from "../../hooks/useCourseProgress";
import CourseCard from "../components/CourseCard";
import Button from "../../../../core/ui_components/Button";
import AddCourseModal from "./AddCourseModal";
import { useAuth } from "../../../../core/context/AuthContext";

const CoursesScreen = () => {
  const {
    courses,
    isLoading: isCoursesLoading,
    fetchCourses,
    addCourse,
    enrollInCourse, // 💡 استدعاء دالة التسجيل من الـ Hook
  } = useCourses();

  const {
    userProgress,
    isLoading: isProgressLoading,
    fetchMyProgress,
    updateCourseProgress,
    dropCourse,
  } = useCourseProgress();

  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchCourses();
    fetchMyProgress();
  }, [fetchCourses, fetchMyProgress]);

  const handleNextLesson = async (prog) => {
    const pId = prog.id || prog.progressId || prog.userCourseId;
    if (prog.completedLessons >= prog.totalLessons)
      return alert("Course completed! 🎉");
    await updateCourseProgress(pId, 1, "Completed lesson from dashboard");
  };

  // 💡 دالة تنفيذ التسجيل وتحديث البروجرس في نفس اللحظة
  const handleEnrollment = async (courseId) => {
    const success = await enrollInCourse(courseId);
    if (success) {
      await fetchMyProgress(); // تحديث تبويب My Learning فوراً
      alert("تم التسجيل بنجاح! راجع صفحة My Learning.");
      return true;
    }
    return false;
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex gap-4 p-2 bg-white rounded-3xl border border-gray-100 shadow-sm w-fit">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === "all" ? "bg-[#5b7cfa] text-white shadow-lg shadow-blue-100" : "text-gray-400 hover:bg-slate-50"}`}
        >
          <span>🌐</span> Explore Catalog
        </button>
        <button
          onClick={() => setActiveTab("learning")}
          className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === "learning" ? "bg-[#5b7cfa] text-white shadow-lg shadow-blue-100" : "text-gray-400 hover:bg-slate-50"}`}
        >
          <span>🎓</span> My Learning
        </button>
        </div>
        <button 
          onClick={() => navigate("/saved/courses")}
          className="px-8 py-4 rounded-2xl bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary hover:shadow-lg transition-all flex items-center gap-2 shadow-sm"
        >
          <span>🔖</span> View Saved Courses
        </button>
      </div>

      {activeTab === "all" ? (
        <>
          <div className="bg-white p-8 rounded-[3rem] border border-white shadow-xl shadow-blue-50/50 flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex-1 w-full relative group">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl group-focus-within:scale-110 transition-transform">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search skills, instructors, or course names..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyUp={(e) =>
                  e.key === "Enter" && fetchCourses({ SearchTerm: searchTerm })
                }
                className="w-full bg-slate-50 border-2 border-transparent rounded-2xl pl-16 pr-8 py-5 text-sm font-bold text-gray-700 outline-none focus:bg-white focus:border-[#5b7cfa]/20 transition-all"
              />
            </div>
            {isAdmin && (
              <div className="flex items-center gap-3 w-full lg:w-auto">
                <Button
                  onClick={() => navigate("/admin/categories")}
                  variant="outline"
                  className="px-8 border-indigo-100 text-indigo-500"
                >
                  Settings
                </Button>
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-10 shadow-blue-200"
                >
                  + Add Course
                </Button>
              </div>
            )}
          </div>

          {isCoursesLoading ? (
            <div className="flex h-64 items-center justify-center animate-pulse text-xs font-black uppercase text-gray-300">
              Fetching Catalog...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onEnroll={handleEnrollment} // 💡 تمرير الدالة للبطاقة
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {isProgressLoading ? (
            <div className="col-span-full text-center py-20 animate-pulse text-xs font-black uppercase text-gray-300">
              Syncing Progress...
            </div>
          ) : userProgress.length === 0 ? (
            <div className="col-span-full text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
              <p className="text-gray-300 font-black uppercase text-xs tracking-widest italic">
                Start your first course to see progress here
              </p>
            </div>
          ) : (
            userProgress.map((prog) => {
              const percentage = Math.min(
                Math.round(
                  ((prog.completedLessons || 0) / (prog.totalLessons || 1)) *
                    100,
                ),
                100,
              );
              return (
                <div
                  key={prog.id}
                  className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col group hover:shadow-xl transition-all h-full"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-blue-50 text-[#5b7cfa] rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                      📚
                    </div>
                    <button
                      onClick={() => dropCourse(prog.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <h3 className="font-black text-gray-900 text-lg mb-2 line-clamp-2 h-14 leading-tight">
                    {prog.courseName || "Course"}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-6">
                    {prog.completedLessons} / {prog.totalLessons} Lessons
                  </p>

                  <div className="mt-auto space-y-4">
                    <div className="w-full bg-slate-50 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-black text-gray-400 uppercase">
                      <span>Status</span>
                      <span className="text-emerald-500">{percentage}%</span>
                    </div>
                    <Button
                      onClick={() => handleNextLesson(prog)}
                      fullWidth
                      className="mt-6 py-4 text-[10px] rounded-2xl"
                      disabled={percentage >= 100}
                    >
                      {percentage >= 100 ? "🎉 Completed" : "Continue Learning"}
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      <AddCourseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={addCourse}
        isLoading={isCoursesLoading}
      />
    </div>
  );
};

export default CoursesScreen;
