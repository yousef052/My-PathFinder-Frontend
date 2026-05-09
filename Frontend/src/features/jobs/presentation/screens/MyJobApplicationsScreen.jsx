// src/features/jobs/presentation/screens/MyJobApplicationsScreen.jsx
import React, { useEffect } from "react";
import { useJobApplications } from "../../hooks/useJobApplications";
import { useNavigate } from "react-router-dom";

const MyJobApplicationsScreen = () => {
  const {
    applications,
    isLoading,
    error,
    fetchApplications,
    deleteApplication,
  } = useJobApplications();
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleWithdraw = async (id) => {
    if (window.confirm("Are you sure you want to withdraw this application?")) {
      await deleteApplication(id);
    }
  };

  const getStatusBadge = (status) => {
    const base = "px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm";
    switch (status?.toLowerCase()) {
      case "accepted":
        return <span className={`${base} bg-emerald-50 text-emerald-600 border-emerald-100`}>Accepted</span>;
      case "rejected":
        return <span className={`${base} bg-red-50 text-red-600 border-red-100`}>Rejected</span>;
      case "reviewed":
        return <span className={`${base} bg-blue-50 text-blue-600 border-blue-100`}>Reviewed</span>;
      default:
        return <span className={`${base} bg-amber-50 text-amber-600 border-amber-100`}>Pending</span>;
    }
  };

  return (
    <div className="space-y-12 animate-fade-in-up pb-20">
      <div className="premium-card p-10 lg:p-14 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 text-center md:text-left">
          <h2 className="text-3xl lg:text-4xl font-black tracking-tight italic">Application Tracker</h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">Monitoring your professional trajectory</p>
        </div>
        <button 
          onClick={() => navigate("/jobs")}
          className="px-10 h-14 rounded-2xl bg-white text-slate-950 text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/20 relative z-10 active:scale-95"
        >
          Explore Jobs ↗
        </button>
      </div>

      {error && (
        <div className="glass bg-red-50/50 border-red-200 p-6 rounded-[2.5rem] text-red-600 font-black text-xs text-center uppercase tracking-widest">
          ⚠️ {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
          <span className="text-7xl block mb-8 opacity-20 grayscale">📄</span>
          <h3 className="text-xl font-black text-slate-700 italic">No Active Applications</h3>
          <p className="text-slate-400 font-medium text-sm mt-4 mb-10 max-w-sm mx-auto">You haven't applied to any roles yet. Your next opportunity is waiting in the job market.</p>
          <button 
            onClick={() => navigate("/jobs")}
            className="btn-primary"
          >
            Start Applying
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {applications.map((app) => {
            const jobData = app.job || {};
            return (
              <div key={app.id} className="premium-card p-10 group flex flex-col h-full hover:border-primary/20">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 bg-slate-50 rounded-[2rem] flex items-center justify-center text-3xl border border-slate-100 group-hover:rotate-6 transition-transform shadow-inner">
                    {jobData.companyLogo ? <img src={jobData.companyLogo} alt="" className="w-full h-full object-cover rounded-[2rem]" /> : "🏢"}
                  </div>
                  {getStatusBadge(app.status)}
                </div>

                <div className="space-y-2 mb-8">
                  <h3 className="font-black text-slate-900 text-xl leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {jobData.jobTitle || jobData.title || app.jobTitle || app.title || "Unknown Position"}
                  </h3>
                  <p className="text-primary font-bold text-xs">
                    {jobData.companyName || app.companyName || "Professional Provider"}
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                   <div className="flex items-center gap-3 text-slate-400">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg">📍 {jobData.location || "Remote"}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg">💼 {jobData.jobType || "Full-time"}</span>
                   </div>
                   {app.notes && (
                    <div className="bg-slate-50/50 p-4 rounded-2xl text-[11px] text-slate-500 italic border border-slate-50 leading-relaxed">
                      "{app.notes}"
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-8 border-t border-slate-50 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Applied On</span>
                    <span className="text-[10px] font-bold text-slate-500">
                      {new Date(app.createdAt || app.appliedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <button
                    onClick={() => handleWithdraw(app.id)}
                    className="text-[9px] font-black text-red-300 hover:text-red-500 uppercase tracking-widest transition-all hover:scale-110 active:scale-95"
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyJobApplicationsScreen;
