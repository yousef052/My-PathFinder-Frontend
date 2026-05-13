import React, { useState } from "react";
import { useExperience } from "../../hooks/useExperience";

const inputCls =
  "w-full p-4 rounded-2xl bg-white border border-slate-100 outline-none font-bold text-sm shadow-sm focus:border-[var(--color-primary)] focus:ring-4 focus:ring-blue-50/50 transition-all placeholder:text-gray-300";

const ExperienceSection = () => {
  const { experiences, isLoading, isSubmitting, handleAdd, handleDelete } =
    useExperience();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    position: "",
    description: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    employmentType: "FullTime",
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: formData.isCurrent
        ? new Date().toISOString()
        : new Date(formData.endDate).toISOString(),
    };
    if (await handleAdd(payload)) {
      setShowForm(false);
      setFormData({
        companyName: "",
        position: "",
        description: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
        employmentType: "FullTime",
      });
    }
  };

  return (
    <div className="glass-card p-10 md:p-12 rounded-[4rem] border border-white/50 shadow-glass">
      <div className="flex justify-between items-center mb-12 px-2">
        <h3 className="text-3xl font-black text-slate-900 italic tracking-tight flex items-center gap-4">
          <div className="w-14 h-14 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-3xl shadow-inner">💼</div>
          Experience Timeline
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
            showForm 
              ? "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white" 
              : "bg-primary text-white hover:-translate-y-1 shadow-primary/20"
          }`}
        >
          {showForm ? "✕ Terminate" : "+ Add Experience"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={onSubmit}
          className="bg-white/40 backdrop-blur-xl p-10 rounded-[3rem] mb-16 border border-white/60 space-y-8 animate-fade-in shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="ml-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Position</label>
              <input
                required
                type="text"
                placeholder="e.g. Senior Frontend Architect"
                className={inputCls}
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="ml-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Company</label>
              <input
                required
                type="text"
                placeholder="e.g. Meta"
                className={inputCls}
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="ml-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Employment Type</label>
              <select
                className={inputCls}
                value={formData.employmentType}
                onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
              >
                <option value="FullTime">Full-Time</option>
                <option value="PartTime">Part-Time</option>
                <option value="Freelance">Freelance</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div className="flex items-center gap-4 px-6 h-[64px] bg-white rounded-2xl shadow-sm border border-slate-100 self-end">
              <input
                type="checkbox"
                id="isCurrent"
                checked={formData.isCurrent}
                onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                className="w-5 h-5 accent-primary cursor-pointer"
              />
              <label htmlFor="isCurrent" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] cursor-pointer select-none">
                Active Role
              </label>
            </div>
            <div className="space-y-2">
              <label className="ml-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Start Date</label>
              <input
                required
                type="date"
                className={inputCls}
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            {!formData.isCurrent && (
              <div className="space-y-2 animate-fade-in">
                <label className="ml-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">End Date</label>
                <input
                  required
                  type="date"
                  className={inputCls}
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="ml-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Impact Summary</label>
            <textarea
              placeholder="Detail your technical contributions..."
              rows={4}
              className={`${inputCls} resize-none`}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-6 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : "Integrate Experience"}
          </button>
        </form>
      )}

      <div className="space-y-10">
        {isLoading ? (
          <div className="space-y-8">
            <div className="h-44 bg-slate-50/50 rounded-[3rem] animate-pulse" />
            <div className="h-44 bg-slate-50/50 rounded-[3rem] animate-pulse" />
          </div>
        ) : experiences.length === 0 && !showForm ? (
          <div className="text-center py-24 bg-slate-50/30 rounded-[4rem] border-2 border-dashed border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl opacity-20">💼</div>
            <p className="text-slate-300 font-black text-[10px] uppercase tracking-[0.4em]">
              Timeline is currently empty
            </p>
          </div>
        ) : (
          experiences.map((exp, index) => (
            <div
              key={exp.id || index}
              className="group relative bg-white/60 backdrop-blur-xl p-10 rounded-[3rem] border border-white shadow-sm transition-all hover:shadow-2xl hover:bg-white hover:-translate-y-1"
            >
              <button
                onClick={() => handleDelete(exp.id)}
                className="absolute top-10 right-10 w-10 h-10 bg-red-50 text-red-300 hover:bg-red-500 hover:text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all active:scale-90"
              >
                ✕
              </button>
              
              <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
                <div className="space-y-2">
                  <div className="inline-flex rounded-full bg-primary/10 px-4 py-1.5 text-[8px] font-black uppercase tracking-widest text-primary mb-2">Verified Experience</div>
                  <h4 className="text-3xl font-black text-slate-900 tracking-tighter leading-tight italic">
                    {exp.position}
                  </h4>
                  <p className="text-slate-400 font-black text-[11px] uppercase tracking-[0.25em]">
                    {exp.companyName} <span className="mx-2 opacity-20">•</span> {exp.employmentType}
                  </p>
                </div>
                <div className="self-start">
                  <div className="px-6 py-3 rounded-2xl bg-white border border-slate-100 text-slate-500 font-black text-[10px] uppercase tracking-widest shadow-sm">
                    {new Date(exp.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} —{" "}
                    {exp.isCurrent
                      ? <span className="text-primary">Present</span>
                      : new Date(exp.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-50">
                 <p className="text-sm text-slate-500 leading-relaxed font-medium">
                   {exp.description || "No tactical details provided for this role."}
                 </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExperienceSection;
