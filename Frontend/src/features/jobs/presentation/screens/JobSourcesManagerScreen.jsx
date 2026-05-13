import React, { useEffect, useState } from "react";
import { useJobSources } from "../../hooks/useJobSources";
import { useAuth } from "../../../../core/context/AuthContext";

// ─── Primitive UI Components ──────────────────────────────────────────────────
const PrimaryBtn = ({ children, onClick, disabled, className = "", type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center rounded-2xl bg-[var(--color-primary)] px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-100 transition duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-blue-200 active:scale-95 disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

const inputCls =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-bold text-slate-700 outline-none transition duration-200 focus:border-[var(--color-primary)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(91,124,250,0.08)]";

const Field = ({ label, required, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-[11px] font-black uppercase tracking-widest text-slate-500">
      {label}{required && <span className="ml-0.5 text-red-400">*</span>}
    </span>
    {children}
  </label>
);

const SkeletonItem = () => (
  <div className="flex items-center justify-between rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
    <div className="flex items-center gap-4">
      <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-100" />
      <div className="space-y-2">
        <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-48 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
    <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />
  </div>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const JobSourcesManagerScreen = () => {
  const { sources, isLoading, error, fetchSources, addSource, deleteSource } =
    useJobSources();
  const { isAdmin } = useAuth();

  const [formData, setFormData] = useState({
    sourceName: "",
    sourceType: "",
    apiEndpoint: "",
    isActive: true,
  });

  useEffect(() => {
    if (isAdmin) {
      fetchSources(false);
    }
  }, [fetchSources, isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await addSource(formData);
    if (success) {
      setFormData({
        sourceName: "",
        sourceType: "",
        apiEndpoint: "",
        isActive: true,
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this source?")) {
      await deleteSource(id);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex h-96 flex-col items-center justify-center rounded-[3.5rem] border border-slate-100 bg-white shadow-sm" style={{ animation: "fadeSlideUp 0.4s ease both" }}>
        <span className="mb-4 text-6xl">⛔</span>
        <h2 className="text-2xl font-black italic text-slate-900">Access Restricted</h2>
        <p className="mt-2 font-medium text-slate-500">
          This configuration area is for system administrators only.
        </p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>

      <div className="space-y-8 pb-24" style={{ animation: "fadeSlideUp 0.4s ease both" }}>
        
        {/* ── Header ── */}
        <div className="rounded-[3.5rem] border border-slate-100 bg-white p-8 shadow-sm lg:p-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">Settings</p>
          <h2 className="mt-2 text-3xl font-black italic tracking-tight text-slate-900">
            Job Sources Manager
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Manage APIs and external integrations for the job board.
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-center font-bold text-red-600" style={{ animation: "fadeSlideUp 0.3s ease both" }}>
            ⚠️ {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* ── Add Form ── */}
          <div className="flex h-fit flex-col rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm lg:col-span-1">
            <h3 className="mb-6 border-b border-slate-50 pb-4 text-xl font-black text-slate-800">
              Add New Source
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <Field label="Source Name" required>
                <input
                  type="text"
                  placeholder="e.g. LinkedIn, Wuzzuf..."
                  className={inputCls}
                  value={formData.sourceName}
                  onChange={(e) => setFormData({ ...formData, sourceName: e.target.value })}
                  required
                />
              </Field>

              <Field label="Source Type" required>
                <input
                  type="text"
                  placeholder="e.g. API, Scraper..."
                  className={inputCls}
                  value={formData.sourceType}
                  onChange={(e) => setFormData({ ...formData, sourceType: e.target.value })}
                  required
                />
              </Field>
              
              <Field label="API Endpoint">
                <input
                  type="url"
                  placeholder="https://api.example.com"
                  className={inputCls}
                  value={formData.apiEndpoint}
                  onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
                />
              </Field>

              <div className="flex items-center gap-3 px-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-5 w-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                <label htmlFor="isActive" className="cursor-pointer text-[11px] font-black uppercase tracking-widest text-slate-600">
                  Active Integration
                </label>
              </div>

              <div className="pt-4">
                <PrimaryBtn type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Saving..." : "+ Save Source"}
                </PrimaryBtn>
              </div>
            </form>
          </div>

          {/* ── Connected Sources List ── */}
          <div className="flex flex-col rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm lg:col-span-2">
            <h3 className="mb-6 border-b border-slate-50 pb-4 text-xl font-black text-slate-800">
              Connected Sources
            </h3>

            <div className="space-y-4">
              {isLoading && sources.length === 0 ? (
                [...Array(4)].map((_, i) => <SkeletonItem key={i} />)
              ) : sources.length === 0 ? (
                <div className="py-16 text-center">
                  <span className="text-5xl opacity-20 grayscale">🔌</span>
                  <p className="mt-4 font-bold text-slate-400">No external sources connected.</p>
                </div>
              ) : (
                sources.map((src, i) => (
                  <div
                    key={src.id}
                    className="group flex items-center justify-between rounded-[2rem] border border-slate-100 bg-slate-50/50 p-6 transition-all duration-300 hover:border-[var(--color-primary)]/20 hover:bg-white hover:shadow-md"
                    style={{ animation: `fadeSlideUp 0.3s ease both ${i * 30}ms` }}
                  >
                    <div className="flex items-center gap-5 min-w-0">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                        🔗
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <p className="truncate text-base font-black text-slate-900 transition-colors group-hover:text-[var(--color-primary)]">
                            {src.sourceName}
                          </p>
                          <span
                            className={`rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${
                              src.isActive
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {src.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-[11px] font-bold text-slate-400">
                          <span className="mr-2 uppercase tracking-widest text-[var(--color-primary)]">[{src.sourceType}]</span>
                          {src.apiEndpoint || "No endpoint provided"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(src.id)}
                      className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-300 shadow-sm transition-all hover:bg-red-50 hover:text-red-500"
                      title="Delete Source"
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default JobSourcesManagerScreen;
