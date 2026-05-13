import React, { useEffect, useMemo, useState } from "react";
import { useAdminPlatforms } from "../../hooks/useAdminPlatforms";

const emptyPlatformForm = {
  name: "",
  description: "",
  baseUrl: "",
  logoUrl: "",
  apiEndPoint: "",
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

// ─── Platform Card ────────────────────────────────────────────────────────────
const PlatformCard = ({ platform, onEdit, onDelete, isSaving, delay = 0 }) => {
  const name = platform.name || platform.platformName || platform.Name || "Unnamed";
  const initials = name.substring(0, 2).toUpperCase();

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-primary)]/20 hover:shadow-xl hover:shadow-blue-50/70"
      style={{ animation: `fadeSlideUp 0.45s cubic-bezier(0.16,1,0.3,1) both ${delay}ms` }}
    >
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-[2rem] bg-gradient-to-r from-[var(--color-primary)] to-[#a78bfa] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-lg font-black text-[var(--color-primary)] shadow-sm transition-transform duration-300 group-hover:scale-110">
          {platform.logoUrl || platform.LogoUrl ? (
            <img src={platform.logoUrl || platform.LogoUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div>
          {platform.isActive ? (
            <span className="rounded-xl bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-600">Active</span>
          ) : (
            <span className="rounded-xl bg-slate-100 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-slate-500">Inactive</span>
          )}
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-base font-black leading-snug text-slate-900 line-clamp-1">{name}</h3>
        <p className="mt-1 text-xs font-bold text-slate-400 truncate" title={platform.baseUrl || platform.BaseUrl}>
          {platform.baseUrl || platform.BaseUrl || "No Base URL"}
        </p>

        {platform.description && (
          <p className="mt-3 text-xs font-medium leading-relaxed text-slate-500 line-clamp-2">
            {platform.description}
          </p>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-50 pt-4">
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">
          ID #{platform.id}
        </span>
        <div className="flex gap-2">
          {platform.apiEndPoint && (
            <a
              href={platform.apiEndPoint}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 transition hover:bg-slate-50"
              title="Open API Endpoint"
            >
              📡
            </a>
          )}
          <button
            type="button"
            onClick={() => onEdit(platform)}
            className="rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 transition hover:bg-slate-100 active:scale-95"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(platform)}
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

// ─── Platform Modal ───────────────────────────────────────────────────────────
const PlatformModal = ({ isOpen, title, initialValue, isSaving, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(emptyPlatformForm);

  useEffect(() => {
    if (initialValue) {
      setFormData({
        name: initialValue.name || initialValue.platformName || initialValue.Name || "",
        description: initialValue.description || "",
        baseUrl: initialValue.baseUrl || initialValue.BaseUrl || "",
        logoUrl: initialValue.logoUrl || initialValue.LogoUrl || "",
        apiEndPoint: initialValue.apiEndPoint || initialValue.ApiEndPoint || "",
        isActive: initialValue.isActive !== undefined ? initialValue.isActive : true,
      });
    } else {
      setFormData(emptyPlatformForm);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ animation: "fadeIn 0.2s ease both" }}>
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white shadow-2xl" style={{ animation: "slideUp 0.3s cubic-bezier(0.16,1,0.3,1) both" }}>
        <div className="h-1 w-full bg-gradient-to-r from-[var(--color-primary)] via-[#818cf8] to-[#a78bfa]" />

        <div className="flex items-center justify-between border-b border-slate-100 px-7 py-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)]">Platform</p>
            <h2 className="text-xl font-black text-slate-900">{title}</h2>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-500 active:scale-90">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-7 py-6 max-h-[75vh] overflow-y-auto">
          <Field label="Platform Name" required>
            <input name="name" value={formData.name} onChange={updateField} className={inputCls} required />
          </Field>
          <Field label="Description">
            <textarea name="description" value={formData.description} onChange={updateField} className={`${inputCls} min-h-[90px] resize-none`} />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Base URL" required>
              <input name="baseUrl" type="url" value={formData.baseUrl} onChange={updateField} className={inputCls} required />
            </Field>
            <Field label="Logo URL">
              <input name="logoUrl" type="url" value={formData.logoUrl} onChange={updateField} className={inputCls} />
            </Field>
            <div className="md:col-span-2">
               <Field label="API Endpoint">
                <input name="apiEndPoint" value={formData.apiEndPoint} onChange={updateField} className={inputCls} />
               </Field>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={updateField} className="h-5 w-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
            <label htmlFor="isActive" className="text-sm font-bold text-slate-700">Is Active Provider</label>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 mt-5">
            <GhostBtn onClick={onClose} disabled={isSaving}>Cancel</GhostBtn>
            <PrimaryBtn type="submit" disabled={isSaving}>
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Saving…
                </span>
              ) : "Save Platform"}
            </PrimaryBtn>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const PlatformsManager = () => {
  const { platforms, isLoading, isSaving, error, fetchPlatforms, savePlatform, deletePlatform } = useAdminPlatforms();
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState({ isOpen: false, item: null });

  useEffect(() => {
    fetchPlatforms();
  }, [fetchPlatforms]);

  const visiblePlatforms = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    if (!needle) return platforms;
    return platforms.filter((p) => (p.name || p.platformName || p.Name || "").toLowerCase().includes(needle));
  }, [platforms, searchTerm]);

  const openCreate = () => setModal({ isOpen: true, item: null });
  const openEdit = (platform) => setModal({ isOpen: true, item: platform });
  const handleSave = (payload) => savePlatform(payload, modal.item?.id);
  
  const handleDelete = async (platform) => {
    const name = platform.name || platform.platformName || platform.Name || `#${platform.id}`;
    if (window.confirm(`Delete platform "${name}"?`)) {
      await deletePlatform(platform.id);
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
              Course Platforms
            </h1>
            <p className="mt-2 max-w-xl text-sm font-medium text-slate-500">
              Manage external course providers (e.g. Coursera, Udemy).
            </p>
          </div>
          <PrimaryBtn onClick={openCreate} disabled={isSaving}>
            + New Platform
          </PrimaryBtn>
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
            placeholder="Search platforms by name..."
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
        ) : visiblePlatforms.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-slate-200 bg-white px-6 py-24 text-center" style={{ animation: "fadeSlideUp 0.4s ease both" }}>
             <span className="mb-4 text-5xl">🏢</span>
            <h3 className="text-lg font-black text-slate-700">No platforms found</h3>
            <p className="mt-2 text-sm font-medium text-slate-400">Add a platform to display courses from it.</p>
            <div className="mt-6">
              <PrimaryBtn onClick={openCreate}>+ Create First Platform</PrimaryBtn>
            </div>
          </div>
        ) : (
          <>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400" style={{ animation: "fadeSlideUp 0.3s ease both" }}>
              Showing {visiblePlatforms.length} platform{visiblePlatforms.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visiblePlatforms.map((platform, i) => (
                <PlatformCard
                  key={platform.id}
                  platform={platform}
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

      <PlatformModal
        isOpen={modal.isOpen}
        title={modal.item?.id ? "Edit Platform" : "Create Platform"}
        initialValue={modal.item}
        isSaving={isSaving}
        onClose={() => setModal({ isOpen: false, item: null })}
        onSubmit={handleSave}
      />
    </>
  );
};

export default PlatformsManager;
