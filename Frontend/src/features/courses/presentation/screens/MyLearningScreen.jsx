import React, { useEffect } from "react";
import { useCourseProgress } from "../../hooks/useCourseProgress";
import { Link } from "react-router-dom";

// ─── Primitive UI Components ──────────────────────────────────────────────────
const PrimaryBtn = ({ children, onClick, disabled, className = "" }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center rounded-2xl bg-[var(--color-primary)] px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-100 transition duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-blue-200 active:scale-95 disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

const SkeletonCard = ({ delay = 0 }) => (
  <div
    className="flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm"
    style={{ animation: `fadeSlideUp 0.4s ease both ${delay}ms` }}
  >
    <div className="mb-6 flex justify-between">
      <div className="h-14 w-14 animate-pulse rounded-2xl bg-slate-100" />
      <div className="h-6 w-6 animate-pulse rounded-full bg-slate-100" />
    </div>
    <div className="mb-2 h-6 w-3/4 animate-pulse rounded-lg bg-slate-100" />
    <div className="mb-6 h-4 w-1/2 animate-pulse rounded-lg bg-slate-100" />
    
    <div className="mt-auto space-y-4">
      <div className="h-2.5 w-full animate-pulse rounded-full bg-slate-100" />
      <div className="flex justify-between">
        <div className="h-3 w-10 animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-8 animate-pulse rounded bg-slate-100" />
      </div>
      <div className="h-12 w-full animate-pulse rounded-2xl bg-slate-100" />
    </div>
  </div>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
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
    const pId = item.id || item.progressId || item.userCourseId;
    if (!pId) return alert("Error: Progress ID not found.");

    if (
      window.confirm(
        "Are you sure you want to drop this course? Your progress will be lost."
      )
    ) {
      await dropCourse(pId);
    }
  };

  const handleNextLesson = async (item) => {
    const pId = item.id || item.progressId || item.userCourseId;
    const incrementValue = 1;

    if (item.completedLessons >= item.totalLessons) {
      return alert("You have already completed all lessons in this course!");
    }

    await updateCourseProgress(
      pId,
      incrementValue,
      "Successfully completed a new lesson"
    );
  };

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>

      <div className="space-y-10 pb-24" style={{ animation: "fadeSlideUp 0.35s ease both" }}>
        
        {/* ── Header Section ── */}
        <div className="flex flex-col items-center justify-between gap-6 rounded-[3.5rem] border border-slate-100 bg-white p-10 shadow-sm md:flex-row lg:p-12">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black italic tracking-tight text-slate-950">
              My Enrolled Courses
            </h2>
            <p className="mt-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Track your professional growth
            </p>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center justify-center rounded-2xl bg-blue-50 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)] shadow-sm transition-all hover:-translate-y-1 hover:bg-[var(--color-primary)] hover:text-white hover:shadow-lg hover:shadow-blue-200 active:scale-95"
          >
            Explore More
          </Link>
        </div>

        {error && (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-5 text-sm font-bold text-red-600" style={{ animation: "fadeSlideUp 0.3s ease both" }}>
            <span className="text-lg">⚠️</span> {error}
          </div>
        )}

        {/* ── Content Grid ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} delay={i * 50} />)}
          </div>
        ) : userProgress.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[3.5rem] border-2 border-dashed border-slate-100 bg-white py-32 text-center" style={{ animation: "fadeSlideUp 0.4s ease both" }}>
            <span className="mb-8 block text-8xl opacity-20 grayscale">🎓</span>
            <h3 className="text-2xl font-black italic text-slate-700">
              You haven't started any courses yet.
            </h3>
            <p className="mx-auto mt-4 max-w-sm text-sm font-medium leading-relaxed text-slate-400">
               Enroll in a course from the catalog to start tracking your progress here.
            </p>
            <Link to="/courses" className="mt-10">
              <PrimaryBtn>Browse Courses</PrimaryBtn>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {userProgress.map((prog, index) => {
              const currentId = prog.id || prog.progressId || prog.userCourseId || index;
              const completed = prog.completedLessons || 0;
              const total = prog.totalLessons || 1;
              const percentage = Math.min(Math.round((completed / total) * 100), 100);

              return (
                <div
                  key={currentId}
                  className="group flex h-full flex-col rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-50/50"
                  style={{ animation: `fadeSlideUp 0.4s cubic-bezier(0.16,1,0.3,1) both ${index * 40}ms` }}
                >
                  <div className="mb-6 flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-[var(--color-primary)] shadow-inner transition-transform group-hover:scale-110">
                      📚
                    </div>
                    <button
                      onClick={() => handleDrop(prog)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500"
                      title="Drop Course"
                    >
                      ✕
                    </button>
                  </div>

                  <h3 className="mb-2 line-clamp-2 h-14 text-lg font-black leading-tight text-slate-900">
                    {prog.courseName || prog.course?.name || "Untitled Course"}
                  </h3>

                  <p className="mb-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {completed} / {total} Lessons Finished
                  </p>

                  <div className="mt-auto space-y-4">
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-50">
                      <div
                        className="h-full rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                      <span>Progress Status</span>
                      <span className="font-black text-emerald-500">
                        {percentage}%
                      </span>
                    </div>
                    <button
                      onClick={() => handleNextLesson(prog)}
                      disabled={percentage >= 100}
                      className="mt-6 w-full rounded-2xl bg-[var(--color-primary)] py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-100 transition-all hover:bg-[var(--color-primary-hover)] active:scale-95 disabled:cursor-not-allowed disabled:bg-emerald-50 disabled:text-emerald-500 disabled:shadow-none"
                    >
                      {percentage >= 100 ? "🎉 Course Completed" : "Complete Next Lesson"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default MyLearningScreen;
