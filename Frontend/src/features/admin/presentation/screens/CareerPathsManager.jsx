import React, { useEffect, useMemo, useState } from "react";
import { useAdminCareerPaths } from "../../hooks/useAdminCareerPaths";

const emptyPathForm = {
  careerPathName: "",
  description: "",
  difficultyLevel: "Beginner",
  durationInMonths: 1,
  categoryId: 0,
};

const emptyPathCourseForm = {
  courseId: 0,
  orderNumber: 1,
  isRequired: true,
  completionCriteria: "Complete the course",
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

const PrimaryBtn = ({ children, type = "button", onClick, disabled, className = "" }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-blue-100 transition duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-blue-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

const GhostBtn = ({ children, type = "button", onClick, disabled, className = "" }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-500 transition duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] active:scale-95 disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

// ─── Skeleton Loaders ────────────────────────────────────────────────────────
const SkeletonPathCard = ({ delay = 0 }) => (
  <div
    className="flex flex-col rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm"
    style={{ animation: `fadeSlideUp 0.4s ease both ${delay}ms` }}
  >
    <div className="mb-4 flex items-start justify-between gap-4">
      <div className="h-12 w-12 animate-pulse rounded-2xl bg-slate-100" />
      <div className="h-5 w-20 animate-pulse rounded-lg bg-slate-100" />
    </div>
    <div className="space-y-2">
      <div className="h-5 w-3/4 animate-pulse rounded-lg bg-slate-100" />
      <div className="h-3 w-1/2 animate-pulse rounded-lg bg-slate-100" />
    </div>
    <div className="mt-6 flex gap-2">
      <div className="h-8 w-24 animate-pulse rounded-xl bg-slate-100" />
      <div className="h-8 w-16 animate-pulse rounded-xl bg-slate-100" />
    </div>
  </div>
);

const StatCard = ({ label, value, icon, color = "bg-blue-50 text-[var(--color-primary)]", delay = 0 }) => (
  <div
    className="flex items-center gap-4 rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md"
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

// ─── Career Path Card ─────────────────────────────────────────────────────────
const CareerPathCard = ({ path, categories, onEdit, onDelete, onCourses, isSaving, delay = 0 }) => {
  const name = path.careerPathName || path.name || path.Name || "Untitled Path";
  const catName = categories.find(c => c.id === path.categoryId)?.name || path.categoryName || "Uncategorized";
  
  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-primary)]/20 hover:shadow-xl hover:shadow-blue-50/70"
      style={{ animation: `fadeSlideUp 0.45s cubic-bezier(0.16,1,0.3,1) both ${delay}ms` }}
    >
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-[2.5rem] bg-gradient-to-r from-[var(--color-primary)] to-[#a78bfa] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 text-2xl shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          🚀
        </div>
        <div className="text-right">
          <span className="inline-block rounded-xl bg-slate-50 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-[var(--color-primary)] border border-slate-100">
            {path.difficultyLevel || "Beginner"}
          </span>
          <p className="mt-1.5 text-[10px] font-bold text-slate-400">
            {path.durationInMonths || 1} Month{path.durationInMonths !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-black leading-snug text-slate-900 line-clamp-2" title={name}>
          {name}
        </h3>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {catName}
        </p>

        <p className="mt-4 text-xs font-medium leading-relaxed text-slate-500 line-clamp-3">
          {path.description || "No description provided for this career path."}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-5">
        <div className="flex items-center gap-1.5">
           <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px]">📚</span>
           <span className="text-[11px] font-black text-slate-600">{path.estimatedCoursesCount || 0} Modules</span>
        </div>
        
        <div className="flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onCourses(path)}
            className="flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-white active:scale-95"
          >
            Modules
          </button>
          <button
            type="button"
            onClick={() => onEdit(path)}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition hover:bg-[var(--color-primary)] hover:text-white active:scale-95"
            title="Edit"
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={() => onDelete(path)}
            disabled={isSaving}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-500 hover:text-white active:scale-95 disabled:opacity-40"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
    </article>
  );
};

// ─── Path Modal ───────────────────────────────────────────────────────────────
const PathModal = ({ isOpen, initialValue, isSaving, onClose, onSubmit, categories }) => {
  const [formData, setFormData] = useState(emptyPathForm);

  useEffect(() => {
    setFormData(initialValue || emptyPathForm);
  }, [initialValue, isOpen]);

  if (!isOpen) return null;

  const updateField = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Id") || name === "durationInMonths" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await onSubmit(formData);
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ animation: "fadeIn 0.2s ease both" }}>
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl" style={{ animation: "slideUp 0.3s cubic-bezier(0.16,1,0.3,1) both" }}>
        <div className="h-1 w-full bg-gradient-to-r from-[var(--color-primary)] via-[#818cf8] to-[#a78bfa]" />

        <div className="flex items-center justify-between border-b border-slate-100 px-7 py-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)]">Career Path</p>
            <h2 className="text-xl font-black text-slate-900">{initialValue?.id ? "Edit Path" : "Create Path"}</h2>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-500 active:scale-90">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex max-h-[80vh] flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-7 space-y-5">
            <Field label="Path Name" required>
              <input name="careerPathName" value={formData.careerPathName} onChange={updateField} className={inputCls} required />
            </Field>

            <Field label="Description" required>
              <textarea name="description" value={formData.description} onChange={updateField} className={`${inputCls} min-h-[100px] resize-none`} required />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Difficulty Level" required>
                <select name="difficultyLevel" value={formData.difficultyLevel} onChange={updateField} className={inputCls} required>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </Field>
              <Field label="Duration (Months)" required>
                <input type="number" min="1" name="durationInMonths" value={formData.durationInMonths} onChange={updateField} className={inputCls} required />
              </Field>
            </div>

            <Field label="Category" required>
              <select name="categoryId" value={formData.categoryId} onChange={updateField} className={inputCls} required>
                <option value={0}>Select Category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name || cat.categoryName}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 p-6 bg-slate-50/50">
            <GhostBtn onClick={onClose} disabled={isSaving}>Cancel</GhostBtn>
            <PrimaryBtn type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Path"}
            </PrimaryBtn>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Linked Courses Sub-Modal ──────────────────────────────────────────────────
const LinkedCoursesModal = ({ isOpen, careerPath, pathCourses, allCourses, isLoading, isSaving, onClose, onLink, onUnlink }) => {
  const [formData, setFormData] = useState(emptyPathCourseForm);

  useEffect(() => {
    if (isOpen) setFormData(emptyPathCourseForm);
  }, [isOpen]);

  if (!isOpen || !careerPath) return null;

  const updateField = (event) => {
    const { name, type, checked, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "courseId" || name === "orderNumber" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await onLink(formData);
    if (success) setFormData(emptyPathCourseForm);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ animation: "fadeIn 0.2s ease both" }}>
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={onClose} />

      <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2.5rem] bg-white shadow-2xl" style={{ animation: "slideUp 0.3s cubic-bezier(0.16,1,0.3,1) both" }}>
        
        <div className="flex items-center justify-between border-b border-slate-100 px-8 py-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)]">Path Modules Builder</p>
            <h2 className="text-2xl font-black text-slate-900">{careerPath.careerPathName || careerPath.name}</h2>
          </div>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition hover:bg-red-50 hover:text-red-500 active:scale-90">✕</button>
        </div>

        <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
          {/* Left Side: Form */}
          <div className="w-full lg:w-[400px] border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50/50 p-8 overflow-y-auto">
            <h3 className="mb-6 text-base font-black text-slate-800">Attach a Module</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Field label="Select Course" required>
                <select name="courseId" value={formData.courseId} onChange={updateField} className={inputCls} required>
                  <option value={0}>Select a course to attach...</option>
                  {allCourses.map((c) => (
                    <option key={c.id} value={c.id}>{c.name || c.title || c.courseName || `Course #${c.id}`}</option>
                  ))}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Sequence Order" required>
                  <input type="number" min="1" name="orderNumber" value={formData.orderNumber} onChange={updateField} className={inputCls} required />
                </Field>
              </div>
              <Field label="Completion Criteria" required>
                <input name="completionCriteria" value={formData.completionCriteria} onChange={updateField} className={inputCls} placeholder="e.g. Pass final quiz" required />
              </Field>
              
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-[var(--color-primary)]/40 cursor-pointer">
                <input type="checkbox" name="isRequired" checked={formData.isRequired} onChange={updateField} className="h-5 w-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
                This is a required module
              </label>

              <div className="pt-4">
                <PrimaryBtn type="submit" disabled={isSaving || !formData.courseId} className="w-full">
                  {isSaving ? "Linking..." : "+ Link Course to Path"}
                </PrimaryBtn>
              </div>
            </form>
          </div>

          {/* Right Side: List */}
          <div className="flex-1 overflow-y-auto bg-white p-8">
            <h3 className="mb-6 text-base font-black text-slate-800">Current Modules ({pathCourses.length})</h3>
            
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                   <div key={i} className="h-24 animate-pulse rounded-[1.5rem] bg-slate-100" />
                ))}
              </div>
            ) : pathCourses.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-slate-200 text-center">
                 <span className="mb-3 text-4xl text-slate-300">🧩</span>
                 <p className="text-sm font-bold text-slate-400">No courses attached yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pathCourses.sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0)).map((item, i) => (
                  <div key={item.id} className="group flex items-center justify-between gap-4 rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm transition hover:border-[var(--color-primary)]/20 hover:shadow-md" style={{ animation: `fadeSlideUp 0.3s ease both ${i * 30}ms` }}>
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-50 font-black text-slate-400 group-hover:bg-blue-50 group-hover:text-[var(--color-primary)]">
                      {item.orderNumber ?? i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-black text-slate-900">
                        {item.courseName || `Course #${item.courseId}`}
                      </p>
                      <div className="mt-1 flex gap-2">
                        {item.isRequired ? (
                           <span className="rounded-lg bg-red-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-red-600">Required</span>
                        ) : (
                           <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-emerald-600">Optional</span>
                        )}
                        <span className="truncate text-xs font-medium text-slate-500">• {item.completionCriteria || "Complete course"}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onUnlink(item.id)}
                      disabled={isSaving}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 opacity-0 transition hover:bg-red-500 hover:text-white group-hover:opacity-100 disabled:opacity-0"
                      title="Remove from path"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const CareerPathsManager = () => {
  const {
    careerPaths,
    pathCourses,
    categories,
    allCourses,
    selectedCareerPath,
    stats,
    isLoading,
    isSaving,
    isCoursesLoading,
    error,
    fetchCareerPaths,
    fetchCategories,
    fetchAllCourses,
    saveCareerPath,
    deleteCareerPath,
    fetchPathCourses,
    linkCourseToPath,
    unlinkCourseFromPath,
    clearSelectedCareerPath,
  } = useAdminCareerPaths();

  const [searchTerm, setSearchTerm] = useState("");
  const [editingPath, setEditingPath] = useState(null);
  const [isPathModalOpen, setIsPathModalOpen] = useState(false);
  const [isCoursesModalOpen, setIsCoursesModalOpen] = useState(false);

  useEffect(() => {
    fetchCareerPaths();
    fetchCategories();
    fetchAllCourses();
  }, [fetchCareerPaths, fetchCategories, fetchAllCourses]);

  const sortedPaths = useMemo(
    () =>
      [...careerPaths].sort((a, b) =>
        (a.careerPathName || a.name || a.Name || "").localeCompare(
          b.careerPathName || b.name || b.Name || "",
        ),
      ),
    [careerPaths],
  );

  const openCreateModal = () => {
    setEditingPath(null);
    setIsPathModalOpen(true);
  };

  const openEditModal = (path) => {
    setEditingPath({
      id: path.id,
      careerPathName: path.careerPathName || path.name || "",
      description: path.description || "",
      difficultyLevel: path.difficultyLevel || "Beginner",
      durationInMonths: path.durationInMonths || 1,
      categoryId: path.categoryId || 0,
    });
    setIsPathModalOpen(true);
  };

  const handleSave = (payload) => saveCareerPath(payload, editingPath?.id);

  const handleDelete = async (path) => {
    const name = path.careerPathName || path.name || `#${path.id}`;
    if (window.confirm(`Delete career path "${name}"?`)) {
      await deleteCareerPath(path.id);
    }
  };

  const openCoursesModal = async (path) => {
    setIsCoursesModalOpen(true);
    await fetchPathCourses(path);
  };

  const closeCoursesModal = () => {
    setIsCoursesModalOpen(false);
    clearSelectedCareerPath();
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
              Career Paths
            </h1>
            <p className="mt-2 max-w-xl text-sm font-medium text-slate-500">
              Create, manage, and assemble learning paths from modular courses.
            </p>
          </div>
          <PrimaryBtn onClick={openCreateModal}>
            + New Career Path
          </PrimaryBtn>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total Paths" value={stats.total} icon="🚀" delay={0} />
          <StatCard label="Beginner" value={stats.beginner} icon="🌱" color="bg-emerald-50 text-emerald-500" delay={40} />
          <StatCard label="Intermediate" value={stats.intermediate || 0} icon="⭐" color="bg-amber-50 text-amber-500" delay={80} />
          <StatCard label="Advanced" value={stats.advanced} icon="🔥" color="bg-red-50 text-red-500" delay={120} />
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-600" style={{ animation: "fadeSlideUp 0.3s ease both" }}>
            <span className="text-lg">⚠️</span> {error}
          </div>
        )}

        {/* Search */}
        <div className="flex flex-wrap items-center gap-3 rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
          <form
            onSubmit={(e) => { e.preventDefault(); fetchCareerPaths(searchTerm); }}
            className="flex w-full items-center gap-3"
          >
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search career paths..."
              className="min-w-[200px] flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700 outline-none transition focus:border-[var(--color-primary)] focus:bg-white"
            />
            <GhostBtn type="submit" disabled={isLoading}>Search API</GhostBtn>
            {searchTerm && (
              <button
                type="button"
                onClick={() => { setSearchTerm(""); fetchCareerPaths(""); }}
                className="px-3 text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {/* Grid List */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(6)].map((_, i) => <SkeletonPathCard key={i} delay={i * 50} />)}
          </div>
        ) : sortedPaths.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-slate-200 bg-white px-6 py-24 text-center" style={{ animation: "fadeSlideUp 0.4s ease both" }}>
             <span className="mb-4 text-5xl">🚀</span>
            <h3 className="text-lg font-black text-slate-700">No career paths found</h3>
            <p className="mt-2 text-sm font-medium text-slate-400">Design your first learning path sequence.</p>
            <div className="mt-6">
              <PrimaryBtn onClick={openCreateModal}>+ Create First Path</PrimaryBtn>
            </div>
          </div>
        ) : (
          <>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400" style={{ animation: "fadeSlideUp 0.3s ease both" }}>
              Showing {sortedPaths.length} path{sortedPaths.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedPaths.map((path, i) => (
                <CareerPathCard
                  key={path.id}
                  path={path}
                  categories={categories}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                  onCourses={openCoursesModal}
                  isSaving={isSaving}
                  delay={i * 40}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <PathModal
        isOpen={isPathModalOpen}
        initialValue={editingPath}
        isSaving={isSaving}
        onClose={() => setIsPathModalOpen(false)}
        onSubmit={handleSave}
        categories={categories}
      />
      
      <LinkedCoursesModal
        isOpen={isCoursesModalOpen}
        careerPath={selectedCareerPath}
        pathCourses={pathCourses}
        allCourses={allCourses}
        isLoading={isCoursesLoading}
        isSaving={isSaving}
        onClose={closeCoursesModal}
        onLink={linkCourseToPath}
        onUnlink={unlinkCourseFromPath}
      />
    </>
  );
};

export default CareerPathsManager;
