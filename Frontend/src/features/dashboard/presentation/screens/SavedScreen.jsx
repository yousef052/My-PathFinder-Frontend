// src/features/dashboard/presentation/screens/SavedScreen.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSavedCourses } from "../../../courses/hooks/useSavedCourses";
import { useSavedJobs } from "../../../jobs/hooks/useSavedJobs";
import CourseCard from "../../../courses/presentation/components/CourseCard";
import JobCard from "../../../jobs/presentation/components/JobCard";

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
    <div className="space-y-12 animate-fade-in-up pb-20">
      {/* Header */}
      <div className="premium-card p-10 lg:p-14 bg-white border border-white flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h2 className="text-3xl lg:text-4xl font-black text-slate-950 tracking-tight italic flex items-center gap-4">
            <span className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-2xl">🔖</span>
            Personal Library
          </h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-3">
            Your curated collection of professional opportunities
          </p>
        </div>

        <div className="flex bg-slate-50 p-2 rounded-[2rem] border border-slate-100 relative z-10 shadow-inner">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-8 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
                activeTab === tab.id
                  ? "bg-white text-primary shadow-lg shadow-blue-100 ring-1 ring-slate-100/50"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[9px] ${activeTab === tab.id ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        {activeTab === "courses" ? (
          loadingCourses ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-12 w-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : savedCourses.length === 0 ? (
            <div className="text-center py-40 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 flex flex-col items-center">
              <span className="text-8xl block mb-8 opacity-20 grayscale">📚</span>
              <h3 className="text-xl font-black text-slate-700 italic">No saved courses yet.</h3>
              <p className="text-slate-400 font-medium text-sm mt-4 max-w-xs mx-auto leading-relaxed">
                Start building your curriculum by bookmarking courses from our catalog.
              </p>
              <button onClick={() => navigate("/courses")} className="btn-primary mt-10 px-12">Browse Courses</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {savedCourses.map((item) => (
                <CourseCard
                  key={item.id}
                  course={item.course || item}
                  isSaved={true}
                  savedId={item.id}
                />
              ))}
            </div>
          )
        ) : loadingJobs ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : savedJobs.length === 0 ? (
          <div className="text-center py-40 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 flex flex-col items-center">
            <span className="text-8xl block mb-8 opacity-20 grayscale">💼</span>
            <h3 className="text-xl font-black text-slate-700 italic">No saved jobs yet.</h3>
            <p className="text-slate-400 font-medium text-sm mt-4 max-w-xs mx-auto leading-relaxed">
              Never miss an opportunity. Save job postings to review them later.
            </p>
            <button onClick={() => navigate("/jobs")} className="btn-primary mt-10 px-12">Explore Jobs</button>
          </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {savedJobs.map((item) => (
                <JobCard
                  key={item.id}
                  job={item.job || item}
                  isSaved={true}
                  savedId={item.id}
                />
              ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default SavedScreen;
