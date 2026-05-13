import React, { useEffect, useState } from "react";
import { useCoursePlatform } from "../../hooks/useCoursePlatform";
import { useAuth } from "../../../../core/context/AuthContext";
import { resolveMediaUrl } from "../../../../core/utils/mediaUrl";

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
      <div className="h-14 w-14 animate-pulse rounded-2xl bg-slate-100" />
      <div className="space-y-2">
        <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
    <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />
  </div>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const PlatformManagerScreen = () => {
  const {
    platforms,
    isLoading,
    error,
    fetchPlatforms,
    addPlatform,
    deletePlatform,
  } = useCoursePlatform();
  
  const { isAdmin } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    baseUrl: "",
    logoUrl: "",
    isActive: true,
  });

  useEffect(() => {
    fetchPlatforms();
  }, [fetchPlatforms]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await addPlatform(formData);
    if (success) {
      setFormData({
        name: "",
        description: "",
        baseUrl: "",
        logoUrl: "",
        isActive: true,
      });
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete the platform "${name}"?`)) {
      deletePlatform(id);
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

      <div className="space-y-8 pb-24" style={{ animation: "fadeSlideUp 0.4s ease both" }}>
        
        {/* ── Header ── */}
        <div className="rounded-[3.5rem] border border-slate-100 bg-white p-8 shadow-sm lg:p-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">Settings</p>
          <h2 className="mt-2 text-3xl font-black italic tracking-tight text-slate-900">
            Platform Configuration
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Register and manage external learning API providers.
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
              Register Provider
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <Field label="Platform Name" required>
                <input
                  type="text"
                  placeholder="e.g. Coursera"
                  className={inputCls}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Field>
              
              <Field label="API Base Endpoint" required>
                <input
                  type="url"
                  placeholder="https://api.example.com"
                  className={inputCls}
                  value={formData.baseUrl}
                  onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                  required
                />
              </Field>

              <Field label="Service Description">
                <textarea
                  placeholder="Optional details about this provider..."
                  className={`${inputCls} min-h-[100px] resize-none`}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Field>

              <div className="pt-2">
                <PrimaryBtn type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Saving..." : "+ Save Platform"}
                </PrimaryBtn>
              </div>
            </form>
          </div>

          {/* ── Active Platforms List ── */}
          <div className="flex flex-col rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm lg:col-span-2">
            <h3 className="mb-6 border-b border-slate-50 pb-4 text-xl font-black text-slate-800">
              Active Integrations
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {isLoading && platforms.length === 0 ? (
                [...Array(4)].map((_, i) => <SkeletonItem key={i} />)
              ) : platforms.length === 0 ? (
                <div className="col-span-full py-16 text-center">
                  <span className="text-5xl opacity-20 grayscale">🔌</span>
                  <p className="mt-4 font-bold text-slate-400">No platforms integrated yet.</p>
                </div>
              ) : (
                platforms.map((p, i) => (
                  <div
                    key={p.id}
                    className="group flex items-center justify-between rounded-[2rem] border border-slate-100 bg-slate-50/50 p-6 transition-all duration-300 hover:border-[var(--color-primary)]/20 hover:bg-white hover:shadow-md"
                    style={{ animation: `fadeSlideUp 0.3s ease both ${i * 30}ms` }}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                        {resolveMediaUrl(p.logoUrl) ? (
                          <img
                            src={resolveMediaUrl(p.logoUrl)}
                            className="h-8 w-8 object-contain"
                            alt=""
                          />
                        ) : (
                          "🌐"
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-black text-slate-800 transition-colors group-hover:text-[var(--color-primary)]">
                          {p.name}
                        </p>
                        <p className="truncate text-[10px] font-bold text-slate-400">
                          {p.baseUrl}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-300 shadow-sm transition-all hover:bg-red-50 hover:text-red-500"
                      title="Delete Platform"
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

export default PlatformManagerScreen;
