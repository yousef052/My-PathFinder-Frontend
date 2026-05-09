import React, { useEffect, useMemo, useState } from "react";
import { useAdminGlobalSkills } from "../../hooks/useAdminGlobalSkills";

const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-[11px] font-black uppercase tracking-widest text-slate-500">
      {label}
    </span>
    {children}
  </label>
);

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none transition focus:border-[#5b7cfa] focus:bg-white";

const PrimaryButton = ({ children, type = "button", onClick, disabled }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className="inline-flex items-center justify-center rounded-2xl bg-[#5b7cfa] px-5 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-blue-100 transition hover:bg-[#3652d9] disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap"
  >
    {children}
  </button>
);

const Spinner = () => (
  <div className="flex items-center justify-center py-16">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#5b7cfa]" />
  </div>
);

const EmptyState = ({ title, message }) => (
  <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
    <h3 className="text-lg font-black text-slate-700">{title}</h3>
    <p className="mt-2 text-sm font-medium text-slate-400">{message}</p>
  </div>
);

const GlobalSkillsManager = () => {
  const { skills, isLoading, isSaving, error, fetchSkills, createSkill } = useAdminGlobalSkills();
  const [searchTerm, setSearchTerm] = useState("");
  const [newSkillName, setNewSkillName] = useState("");

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
    if (!newSkillName.trim()) return;
    const success = await createSkill({ skillName: newSkillName });
    if (success) setNewSkillName("");
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#5b7cfa]">Admin Module</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Global Skills</h1>
          <p className="mt-2 max-w-2xl text-sm font-medium text-slate-500">Manage the global database of skills used in matching and tagging.</p>
        </div>
      </div>

      {error && <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-600">{error}</div>}

      <div className="grid gap-8 lg:grid-cols-3 items-start">
        <section className="lg:col-span-2 overflow-hidden rounded-[2rem] border border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-5">
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Filter skills..." className={`${inputClass} w-full`} />
          </div>

          {isLoading ? <Spinner /> : visibleSkills.length === 0 ? (
            <div className="p-6"><EmptyState title="No skills found" message="No skills match your search or none exist." /></div>
          ) : (
            <div className="p-6">
              <div className="flex flex-wrap gap-3">
                {visibleSkills.map((skill) => (
                  <span key={skill.id} className="px-4 py-2 bg-slate-50 border border-slate-100 text-slate-700 rounded-xl text-sm font-bold shadow-sm">
                    {skill.skillName || skill.name || skill.SkillName || skill.Name || "Unnamed Skill"}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 sticky top-24">
          <h2 className="text-xl font-black text-slate-900 mb-6">Add New Skill</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <Field label="Skill Name">
              <input value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)} className={inputClass} placeholder="e.g. React.js" required />
            </Field>
            <PrimaryButton type="submit" disabled={isSaving || !newSkillName.trim()}>
              {isSaving ? "Adding..." : "+ Add to Database"}
            </PrimaryButton>
          </form>
        </section>
      </div>
    </div>
  );
};

export default GlobalSkillsManager;
