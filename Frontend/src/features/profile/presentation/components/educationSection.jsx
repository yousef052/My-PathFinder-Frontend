import React, { useState } from "react";
import { useEducation } from "../../hooks/useEducation";

const inputCls =
  "w-full p-4 rounded-2xl bg-white border border-slate-100 outline-none font-bold text-sm shadow-sm focus:border-[var(--color-primary)] focus:ring-4 focus:ring-blue-50/50 transition-all placeholder:text-gray-300";

const EducationSection = () => {
  const {
    educations,
    isLoading,
    isSubmitting,
    handleAdd,
    handleDelete,
    handleDeleteCertificate,
  } = useEducation();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
  });
  const [selectedCerts, setSelectedCerts] = useState([]);

  const onFormChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onFileChange = (e) => setSelectedCerts(Array.from(e.target.files));

  const onSubmit = async (e) => {
    e.preventDefault();
    const success = await handleAdd(formData, selectedCerts);
    if (success) {
      setShowForm(false);
      setFormData({
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
      });
      setSelectedCerts([]);
    }
  };

  return (
    <div className="glass-card p-10 md:p-12 rounded-[4rem] border border-white/50 shadow-glass">
      <div className="flex justify-between items-center mb-12 px-2">
        <h3 className="text-3xl font-black text-slate-900 italic tracking-tight flex items-center gap-4">
          <div className="w-14 h-14 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-3xl shadow-inner">🎓</div>
          Education History
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
            showForm 
              ? "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white" 
              : "bg-primary text-white hover:-translate-y-1 shadow-primary/20"
          }`}
        >
          {showForm ? "✕ Terminate" : "+ Add Education"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={onSubmit}
          className="bg-white/40 backdrop-blur-xl p-10 rounded-[3rem] mb-16 border border-white/60 space-y-8 animate-fade-in shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="ml-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Institution</label>
              <input
                required
                type="text"
                name="institution"
                placeholder="e.g. Stanford University"
                className={inputCls}
                value={formData.institution}
                onChange={onFormChange}
              />
            </div>
            <div className="space-y-2">
              <label className="ml-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Degree / Qualification</label>
              <input
                required
                type="text"
                name="degree"
                placeholder="e.g. Master of Science"
                className={inputCls}
                value={formData.degree}
                onChange={onFormChange}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="ml-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Field of Specialization</label>
              <input
                required
                type="text"
                name="fieldOfStudy"
                placeholder="e.g. Artificial Intelligence"
                className={inputCls}
                value={formData.fieldOfStudy}
                onChange={onFormChange}
              />
            </div>
            <div className="space-y-2">
              <label className="ml-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Commencement</label>
              <input
                required
                type="date"
                name="startDate"
                className={inputCls}
                value={formData.startDate}
                onChange={onFormChange}
              />
            </div>
            <div className="space-y-2">
              <label className="ml-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Conclusion</label>
              <input
                required
                type="date"
                name="endDate"
                className={inputCls}
                value={formData.endDate}
                onChange={onFormChange}
              />
            </div>

            <div className="md:col-span-2 space-y-3 pt-4">
              <label className="ml-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Upload Credentials</label>
              <div className="relative group cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept=".pdf,image/*"
                  onChange={onFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="w-full p-10 rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white group-hover:border-primary group-hover:bg-primary/5 transition-all flex flex-col items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all">📄</div>
                  <div className="text-center">
                    <p className="text-slate-900 font-black text-[11px] uppercase tracking-[0.2em]">
                      {selectedCerts.length > 0
                        ? `${selectedCerts.length} assets staged`
                        : "Drop certificates for synchronization"}
                    </p>
                    <p className="text-slate-400 text-[9px] font-bold mt-2 uppercase tracking-widest">Max 5MB / PDF or Image</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-6 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : "Integrate Education History"}
          </button>
        </form>
      )}

      <div className="space-y-10">
        {isLoading ? (
          <div className="space-y-8">
            <div className="h-52 bg-slate-50/50 rounded-[3rem] animate-pulse" />
            <div className="h-52 bg-slate-50/50 rounded-[3rem] animate-pulse" />
          </div>
        ) : educations.length === 0 && !showForm ? (
          <div className="text-center py-24 bg-slate-50/30 rounded-[4rem] border-2 border-dashed border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl opacity-20">🎓</div>
            <p className="text-slate-300 font-black text-[10px] uppercase tracking-[0.4em]">
              Academic records not yet localized
            </p>
          </div>
        ) : (
          educations.map((edu) => (
            <div
              key={edu.id || edu.educationId}
              className="group relative bg-white/60 backdrop-blur-xl p-10 rounded-[3rem] border border-white shadow-sm transition-all hover:shadow-2xl hover:bg-white hover:-translate-y-1"
            >
              <button
                onClick={() => handleDelete(edu.id || edu.educationId)}
                className="absolute top-10 right-10 w-10 h-10 bg-red-50 text-red-300 hover:bg-red-500 hover:text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all active:scale-90"
              >
                ✕
              </button>

              <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
                <div className="space-y-2">
                  <div className="inline-flex rounded-full bg-primary/10 px-4 py-1.5 text-[8px] font-black uppercase tracking-widest text-primary mb-2">Verified Credential</div>
                  <h4 className="text-3xl font-black text-slate-900 tracking-tighter leading-tight italic">
                    {edu.institution}
                  </h4>
                  <p className="text-slate-400 font-black text-[11px] uppercase tracking-[0.25em]">
                    {edu.degree} <span className="mx-2 opacity-20">•</span> {edu.fieldOfStudy}
                  </p>
                </div>
                <div className="self-start">
                  <div className="px-6 py-3 rounded-2xl bg-white border border-slate-100 text-slate-500 font-black text-[10px] uppercase tracking-widest shadow-sm">
                    {new Date(edu.startDate).getFullYear()} —{" "}
                    {new Date(edu.endDate).getFullYear()}
                  </div>
                </div>
              </div>

              {edu.certificates && edu.certificates.length > 0 && (
                <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap gap-4">
                  {edu.certificates.map((certUrl, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl text-[10px] font-black border border-slate-100 group/cert hover:border-primary/30 transition-all shadow-sm"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-lg">📄</div>
                      <span className="text-slate-600 uppercase tracking-widest truncate max-w-[140px]">
                        Asset {idx + 1}
                      </span>
                      <button
                        onClick={() => handleDeleteCertificate(edu.id || edu.educationId, certUrl)}
                        className="text-slate-300 hover:text-red-500 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EducationSection;
