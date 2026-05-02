// src/features/jobs/presentation/screens/JobsScreen.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJobs } from "../../hooks/useJobs";
import { useJobApplications } from "../../hooks/useJobApplications";
import { useProfile } from "../../../profile/hooks/useProfile";
import JobCard from "../components/JobCard";
import Button from "../../../../core/ui_components/Button";
import AddJobModal from "./AddJobModal";

const JobsScreen = () => {
  const {
    jobs,
    recommendedJobs,
    isLoading,
    error,
    fetchJobs,
    fetchRecommended,
    addJob,
    deleteJob,
  } = useJobs();
  const { applyForJob } = useJobApplications();
  const { user } = useProfile();
  const navigate = useNavigate();

  const isAdmin = user?.role === "Admin" || user?.Role === "Admin";
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 💡 التعديل: حالة التحكم في التبويبات النشطة[cite: 35]
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'saved', 'applied'

  const [filters, setFilters] = useState({
    SearchTerm: "",
    Location: "",
    JobType: "",
    ExperienceLevel: "",
  });

  useEffect(() => {
    fetchJobs();
    fetchRecommended();
  }, [fetchJobs, fetchRecommended]);

  const applyFilters = (e) => {
    e.preventDefault();
    fetchJobs(filters);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      await deleteJob(id);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* 💡 نظام الـ Tabs الجديد لدمج الأقسام[cite: 35] */}
      <div className="flex gap-4 p-2 bg-white rounded-3xl border border-gray-100 shadow-sm w-fit">
        {[
          { id: "all", label: "All Opportunities", icon: "🌎" },
          { id: "saved", label: "Saved", icon: "⭐" },
          { id: "applied", label: "My Applications", icon: "📬" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id ? "bg-[#5b7cfa] text-white shadow-lg shadow-blue-100" : "text-gray-400 hover:bg-slate-50"}`}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* عرض المحتوى بناءً على التبويب النشط[cite: 35] */}
      {activeTab === "all" && (
        <>
          {/* AI Recommendations */}
          {recommendedJobs.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                <span className="text-2xl">✨</span>
                <h3 className="text-xl font-black text-gray-800 tracking-tight">
                  AI Tailored for You
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="relative ring-4 ring-[#5b7cfa]/5 rounded-[2.5rem]"
                  >
                    <JobCard
                      job={job}
                      isAdmin={isAdmin}
                      onDelete={handleDelete}
                      onApply={applyForJob}
                    />
                    <span className="absolute -top-3 -right-3 bg-[#5b7cfa] text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-xl uppercase tracking-widest">
                      Match
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search & Post Bar */}
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
            <div className="flex justify-between items-center px-2">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  Explore Markets
                </h2>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">
                  Discover your next professional move
                </p>
              </div>
              {isAdmin && (
                <div className="flex gap-4">
                  <Button
                    onClick={() => navigate("/job-sources-manager")}
                    variant="outline"
                    className="text-[10px] border-indigo-100 text-indigo-500"
                  >
                    ⚙️ Sources
                  </Button>
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    className="px-8 shadow-blue-100"
                  >
                    + New Job
                  </Button>
                </div>
              )}
            </div>

            <form
              onSubmit={applyFilters}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
            >
              <input
                type="text"
                placeholder="Job Title..."
                className="p-4 bg-slate-50 border-none rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-50 text-sm font-bold"
                value={filters.SearchTerm}
                onChange={(e) =>
                  setFilters({ ...filters, SearchTerm: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Location..."
                className="p-4 bg-slate-50 border-none rounded-2xl outline-none text-sm font-bold"
                value={filters.Location}
                onChange={(e) =>
                  setFilters({ ...filters, Location: e.target.value })
                }
              />
              <select
                className="p-4 bg-slate-50 border-none rounded-2xl outline-none text-xs font-black text-gray-500 uppercase tracking-widest"
                value={filters.JobType}
                onChange={(e) =>
                  setFilters({ ...filters, JobType: e.target.value })
                }
              >
                <option value="">Job Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Remote">Remote</option>
              </select>
              <select
                className="p-4 bg-slate-50 border-none rounded-2xl outline-none text-xs font-black text-gray-500 uppercase tracking-widest"
                value={filters.ExperienceLevel}
                onChange={(e) =>
                  setFilters({ ...filters, ExperienceLevel: e.target.value })
                }
              >
                <option value="">Experience</option>
                <option value="Entry">Entry Level</option>
                <option value="Senior">Senior</option>
              </select>
              <Button type="submit" isLoading={isLoading}>
                Search
              </Button>
            </form>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {jobs.length > 0
              ? jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isAdmin={isAdmin}
                    onDelete={handleDelete}
                    onApply={applyForJob}
                  />
                ))
              : !isLoading && (
                  <div className="col-span-full text-center py-24 bg-white rounded-[3rem] border border-gray-100">
                    <p className="text-gray-300 font-black uppercase text-xs tracking-widest">
                      No matching roles found
                    </p>
                  </div>
                )}
          </div>
        </>
      )}

      {/* 💡 تبويبات المحفوظات والطلبات (تظهر عند الضغط عليها)[cite: 35] */}
      {activeTab === "saved" && (
        <div className="p-20 text-center bg-white rounded-[3rem] border border-gray-100 italic font-medium text-gray-400">
          Fetching your saved opportunities...
        </div>
      )}

      {activeTab === "applied" && (
        <div className="p-20 text-center bg-white rounded-[3rem] border border-gray-100 italic font-medium text-gray-400">
          Tracking your active applications...
        </div>
      )}

      <AddJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addJob}
        isLoading={isLoading}
      />
    </div>
  );
};

export default JobsScreen;
