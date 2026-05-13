import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useAdminJobs } from "../../hooks/useAdminJobs";
import { useAdminJobSources } from "../../hooks/useAdminJobSources";

// ─── Design Tokens ───────────────────────────────────────────────────────────
const ACCENT = "var(--color-admin-main)";

const JOB_TYPES        = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"];
const EXP_LEVELS       = ["Entry Level", "Junior", "Mid Level", "Senior", "Lead", "Executive"];
const TYPE_COLORS      = {
  "Full-time":  "bg-blue-50 text-blue-600",
  "Part-time":  "bg-purple-50 text-purple-600",
  "Contract":   "bg-amber-50 text-amber-600",
  "Freelance":  "bg-emerald-50 text-emerald-600",
  "Internship": "bg-rose-50 text-rose-600",
  // Aliases
  FullTime: "bg-blue-50 text-blue-600",
  PartTime: "bg-purple-50 text-purple-600",
};
const EXP_COLORS       = {
  "Entry Level": "bg-sky-50 text-sky-600",
  "Junior":      "bg-cyan-50 text-cyan-600",
  "Mid Level":   "bg-indigo-50 text-indigo-600",
  "Senior":      "bg-violet-50 text-violet-600",
  "Lead":        "bg-fuchsia-50 text-fuchsia-600",
  "Executive":   "bg-pink-50 text-pink-600",
  // Aliases
  EntryLevel: "bg-sky-50 text-sky-600",
  MidLevel: "bg-indigo-50 text-indigo-600",
};

const emptyJobForm = {
  jobTitle: "",
  sourceId: 0,
  companyName: "",
  description: "",
  location: "",
  jobType: "Full-time",
  experienceLevel: "Entry Level",
  salaryMin: 0,
  salaryMax: 0,
  externalUrl: "",
  expiryDate: "",
};

import Button from "../../../../core/ui_components/Button";
import Input from "../../../../core/ui_components/Input";

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
      <div className="h-3 w-2/3 animate-pulse rounded-lg bg-slate-100" />
    </div>
    <div className="mt-5 flex gap-2">
      <div className="h-7 w-20 animate-pulse rounded-xl bg-slate-100" />
      <div className="h-7 w-16 animate-pulse rounded-xl bg-slate-100" />
    </div>
  </div>
);

// ─── Job Card ─────────────────────────────────────────────────────────────────
const JobCard = ({ job, jobSources, onEdit, onDelete, isSaving, delay = 0 }) => {
  const sourceName = jobSources?.find(s => s.id === job.sourceId || s.id === job.SourceId)?.sourceName || "Internal";
  const typeCls = TYPE_COLORS[job.jobType] || "bg-slate-100 text-slate-500";
  const expCls  = EXP_COLORS[job.experienceLevel]  || "bg-slate-100 text-slate-500";
  const sMin = job.salaryMin ?? job.SalaryMin ?? 0;
  const sMax = job.salaryMax ?? job.SalaryMax ?? 0;
  const salary  =
    sMin > 0 && sMax > 0
      ? `$${sMin.toLocaleString()} – $${sMax.toLocaleString()}`
      : sMin > 0
      ? `From $${sMin.toLocaleString()}`
      : sMax > 0
      ? `Up to $${sMax.toLocaleString()}`
      : null;

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-admin-main/20 hover:shadow-xl hover:shadow-slate-100"
      style={{ animation: `fadeSlideUp 0.45s cubic-bezier(0.16,1,0.3,1) both ${delay}ms` }}
    >
      {/* Top accent bar */}
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-[2rem] bg-gradient-to-r from-admin-main to-slate-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-xl shadow-sm transition-transform duration-300 group-hover:scale-110">
          💼
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className={`rounded-xl px-2.5 py-1 text-[9px] font-black uppercase tracking-widest ${typeCls}`}>
            {job.jobType || job.JobType}
          </span>
          <span className={`rounded-xl px-2.5 py-1 text-[9px] font-black uppercase tracking-widest ${expCls}`}>
            {job.experienceLevel || job.ExperienceLevel}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1">
        <h3 className="text-base font-black leading-snug text-slate-900 line-clamp-2">
          {job.jobTitle || job.JobTitle || job.title}
        </h3>
        <p className="mt-1 text-xs font-bold text-slate-500">
          {job.companyName || job.CompanyName} <span className="text-slate-300 mx-1">•</span> <span className="text-admin-main opacity-80">{sourceName}</span>
        </p>

        {/* Meta row */}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] font-bold text-slate-400">
          {(job.location || job.Location) && (
            <span className="flex items-center gap-1">
              <span>📍</span> {job.location || job.Location}
            </span>
          )}
          {salary && (
            <span className="flex items-center gap-1">
              <span>💰</span> {salary}
            </span>
          )}
          {job.expiryDate && (
            <span className="flex items-center gap-1">
              <span>📅</span> {new Date(job.expiryDate).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Description preview */}
        {(job.description || job.Description) && (
          <p className="mt-3 text-xs font-medium leading-relaxed text-slate-400 line-clamp-2">
            {job.description || job.Description}
          </p>
        )}
      </div>

      {/* Footer actions */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-50 pt-4">
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">
          ID #{job.id}
        </span>
        <div className="flex gap-2">
          {job.externalUrl && (
            <a
              href={job.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 transition hover:bg-slate-50"
              title="Open external link"
            >
              🔗
            </a>
          )}
          <button
            type="button"
            onClick={() => onEdit(job)}
            className="rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 transition hover:bg-slate-100 active:scale-95"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(job)}
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

// ─── Job Modal ────────────────────────────────────────────────────────────────
const JobModal = ({ isOpen, title, initialValue, isSaving, onClose, onSubmit, jobSources }) => {
  const [form, setForm] = useState(emptyJobForm);

  useEffect(() => {
    if (initialValue) {
      const expiry = initialValue.expiryDate
        ? new Date(initialValue.expiryDate).toISOString().split("T")[0]
        : "";
      setForm({
        jobTitle:        initialValue.jobTitle        || initialValue.title       || "",
        sourceId:        initialValue.sourceId        || initialValue.SourceId    || 0,
        companyName:     initialValue.companyName     || "",
        description:     initialValue.description     || "",
        location:        initialValue.location        || "",
        jobType:         initialValue.jobType         || "Full-time",
        experienceLevel: initialValue.experienceLevel || "Entry Level",
        salaryMin:       initialValue.salaryMin       ?? 0,
        salaryMax:       initialValue.salaryMax       ?? 0,
        externalUrl:     initialValue.externalUrl     || "",
        expiryDate:      expiry,
      });
    } else {
      setForm(emptyJobForm);
    }
  }, [initialValue, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  const update = (e) => {
    const { name, value, type } = e.target;
    setForm((p) => ({
      ...p,
      [name]: (type === "number" || name === "sourceId" || name === "salaryMin" || name === "salaryMax")
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      expiryDate: form.expiryDate
        ? new Date(form.expiryDate).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
    const ok = await onSubmit(payload);
    if (ok) onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ animation: "fadeIn 0.2s ease both" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl"
        style={{ animation: "slideUp 0.3s cubic-bezier(0.16,1,0.3,1) both" }}
      >
        {/* Header gradient strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-admin-main to-slate-400" />

        <div className="flex items-center justify-between border-b border-slate-100 px-7 py-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-admin-main opacity-60">
              Administrative Control
            </p>
            <h2 className="text-xl font-black text-slate-900">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-500 active:scale-90"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[72vh] space-y-5 overflow-y-auto px-7 py-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Job Title" required>
              <Input name="jobTitle" value={form.jobTitle} onChange={update} required className="!gap-0" />
            </Field>
            <Field label="Company Name" required>
              <Input name="companyName" value={form.companyName} onChange={update} required className="!gap-0" />
            </Field>
          </div>

          {/* Description */}
          <Field label="Description" required>
            <textarea
              name="description"
              value={form.description}
              onChange={update}
              className={`${inputCls} min-h-[90px] resize-none`}
              required
            />
          </Field>

          {/* Row 2 */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field label="Location">
              <Input name="location" value={form.location} onChange={update} className="!gap-0" />
            </Field>
            <Field label="Job Type">
              <select name="jobType" value={form.jobType} onChange={update} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:bg-white transition-all">
                {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Experience Level">
              <select name="experienceLevel" value={form.experienceLevel} onChange={update} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:bg-white transition-all">
                {EXP_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </Field>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Min Salary ($)">
              <input type="number" name="salaryMin" min="0" value={form.salaryMin} onChange={update} className={inputCls} />
            </Field>
            <Field label="Max Salary ($)">
              <input type="number" name="salaryMax" min="0" value={form.salaryMax} onChange={update} className={inputCls} />
            </Field>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="External URL">
              <input type="url" name="externalUrl" value={form.externalUrl} onChange={update} className={inputCls} placeholder="https://..." />
            </Field>
            <Field label="Expiry Date">
              <input type="date" name="expiryDate" value={form.expiryDate} onChange={update} className={inputCls} />
            </Field>
          </div>

          {/* Source */}
          <Field label="Job Source" required>
            <select name="sourceId" value={form.sourceId} onChange={update} className={inputCls} required>
              <option value={0}>Select source…</option>
              {jobSources.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.sourceName || s.name}
                </option>
              ))}
            </select>
          </Field>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-8">
            <Button variant="secondary" onClick={onClose} disabled={isSaving}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={isSaving} icon="💾">
               Save Job
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

// ─── Stats Bar ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, color = "bg-blue-50 text-[var(--color-primary)]", delay = 0 }) => (
  <div
    className="flex items-center gap-4 rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm transition duration-200 hover:shadow-md"
    style={{ animation: `fadeSlideUp 0.4s ease both ${delay}ms` }}
  >
    <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl text-lg ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-black text-slate-900">{value}</p>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
    </div>
  </div>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const JobsManager = () => {
  const { jobs, isLoading, isSaving, error, fetchJobs, saveJob, deleteJob } = useAdminJobs();
  const { jobSources, fetchJobSources } = useAdminJobSources();

  const [searchTerm, setSearchTerm]   = useState("");
  const [filterType, setFilterType]   = useState("");
  const [filterExp, setFilterExp]     = useState("");
  const [modal, setModal]             = useState({ isOpen: false, item: null });

  useEffect(() => {
    fetchJobs();
    fetchJobSources({ onlyActive: false });
  }, [fetchJobs, fetchJobSources]);

  // Client-side filtering (search already sent to API on submit)
  const visibleJobs = useMemo(() => {
    let list = jobs;
    if (filterType) list = list.filter((j) => j.jobType === filterType);
    if (filterExp)  list = list.filter((j) => j.experienceLevel === filterExp);
    return list;
  }, [jobs, filterType, filterExp]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(searchTerm);
  };

  const openCreate = () => setModal({ isOpen: true, item: null });
  const openEdit   = (job) => setModal({ isOpen: true, item: job });
  const handleSave = (payload) => saveJob(payload, modal.item?.id || null);

  const handleDelete = async (job) => {
    const name = job.jobTitle || job.title || `#${job.id}`;
    if (window.confirm(`Delete "${name}"?`)) await deleteJob(job.id);
  };

  // Stats
  const stats = useMemo(() => {
    const total    = jobs.length;
    const active   = jobs.filter((j) => !j.expiryDate || new Date(j.expiryDate) > Date.now()).length;
    
    // Normalize string for comparison
    const norm = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

    const fullTime = jobs.filter((j) => {
      const type = norm(j.jobType || j.JobType);
      return type === "fulltime";
    }).length;

    const remote = jobs.filter((j) => {
      const type = norm(j.jobType || j.JobType);
      const loc  = (j.location || j.Location || "").toLowerCase();
      return type === "remote" || loc.includes("remote");
    }).length;

    return { total, active, fullTime, remote };
  }, [jobs]);

  return (
    <>
      {/* Keyframe animations injected once */}
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

        {/* ── Page Header ── */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">
              Admin Module
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Jobs
            </h1>
            <p className="mt-2 max-w-xl text-sm font-medium text-slate-500">
              Manage job listings across all connected sources.
            </p>
          </div>
          <Button variant="primary" onClick={openCreate} disabled={isSaving} icon="+">
             New Job
          </Button>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total Jobs"  value={stats.total}    icon="📋" delay={0}   />
          <StatCard label="Active"      value={stats.active}   icon="✅" color="bg-emerald-50 text-emerald-600" delay={60}  />
          <StatCard label="Full-time"   value={stats.fullTime} icon="🏢" color="bg-indigo-50 text-indigo-600"   delay={120} />
          <StatCard label="Remote"      value={stats.remote}   icon="🌍" color="bg-violet-50 text-violet-600"   delay={180} />
        </div>

        {/* ── Error Banner ── */}
        {error && (
          <div
            className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-600"
            style={{ animation: "fadeSlideUp 0.3s ease both" }}
          >
            <span className="text-lg">⚠️</span> {error}
          </div>
        )}

        {/* ── Search & Filters ── */}
        <form
          onSubmit={handleSearch}
          className="flex flex-wrap items-center gap-3 rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm"
        >
          <div className="flex-1 min-w-[200px]">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by job title…"
              className="!gap-0"
              icon="🔍"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-slate-500 outline-none transition focus:border-[var(--color-primary)]"
          >
            <option value="">All Types</option>
            {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            value={filterExp}
            onChange={(e) => setFilterExp(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-slate-500 outline-none transition focus:border-[var(--color-primary)]"
          >
            <option value="">All Levels</option>
            {EXP_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <Button type="submit" variant="primary" isLoading={isLoading} className="!px-6 !py-3">
             Search
          </Button>
          {(searchTerm || filterType || filterExp) && (
            <Button
              variant="text"
              onClick={() => { setSearchTerm(""); setFilterType(""); setFilterExp(""); fetchJobs(); }}
            >
              Clear
            </Button>
          )}
        </form>

        {/* ── Jobs Grid ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} delay={i * 80} />
            ))}
          </div>
        ) : visibleJobs.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-slate-200 bg-white px-6 py-24 text-center"
            style={{ animation: "fadeSlideUp 0.4s ease both" }}
          >
            <span className="mb-4 text-5xl">🔍</span>
            <h3 className="text-lg font-black text-slate-700">No jobs found</h3>
            <p className="mt-2 text-sm font-medium text-slate-400">
              Try adjusting your filters or create a new listing.
            </p>
            <div className="mt-6">
              <Button variant="primary" onClick={openCreate} icon="+">Create First Job</Button>
            </div>
          </div>
        ) : (
          <>
            <p
              className="text-[11px] font-black uppercase tracking-widest text-slate-400"
              style={{ animation: "fadeSlideUp 0.3s ease both" }}
            >
              Showing {visibleJobs.length} result{visibleJobs.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visibleJobs.map((job, i) => (
                <JobCard
                  key={job.id}
                  job={job}
                  jobSources={jobSources}
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

      {/* ── Modal ── */}
      <JobModal
        isOpen={modal.isOpen}
        title={modal.item?.id ? "Edit Job Listing" : "Create Job Listing"}
        initialValue={modal.item}
        isSaving={isSaving}
        onClose={() => setModal({ isOpen: false, item: null })}
        onSubmit={handleSave}
        jobSources={jobSources}
      />
    </>
  );
};

export default JobsManager;
