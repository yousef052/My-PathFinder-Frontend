import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useAdminJobSources } from "../../hooks/useAdminJobSources";

const emptySourceForm = {
  sourceName: "",
  sourceType: "",
  apiEndpoint: "",
  isActive: true,
};

// ─── Primitive UI Components ──────────────────────────────────────────────────
const inputCls =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none transition duration-200 focus:border-[var(--color-primary)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(91,124,250,0.08)]";

const Field = ({ label, required, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-[11px] font-black uppercase tracking-widest text-slate-500">
      {label}{required && <span className="ml-0.5 text-red-400">*</span>}
    </span>
    {children}
  </label>
);

const PrimaryBtn = ({ children, type = "button", onClick, disabled, small }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center rounded-2xl bg-[var(--color-primary)] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-100 transition duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-blue-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${small ? "px-4 py-2 text-[10px]" : "px-5 py-3 text-xs"}`}
  >
    {children}
  </button>
);

const GhostBtn = ({ children, type = "button", onClick, disabled }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-500 transition duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] active:scale-95 disabled:opacity-50"
  >
    {children}
  </button>
);

// ─── Skeleton Loader ─────────────────────────────────────────────────────────
const SkeletonCard = ({ delay = 0 }) => (
  <div
    className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm"
    style={{ animation: `fadeSlideUp 0.4s ease both ${delay}ms` }}
  >
    <div className="mb-4 flex items-start justify-between gap-4">
      <div className="h-10 w-10 animate-pulse rounded-2xl bg-slate-100" />
      <div className="h-5 w-20 animate-pulse rounded-lg bg-slate-100" />
    </div>
    <div className="space-y-2">
      <div className="h-4 w-3/4 animate-pulse rounded-lg bg-slate-100" />
      <div className="h-3 w-1/2 animate-pulse rounded-lg bg-slate-100" />
    </div>
    <div className="mt-5 flex gap-2">
      <div className="h-7 w-20 animate-pulse rounded-xl bg-slate-100" />
      <div className="h-7 w-16 animate-pulse rounded-xl bg-slate-100" />
    </div>
  </div>
);

// ─── Job Source Card ────────────────────────────────────────────────────────────
const JobSourceCard = ({ source, onEdit, onDelete, isSaving, delay = 0 }) => {
  const name = source.sourceName || source.name || source.SourceName || "Unnamed Source";
  const type = source.sourceType || source.SourceType || "Generic";

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-primary)]/20 hover:shadow-xl hover:shadow-blue-50/70"
      style={{ animation: `fadeSlideUp 0.45s cubic-bezier(0.16,1,0.3,1) both ${delay}ms` }}
    >
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-[2rem] bg-gradient-to-r from-[var(--color-primary)] to-[#a78bfa] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 text-xl font-black shadow-sm transition-transform duration-300 group-hover:scale-110">
          📡
        </div>
        <div>
          {source.isActive ? (
            <span className="rounded-xl bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-600">Active</span>
          ) : (
            <span className="rounded-xl bg-slate-100 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-slate-500">Inactive</span>
          )}
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-base font-black leading-snug text-slate-900 line-clamp-1">{name}</h3>
        <p className="mt-1 text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest">{type}</p>

        <p className="mt-3 text-xs font-medium leading-relaxed text-slate-500 line-clamp-2 truncate" title={source.apiEndpoint || source.ApiEndpoint}>
           {source.apiEndpoint || source.ApiEndpoint || "No Endpoint Provided"}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-50 pt-4">
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">
          ID #{source.id}
        </span>
        <div className="flex gap-2">
          {source.apiEndpoint && (
            <a
              href={source.apiEndpoint}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 transition hover:bg-slate-50"
              title="Test API Endpoint"
            >
              🔗
            </a>
          )}
          <button
            type="button"
            onClick={() => onEdit(source)}
            className="rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 transition hover:bg-slate-100 active:scale-95"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(source)}
            disabled={isSaving}
            className="rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-red-400 transition hover:bg-red-50 active:scale-95 disabled:opacity-40"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
};

// ─── Job Source Modal ─────────────────────────────────────────────────────────
const JobSourceModal = ({ isOpen, title, initialValue, isSaving, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(emptySourceForm);

  useEffect(() => {
    if (initialValue) {
      setFormData({
        sourceName: initialValue.sourceName || initialValue.name || initialValue.SourceName || initialValue.Name || "",
        sourceType: initialValue.sourceType || initialValue.SourceType || "",
        apiEndpoint: initialValue.apiEndpoint || initialValue.ApiEndpoint || "",
        isActive: initialValue.isActive !== undefined ? initialValue.isActive : true,
      });
    } else {
      setFormData(emptySourceForm);
    }
  }, [initialValue, isOpen]);

  if (!isOpen) return null;

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await onSubmit(formData);
    if (success) onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ animation: "fadeIn 0.2s ease both" }}>
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white shadow-2xl" style={{ animation: "slideUp 0.3s cubic-bezier(0.16,1,0.3,1) both" }}>
        <div className="h-1 w-full bg-gradient-to-r from-[var(--color-primary)] via-[#818cf8] to-[#a78bfa]" />

        <div className="flex items-center justify-between border-b border-slate-100 px-7 py-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)]">Job Source</p>
            <h2 className="text-xl font-black text-slate-900">{title}</h2>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-500 active:scale-90">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-7 py-6 max-h-[75vh] overflow-y-auto">
          <Field label="Source Name" required>
            <input name="sourceName" value={formData.sourceName} onChange={updateField} className={inputCls} required />
          </Field>
          <Field label="Source Type" required>
            <input name="sourceType" value={formData.sourceType} onChange={updateField} className={inputCls} placeholder="e.g. Manual, API, Scraper" required />
          </Field>
          <Field label="API Endpoint">
            <input name="apiEndpoint" value={formData.apiEndpoint} onChange={updateField} className={inputCls} />
          </Field>
          <div className="flex items-center gap-3 pt-2">
            <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={updateField} className="h-5 w-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
            <label htmlFor="isActive" className="text-sm font-bold text-slate-700">Is Active Source</label>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 mt-5">
            <GhostBtn onClick={onClose} disabled={isSaving}>Cancel</GhostBtn>
            <PrimaryBtn type="submit" disabled={isSaving}>
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Saving…
                </span>
              ) : "Save Source"}
            </PrimaryBtn>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const JobSourcesManager = () => {
  const { jobSources, isLoading, isSaving, error, fetchJobSources, saveJobSource, deleteJobSource } = useAdminJobSources();
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState({ isOpen: false, item: null });

  useEffect(() => {
    fetchJobSources();
  }, [fetchJobSources]);

  const visibleSources = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    if (!needle) return jobSources;
    return jobSources.filter((s) => (s.sourceName || s.name || s.SourceName || "").toLowerCase().includes(needle));
  }, [jobSources, searchTerm]);

  const openCreate = () => setModal({ isOpen: true, item: null });
  const openEdit = (source) => setModal({ isOpen: true, item: source });
  const handleSave = (payload) => saveJobSource(payload, modal.item?.id);
  
  const handleDelete = async (source) => {
    const name = source.sourceName || source.name || source.SourceName || `#${source.id}`;
    if (window.confirm(`Delete job source "${name}"?`)) {
      await deleteJobSource(source.id);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)     scale(1);    }
        }
      `}</style>

      <div className="space-y-8 pb-24" style={{ animation: "fadeSlideUp 0.35s ease both" }}>
        
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">
              Admin Module
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Job Sources
            </h1>
            <p className="mt-2 max-w-xl text-sm font-medium text-slate-500">
              Manage external job boards, APIs, and manual data sources.
            </p>
          </div>
          <PrimaryBtn onClick={openCreate} disabled={isSaving}>
            + New Job Source
          </PrimaryBtn>
        </div>
        
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="flex flex-col justify-center rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md" style={{ animation: "fadeSlideUp 0.4s ease both" }}>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Sources</p>
            <p className="mt-1 text-3xl font-black text-slate-900">{jobSources.length}</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-600" style={{ animation: "fadeSlideUp 0.3s ease both" }}>
            <span className="text-lg">⚠️</span> {error}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search sources by name..."
            className="min-w-[200px] flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700 outline-none transition focus:border-[var(--color-primary)] focus:bg-white"
          />
          {searchTerm && (
            <GhostBtn onClick={() => setSearchTerm("")}>Clear</GhostBtn>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} delay={i * 60} />)}
          </div>
        ) : visibleSources.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-slate-200 bg-white px-6 py-24 text-center" style={{ animation: "fadeSlideUp 0.4s ease both" }}>
             <span className="mb-4 text-5xl">📡</span>
            <h3 className="text-lg font-black text-slate-700">No job sources found</h3>
            <p className="mt-2 text-sm font-medium text-slate-400">Add an API provider or manual source to track job postings.</p>
            <div className="mt-6">
              <PrimaryBtn onClick={openCreate}>+ Create First Source</PrimaryBtn>
            </div>
          </div>
        ) : (
          <>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400" style={{ animation: "fadeSlideUp 0.3s ease both" }}>
              Showing {visibleSources.length} source{visibleSources.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visibleSources.map((source, i) => (
                <JobSourceCard
                  key={source.id}
                  source={source}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  isSaving={isSaving}
                  delay={i * 55}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <JobSourceModal
        isOpen={modal.isOpen}
        title={modal.item?.id ? "Edit Job Source" : "Create Job Source"}
        initialValue={modal.item}
        isSaving={isSaving}
        onClose={() => setModal({ isOpen: false, item: null })}
        onSubmit={handleSave}
      />
    </>
  );
};

export default JobSourcesManager;
