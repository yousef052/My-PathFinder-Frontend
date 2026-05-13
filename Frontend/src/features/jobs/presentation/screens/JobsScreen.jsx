// src/features/jobs/presentation/screens/JobsScreen.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJobs } from "../../hooks/useJobs";
import { useJobApplications } from "../../hooks/useJobApplications";
import JobCard from "../components/JobCard";
import AddJobModal from "./AddJobModal";
import { useAuth } from "../../../../core/context/AuthContext";
import { useProfile } from "../../../profile/hooks/useProfile";
import Button from "../../../../core/ui_components/Button";
import Input from "../../../../core/ui_components/Input";
import UserFlowFooter from "../../../../core/ui_components/UserFlowFooter";

const JobsScreen = () => {
  const { jobs, recommendedJobs, isLoading: isJobsLoading, fetchJobs, fetchRecommended, addJob, deleteJob } = useJobs();
  const { applications, isLoading: isAppsLoading, fetchApplications, applyForJob } = useJobApplications();
  const { isAdmin } = useAuth();
  const { user, isLoading: isProfileLoading } = useProfile();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); 

  const [filters, setFilters] = useState({ SearchTerm: "", Location: "", JobType: "", ExperienceLevel: "" });

  useEffect(() => {
    document.documentElement.style.setProperty('--theme-color', '#33aefc');
    document.documentElement.style.setProperty('--bg-orb-1', '#33aefc');
    document.documentElement.style.setProperty('--bg-orb-2', '#7dd3fc');
    document.documentElement.style.setProperty('--bg-orb-3', '#0c4a6e');
    document.documentElement.style.setProperty('--bg-gradient-start', '#0c4a6e');
    document.documentElement.style.setProperty('--bg-gradient-end', '#082f49');
  }, []);

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, [fetchJobs, fetchApplications]);

  useEffect(() => {
    if (!isProfileLoading && (user?.targetJobTitle || user?.jobTitle)) fetchRecommended();
  }, [fetchRecommended, isProfileLoading, user]);

  const handleApply = async (id) => {
    await applyForJob(id);
    fetchApplications();
  };

  return (
    <div className="space-y-10 pb-16 animate-fade-in">
      
      {/* ── Tabs & Actions ── */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex bg-blue-50/50 backdrop-blur-md p-1.5 rounded-2xl border border-blue-100 shadow-sm">
          <button onClick={() => setActiveTab("all")} className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === "all" ? "bg-blue-500 text-white shadow-md" : "text-blue-400 hover:text-blue-600"}`}>Jobs</button>
          <button onClick={() => setActiveTab("applied")} className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === "applied" ? "bg-blue-500 text-white shadow-md" : "text-blue-400 hover:text-blue-600"}`}>My Applications</button>
        </div>

        {isAdmin && <Button onClick={() => setIsModalOpen(true)} variant="primary">Post Job</Button>}
      </div>

      {activeTab === "all" ? (
        <div className="space-y-12">
          
          {/* AI Picks */}
          {recommendedJobs.length > 0 && (
             <div className="space-y-6">
                <div className="flex items-center gap-2">
                   <div className="h-1 w-1 rounded-full bg-primary animate-ping" />
                   <h3 className="text-lg font-black italic tracking-tight text-slate-900">Recommended Jobs</h3>
                </div>
                <div className="grid grid-main">
                   {recommendedJobs.map((job, idx) => (
                      <div key={job.id || `rec-${idx}`} className="col-span-4 lg:col-span-4">
                         <JobCard job={job} onApply={() => handleApply(job.id || job.JobId)} />
                      </div>
                   ))}
                </div>
             </div>
          )}

          {/* Search & Filters */}
          <div className="p-6 lg:p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-glass">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input placeholder="Position..." value={filters.SearchTerm} onChange={(e) => setFilters({...filters, SearchTerm: e.target.value})} />
                <Input placeholder="Location..." value={filters.Location} onChange={(e) => setFilters({...filters, Location: e.target.value})} />
                <select className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-[9px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary/5 transition-all" value={filters.JobType} onChange={(e) => setFilters({...filters, JobType: e.target.value})}>
                   <option value="">Type</option>
                   <option value="Full-time">Full-time</option>
                   <option value="Contract">Contract</option>
                </select>
                <Button onClick={() => fetchJobs(filters)} fullWidth>Search Jobs</Button>
             </div>
          </div>

          {/* Results */}
          <div className="grid grid-main">
             {isJobsLoading ? (
                [...Array(6)].map((_, i) => <div key={`skeleton-${i}`} className="col-span-4 lg:col-span-3 h-64 bg-white rounded-[2rem] animate-pulse" />)
             ) : (
                jobs.map((job, idx) => (
                   <div key={job.id || `job-${idx}`} className="col-span-4 lg:col-span-3">
                      <JobCard job={job} onApply={() => handleApply(job.id)} />
                   </div>
                ))
             )}
          </div>
        </div>
      ) : (
        <div className="grid grid-main">
           {isAppsLoading ? (
              [...Array(4)].map((_, i) => <div key={i} className="col-span-4 lg:col-span-7 h-28 bg-white rounded-[1.5rem] animate-pulse" />)
           ) : applications.length === 0 ? (
              <div className="col-span-14 py-16 text-center glass-card rounded-[2.5rem] border-dashed border-slate-200">
                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">No applications yet. Explore the markets to begin.</p>
              </div>
           ) : (
              applications.map(app => (
                 <div key={app.id} className="col-span-4 lg:col-span-7 flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[2rem] shadow-glass hover:shadow-xl transition-all group">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-xl group-hover:rotate-6 transition-transform">🏢</div>
                       <div>
                          <h4 className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">
                             {app.job?.title || app.job?.jobTitle || app.Job?.jobTitle || app.Job?.JobTitle || "Untitled Job"}
                          </h4>
                          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                             {app.job?.companyName || app.Job?.companyName || app.Job?.CompanyName || "Unknown Company"}
                          </p>
                       </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-widest ${(app.status || app.Status) === 'Accepted' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-primary'}`}>
                       {app.status || app.Status || 'Pending'}
                    </div>
                 </div>
              ))
           )}
        </div>
      )}

      <AddJobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={addJob} isLoading={isJobsLoading} />
      <UserFlowFooter currentPath="/jobs" />
    </div>
  );
};

export default JobsScreen;
