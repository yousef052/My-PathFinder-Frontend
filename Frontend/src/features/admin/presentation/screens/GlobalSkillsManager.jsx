import React, { useEffect, useMemo, useState } from "react";
import { useAdminGlobalSkills } from "../../hooks/useAdminGlobalSkills";

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

const PrimaryBtn = ({ children, type = "button", onClick, disabled }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className="inline-flex items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-blue-100 transition duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-blue-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap w-full"
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
const SkeletonChips = () => (
  <div className="flex flex-wrap gap-3">
    {[...Array(15)].map((_, i) => (
      <div
        key={i}
        className="h-9 animate-pulse rounded-xl bg-slate-100"
        style={{ width: `${Math.max(60, Math.random() * 120)}px`, animationDelay: `${i * 30}ms` }}
      />
    ))}
  </div>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const GlobalSkillsManager = () => {
  const { skills, isLoading, isSaving, error, fetchSkills, createSkill } = useAdminGlobalSkills();
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    skillName: "",
    category: "",
    description: "",
    isTechnical: false
  });

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const visibleSkills = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    if (!needle) return skills;
    return skills.filter((s) => (s.skillName || s.name || s.SkillName || s.Name || "").toLowerCase().includes(needle));
  }, [skills, searchTerm]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.skillName.trim()) return;
    const success = await createSkill({ 
      skillName: formData.skillName.trim(),
      category: formData.category.trim(),
      description: formData.description.trim(),
      isTechnical: formData.isTechnical,
    });
    if (success) {
      setFormData({ skillName: "", category: "", description: "", isTechnical: false });
      setSearchTerm(""); 
    }
  };

  const handleDelete = async (skill) => {
    const name = skill.skillName || skill.name || `#${skill.id}`;
    if (window.confirm(`Delete skill "${name}" from global database?`)) {
      await deleteGlobalSkill(skill.id);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>

      <div className="space-y-8 pb-24" style={{ animation: "fadeSlideUp 0.35s ease both" }}>
        
        {/* ── Header ── */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">
              Admin Module
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Global Skills
            </h1>
            <p className="mt-2 max-w-xl text-sm font-medium text-slate-500">
              Manage the global database of skills used in matching and tagging.
            </p>
          </div>
        </div>

        {/* ── Error Banner ── */}
        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-600" style={{ animation: "fadeSlideUp 0.3s ease both" }}>
            <span className="text-lg">⚠️</span> {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3 items-start">
          
          {/* ── Left Column: Skills List ── */}
          <section className="lg:col-span-2 overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-50/50">
            <div className="border-b border-slate-50 p-6 bg-slate-50/50">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search skills..."
                className={inputCls}
              />
            </div>

            <div className="p-8">
              {isLoading ? (
                <SkeletonChips />
              ) : visibleSkills.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-slate-50/50 px-6 py-16 text-center" style={{ animation: "fadeSlideUp 0.4s ease both" }}>
                  <span className="mb-4 text-4xl text-slate-300">🎯</span>
                  <h3 className="text-base font-black text-slate-600">No skills found</h3>
                  <p className="mt-1 text-xs font-bold text-slate-400">Add a new skill using the form.</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2.5">
                  {visibleSkills.map((skill, i) => (
                    <div
                      key={skill.id}
                      className="group flex cursor-default flex-col gap-1 rounded-xl border border-slate-100 bg-white px-4 py-3 text-xs font-black text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-primary)]/30 hover:bg-blue-50/50 hover:shadow-md min-w-[120px] relative pr-10"
                      style={{ animation: `fadeSlideUp 0.3s ease both ${Math.min(i * 15, 500)}ms` }}
                    >
                      <span className="text-slate-900">{skill.skillName || skill.name || skill.SkillName || "Unnamed"}</span>
                      {skill.category && (
                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{skill.category}</span>
                      )}
                      {skill.isTechnical && (
                        <span className="mt-1 w-fit rounded-full bg-blue-100 px-1.5 py-0.5 text-[8px] text-blue-600 uppercase tracking-tighter">Technical</span>
                      )}
                      <button
                        onClick={() => handleDelete(skill)}
                        disabled={isSaving}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                        title="Delete Skill"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ── Right Column: Add Form ── */}
          <section className="sticky top-24 rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-50/50">
            <div className="mb-8 border-b border-slate-50 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[#818cf8] text-xl text-white shadow-sm mb-4">
                ✨
              </div>
              <h2 className="text-xl font-black text-slate-900">Add New Skill</h2>
              <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Expand the database</p>
            </div>

            <form onSubmit={handleAdd} className="space-y-5">
              <Field label="Skill Name" required>
                <input
                  name="skillName"
                  value={formData.skillName}
                  onChange={(e) => setFormData(p => ({ ...p, skillName: e.target.value }))}
                  className={inputCls}
                  placeholder="e.g. React.js"
                  required
                />
              </Field>
              <Field label="Category" required>
                <input
                  name="category"
                  value={formData.category}
                  onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                  className={inputCls}
                  placeholder="e.g. Frontend"
                  required
                />
              </Field>
              <Field label="Description">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                  className={`${inputCls} min-h-[80px] resize-none`}
                  placeholder="What is this skill about?"
                />
              </Field>
              <div className="flex items-center gap-3 py-2">
                <input 
                  type="checkbox" 
                  id="isTechnical"
                  checked={formData.isTechnical}
                  onChange={(e) => setFormData(p => ({ ...p, isTechnical: e.target.checked }))}
                  className="h-5 w-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                <label htmlFor="isTechnical" className="text-sm font-bold text-slate-700">Technical Skill</label>
              </div>
              <div className="pt-2">
                <PrimaryBtn type="submit" disabled={isSaving || !formData.skillName.trim()}>
                  {isSaving ? (
                    <span className="flex items-center gap-2">
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Adding...
                    </span>
                  ) : (
                    "+ Add to Database"
                  )}
                </PrimaryBtn>
              </div>
            </form>
          </section>
        </div>
      </div>
    </>
  );
};

export default GlobalSkillsManager;
