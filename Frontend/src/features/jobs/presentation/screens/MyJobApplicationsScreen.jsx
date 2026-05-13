import React, { useEffect } from "react";
import { useJobApplications } from "../../hooks/useJobApplications";
import { useNavigate } from "react-router-dom";

// ─── Primitive UI Components ──────────────────────────────────────────────────
const PrimaryBtn = ({ children, onClick, disabled, className = "", type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center rounded-2xl bg-[var(--color-primary)] px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-100 transition duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-blue-200 active:scale-95 disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

const SkeletonAppCard = ({ delay = 0 }) => (
  <div
    className="flex flex-col rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm"
    style={{ animation: `fadeSlideUp 0.4s ease both ${delay}ms` }}
  >
    <div className="mb-8 flex items-start justify-between">
      <div className="h-16 w-16 animate-pulse rounded-[2rem] bg-slate-100" />
      <div className="h-6 w-20 animate-pulse rounded-xl bg-slate-100" />
    </div>
    <div className="mb-6 space-y-3">
      <div className="h-6 w-3/4 animate-pulse rounded-lg bg-slate-100" />
      <div className="h-4 w-1/2 animate-pulse rounded-lg bg-slate-100" />
    </div>
    <div className="mb-8 flex gap-3">
      <div className="h-6 w-16 animate-pulse rounded-lg bg-slate-100" />
      <div className="h-6 w-20 animate-pulse rounded-lg bg-slate-100" />
    </div>
    <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-8">
      <div className="h-6 w-24 animate-pulse rounded-lg bg-slate-100" />
      <div className="h-4 w-16 animate-pulse rounded-lg bg-slate-100" />
    </div>
  </div>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
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
    const base = "px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm";
    switch (status?.toLowerCase()) {
      case "accepted":
        return <span className={`${base} bg-emerald-50 text-emerald-600`}>Accepted</span>;
      case "rejected":
        return <span className={`${base} bg-red-50 text-red-600`}>Rejected</span>;
      case "reviewed":
        return <span className={`${base} bg-blue-50 text-[var(--color-primary)]`}>Reviewed</span>;
      default:
        return <span className={`${base} bg-amber-50 text-amber-600`}>Pending</span>;
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>

      <div className="space-y-12 pb-24" style={{ animation: "fadeSlideUp 0.4s ease both" }}>
        
        {/* ── Premium Hero Section ── */}
        <div className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-[3.5rem] bg-slate-900 p-10 text-white shadow-2xl md:flex-row lg:p-14">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--color-primary)]/20 blur-[100px]" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-400/10 blur-[80px]" />
          
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-3xl font-black italic tracking-tight lg:text-4xl">Application Tracker</h2>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Monitoring your professional trajectory</p>
          </div>
          <button 
            onClick={() => navigate("/jobs")}
            className="relative z-10 rounded-2xl bg-white px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-950 shadow-xl shadow-black/20 transition-all hover:scale-105 active:scale-95"
          >
            Explore Jobs ↗
          </button>
        </div>

        {error && (
          <div className="rounded-[2.5rem] border border-red-100 bg-red-50 p-6 text-center text-xs font-black uppercase tracking-widest text-red-600 shadow-sm" style={{ animation: "fadeSlideUp 0.3s ease both" }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── Content Grid ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
             {[...Array(3)].map((_, i) => <SkeletonAppCard key={i} delay={i * 50} />)}
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[3.5rem] border-2 border-dashed border-slate-100 bg-white py-32 text-center" style={{ animation: "fadeSlideUp 0.4s ease both" }}>
            <span className="mb-8 block text-8xl opacity-20 grayscale">📄</span>
            <h3 className="text-2xl font-black italic text-slate-700">No Active Applications</h3>
            <p className="mx-auto mt-4 mb-10 max-w-sm text-sm font-medium leading-relaxed text-slate-400">
              You haven't applied to any roles yet. Your next opportunity is waiting in the job market.
            </p>
            <PrimaryBtn onClick={() => navigate("/jobs")}>Start Applying</PrimaryBtn>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {applications.map((app, i) => {
              const jobData = app.job || {};
              return (
                <div
                  key={app.id}
                  className="group flex h-full flex-col rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-[var(--color-primary)]/20 hover:shadow-xl hover:shadow-blue-50/50"
                  style={{ animation: `fadeSlideUp 0.4s cubic-bezier(0.16,1,0.3,1) both ${i * 40}ms` }}
                >
                  <div className="mb-8 flex items-start justify-between">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-[2rem] border border-slate-100 bg-slate-50 text-3xl shadow-inner transition-transform group-hover:rotate-6 group-hover:scale-110">
                      {jobData.companyLogo ? (
                        <img src={jobData.companyLogo} alt="" className="h-full w-full object-cover" />
                      ) : (
                        "🏢"
                      )}
                    </div>
                    {getStatusBadge(app.status)}
                  </div>

                  <div className="mb-8 space-y-2">
                    <h3 className="line-clamp-2 text-xl font-black leading-tight text-slate-900 transition-colors group-hover:text-[var(--color-primary)]">
                      {jobData.jobTitle || jobData.title || app.jobTitle || app.title || "Unknown Position"}
                    </h3>
                    <p className="text-xs font-bold text-[var(--color-primary)]">
                      {jobData.companyName || app.companyName || "Professional Provider"}
                    </p>
                  </div>

                  <div className="mb-8 space-y-4">
                    <div className="flex flex-wrap items-center gap-2 text-slate-400">
                      <span className="rounded-lg bg-slate-50 px-3 py-1 text-[9px] font-black uppercase tracking-widest border border-slate-100">
                        📍 {jobData.location || "Remote"}
                      </span>
                      <span className="rounded-lg bg-slate-50 px-3 py-1 text-[9px] font-black uppercase tracking-widest border border-slate-100">
                        💼 {jobData.jobType || "Full-time"}
                      </span>
                    </div>
                    {app.notes && (
                      <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-[11px] italic leading-relaxed text-slate-500">
                        "{app.notes}"
                      </div>
                    )}
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-8">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-300">Applied On</span>
                      <span className="text-[10px] font-bold text-slate-500">
                        {new Date(app.createdAt || app.appliedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <button
                      onClick={() => handleWithdraw(app.id)}
                      className="text-[9px] font-black uppercase tracking-widest text-red-300 transition-all hover:scale-110 hover:text-red-500 active:scale-95"
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
    </>
  );
};

export default MyJobApplicationsScreen;
