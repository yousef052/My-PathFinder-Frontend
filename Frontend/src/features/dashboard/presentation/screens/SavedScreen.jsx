import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSavedCourses } from "../../../courses/hooks/useSavedCourses";
import { useSavedJobs } from "../../../jobs/hooks/useSavedJobs";
import CourseCard from "../../../courses/presentation/components/CourseCard";
import JobCard from "../../../jobs/presentation/components/JobCard";

// ─── Primitive UI Components ──────────────────────────────────────────────────
const PrimaryBtn = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center rounded-2xl bg-[var(--color-primary)] px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-100 transition duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-blue-200 active:scale-95 ${className}`}
  >
    {children}
  </button>
);

const SkeletonItem = ({ delay = 0 }) => (
  <div
    className="flex flex-col overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm"
    style={{ animation: `fadeSlideUp 0.4s ease both ${delay}ms` }}
  >
    <div className="h-32 animate-pulse rounded-[1.5rem] bg-slate-100" />
    <div className="mt-5 space-y-3">
      <div className="h-5 w-3/4 animate-pulse rounded-lg bg-slate-100" />
      <div className="h-4 w-1/2 animate-pulse rounded-lg bg-slate-100" />
    </div>
    <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-50">
      <div className="h-6 w-16 animate-pulse rounded-lg bg-slate-100" />
      <div className="h-8 w-8 animate-pulse rounded-xl bg-slate-100" />
    </div>
  </div>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const SavedScreen = () => {
  const { tab } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(tab || "courses");
  
  const { savedCourses, isLoading: loadingCourses, fetchSavedCourses } = useSavedCourses();
  const { savedJobs, isLoading: loadingJobs, fetchSavedJobs } = useSavedJobs();

  useEffect(() => {
    fetchSavedCourses();
    fetchSavedJobs();
  }, [fetchSavedCourses, fetchSavedJobs]);

  useEffect(() => {
    if (tab && (tab === "courses" || tab === "jobs")) {
      setActiveTab(tab);
    }
  }, [tab]);

  const tabs = [
    { id: "courses", label: "Saved Courses", icon: "📚", count: savedCourses.length },
    { id: "jobs", label: "Saved Jobs", icon: "💼", count: savedJobs.length },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/saved/${tabId}`);
  };

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>

      <div className="space-y-12 pb-24">
        
        {/* ── Header Section ── */}
        <div
          className="relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-[3.5rem] border border-slate-100 bg-white p-10 shadow-sm md:flex-row lg:p-14"
          style={{ animation: "fadeSlideUp 0.4s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--color-primary)]/5 blur-3xl" />
          
          <div className="relative z-10 text-center md:text-left">
            <h2 className="flex flex-col items-center gap-4 text-3xl font-black italic tracking-tight text-slate-950 md:flex-row lg:text-4xl">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-[var(--color-primary)] shadow-inner">🔖</span>
              Personal Library
            </h2>
            <p className="mt-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Your curated collection of opportunities
            </p>
          </div>

          <div className="relative z-10 flex rounded-[2rem] border border-slate-100 bg-slate-50 p-2 shadow-inner">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => handleTabChange(t.id)}
                className={`flex items-center gap-3 rounded-[1.5rem] px-8 py-3.5 text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === t.id
                    ? "bg-white text-[var(--color-primary)] shadow-lg shadow-blue-100 ring-1 ring-slate-100/50"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <span className="text-sm">{t.icon}</span>
                <span className="hidden sm:inline">{t.label}</span>
                {t.count > 0 && (
                  <span className={`rounded-full px-2 py-0.5 text-[9px] ${activeTab === t.id ? 'bg-[var(--color-primary)] text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content Area ── */}
        <div className="min-h-[500px]">
          {activeTab === "courses" ? (
            loadingCourses ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                 {[...Array(4)].map((_, i) => <SkeletonItem key={i} delay={i * 50} />)}
              </div>
            ) : savedCourses.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center rounded-[3.5rem] border-2 border-dashed border-slate-100 bg-white py-32 text-center"
                style={{ animation: "fadeSlideUp 0.4s ease both" }}
              >
                <span className="mb-8 block text-8xl opacity-20 grayscale">📚</span>
                <h3 className="text-2xl font-black italic text-slate-700">No saved courses yet.</h3>
                <p className="mx-auto mt-4 max-w-sm text-sm font-medium leading-relaxed text-slate-400">
                  Start building your curriculum by bookmarking courses from our catalog.
                </p>
                <PrimaryBtn onClick={() => navigate("/courses")} className="mt-10">Browse Courses</PrimaryBtn>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {savedCourses.map((item, i) => (
                  <div key={item.id} style={{ animation: `fadeSlideUp 0.4s cubic-bezier(0.16,1,0.3,1) both ${i * 40}ms` }}>
                    <CourseCard
                      course={item.course || item}
                      isSaved={true}
                      savedId={item.id}
                    />
                  </div>
                ))}
              </div>
            )
          ) : loadingJobs ? (
             <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                 {[...Array(4)].map((_, i) => <SkeletonItem key={i} delay={i * 50} />)}
              </div>
          ) : savedJobs.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center rounded-[3.5rem] border-2 border-dashed border-slate-100 bg-white py-32 text-center"
              style={{ animation: "fadeSlideUp 0.4s ease both" }}
            >
              <span className="mb-8 block text-8xl opacity-20 grayscale">💼</span>
              <h3 className="text-2xl font-black italic text-slate-700">No saved jobs yet.</h3>
              <p className="mx-auto mt-4 max-w-sm text-sm font-medium leading-relaxed text-slate-400">
                Never miss an opportunity. Save job postings to review them later.
              </p>
              <PrimaryBtn onClick={() => navigate("/jobs")} className="mt-10">Explore Jobs</PrimaryBtn>
            </div>
          ) : (
             <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {savedJobs.map((item, i) => (
                  <div key={item.id} style={{ animation: `fadeSlideUp 0.4s cubic-bezier(0.16,1,0.3,1) both ${i * 40}ms` }}>
                    <JobCard
                      job={item.job || item}
                      isSaved={true}
                      savedId={item.id}
                    />
                  </div>
                ))}
              </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SavedScreen;
