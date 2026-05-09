// src/features/jobs/presentation/screens/JobsScreen.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJobs } from "../../hooks/useJobs";
import { useJobApplications } from "../../hooks/useJobApplications";
import JobCard from "../components/JobCard";
import Button from "../../../../core/ui_components/Button";
import AddJobModal from "./AddJobModal";
import { useAuth } from "../../../../core/context/AuthContext";
import { useProfile } from "../../../profile/hooks/useProfile";

const JobsScreen = () => {
  const {
    jobs,
    recommendedJobs,
    isLoading: isJobsLoading,
    error,
    fetchJobs,
    fetchRecommended,
    addJob,
    deleteJob,
  } = useJobs();
  
  const { applications, isLoading: isAppsLoading, fetchApplications, applyForJob } = useJobApplications();
  const { isAdmin } = useAuth();
  const { user, isLoading: isProfileLoading } = useProfile();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); 

  const [filters, setFilters] = useState({
    SearchTerm: "",
    Location: "",
    JobType: "",
    ExperienceLevel: "",
  });

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, [fetchJobs, fetchApplications]);

  useEffect(() => {
    const hasProfileSignal =
      user?.firstName ||
      user?.lastName ||
      user?.jobTitle ||
      user?.targetJobTitle ||
      user?.desiredJobTitle;

    if (!isProfileLoading && hasProfileSignal) {
      fetchRecommended();
    }
  }, [fetchRecommended, isProfileLoading, user]);

  const applyFilters = (e) => {
    e.preventDefault();
    fetchJobs(filters);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      await deleteJob(id);
    }
  };

  const isLoading = isJobsLoading || isAppsLoading;

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex gap-4 p-2 bg-white rounded-3xl border border-gray-100 shadow-sm w-fit">
          {[
            { id: "all", label: "All Opportunities", icon: "🌎" },
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

        <button 
          onClick={() => navigate("/saved/jobs")}
          className="px-8 py-4 rounded-2xl bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary hover:shadow-lg transition-all flex items-center gap-2 shadow-sm"
        >
          <span>🔖</span> View Saved Jobs
        </button>
      </div>

      {activeTab === "all" && (
        <>
          {/* AI Recommendations or Fallback */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 px-2">
              <span className="text-2xl">{recommendedJobs.length > 0 ? "✨" : "🔥"}</span>
              <h3 className="text-xl font-black text-gray-800 tracking-tight">
                {recommendedJobs.length > 0 ? "AI Tailored for You" : "Trending Opportunities"}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(recommendedJobs.length > 0 ? recommendedJobs : jobs.slice(0, 3)).map((job) => (
                <div
                  key={job.id}
                  className={`relative rounded-[2.5rem] ${recommendedJobs.length > 0 ? 'ring-4 ring-[#5b7cfa]/5' : ''}`}
                >
                  <JobCard
                    job={job}
                    isAdmin={isAdmin}
                    onDelete={handleDelete}
                    onApply={applyForJob}
                  />
                  {recommendedJobs.length > 0 && (
                    <span className="absolute -top-3 -right-3 bg-[#5b7cfa] text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-xl uppercase tracking-widest">
                      Match
                    </span>
                  )}
                </div>
              ))}
              {recommendedJobs.length === 0 && jobs.length === 0 && !isLoading && (
                <div className="col-span-full py-10 text-center text-gray-400 font-bold italic">
                  Complete your profile to get AI recommendations.
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
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
                    onClick={() => navigate("/admin/job-sources")}
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
              <Button type="submit" isLoading={isJobsLoading}>
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
              : !isJobsLoading && (
                  <div className="col-span-full text-center py-24 bg-white rounded-[3rem] border border-gray-100">
                    <p className="text-gray-300 font-black uppercase text-xs tracking-widest">
                      No matching roles found
                    </p>
                  </div>
                )}
          </div>
        </>
      )}

      {activeTab === "saved" && (
        <div className="col-span-full text-center py-24 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
          <span className="text-4xl mb-4 block">⭐</span>
          <p className="text-gray-300 font-black uppercase text-xs tracking-widest">
            Saved jobs feature coming soon
          </p>
        </div>
      )}

      {activeTab === "applied" && (
        <div className="space-y-8">
          <div className="flex justify-between items-center px-4">
             <h2 className="text-2xl font-black text-gray-900 tracking-tight">Sent Applications</h2>
             <span className="bg-blue-50 text-[#5b7cfa] px-4 py-1.5 rounded-full text-[10px] font-black">{applications.length} TOTAL</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {applications.length === 0 ? (
              <div className="col-span-full text-center py-24 bg-white rounded-[3rem] border border-gray-100">
                <p className="text-gray-300 font-black uppercase text-xs tracking-widest">No applications found</p>
              </div>
            ) : (
              applications.map(app => (
                <div key={app.id} className="bg-white p-6 rounded-[2rem] border border-gray-50 flex items-center justify-between hover:shadow-lg transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      {app.job?.companyLogo ? <img src={app.job.companyLogo} alt="" className="w-full h-full object-cover rounded-2xl" /> : "🏢"}
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900">{app.job?.title || "Job Application"}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">{app.job?.companyName || "External Provider"}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                      app.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600' : 
                      app.status === 'Rejected' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {app.status || 'Pending'}
                    </span>
                    <span className="text-[9px] font-bold text-gray-300 italic">{new Date(app.appliedAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <AddJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addJob}
        isLoading={isJobsLoading}
      />
    </div>
  );
};

export default JobsScreen;
