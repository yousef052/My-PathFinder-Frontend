// src/features/profile/presentation/components/ExperienceSection.jsx
import React, { useState } from "react";
import { useExperience } from "../../hooks/useExperience";

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
    <div className="bg-white p-10 rounded-[3rem] border border-white shadow-xl shadow-blue-50/30">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-2xl font-black text-gray-900 italic tracking-tight">
          💼 Experience
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-50 text-[#5b7cfa] hover:bg-[#5b7cfa] hover:text-white px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
        >
          {showForm ? "Cancel" : "+ Add Experience"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={onSubmit}
          className="bg-slate-50 p-8 rounded-[2.5rem] mb-10 border border-slate-100 space-y-6 animate-fade-in"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              required
              type="text"
              placeholder="Position"
              className="p-4 rounded-2xl bg-white border-none outline-none font-bold text-sm shadow-inner"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
            />
            <input
              required
              type="text"
              placeholder="Company"
              className="p-4 rounded-2xl bg-white border-none outline-none font-bold text-sm shadow-inner"
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
            />
            <select
              className="p-4 rounded-2xl bg-white border-none font-bold text-sm shadow-inner"
              value={formData.employmentType}
              onChange={(e) =>
                setFormData({ ...formData, employmentType: e.target.value })
              }
            >
              <option value="FullTime">Full-Time</option>
              <option value="PartTime">Part-Time</option>
              <option value="Freelance">Freelance</option>
            </select>
            <div className="flex items-center gap-3 px-4 bg-white rounded-2xl shadow-inner">
              <input
                type="checkbox"
                checked={formData.isCurrent}
                onChange={(e) =>
                  setFormData({ ...formData, isCurrent: e.target.checked })
                }
                className="w-5 h-5 accent-[#5b7cfa]"
              />
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Current Job
              </label>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#5b7cfa] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 active:scale-95 transition-all"
          >
            Save Experience
          </button>
        </form>
      )}

      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div
            key={exp.id || index}
            className="group relative bg-slate-50/50 p-8 rounded-[2.5rem] border border-transparent hover:border-blue-100 hover:bg-white transition-all hover:shadow-xl hover:shadow-blue-50"
          >
            <button
              onClick={() => handleDelete(exp.id)}
              className="absolute top-8 right-8 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            >
              🗑️
            </button>
            <div className="flex flex-col md:flex-row justify-between mb-4 gap-2">
              <h4 className="text-xl font-black text-gray-900 tracking-tight">
                {exp.position}
              </h4>
              <span className="text-[10px] font-black text-[#5b7cfa] bg-blue-50 px-4 py-1.5 rounded-full uppercase tracking-tighter self-start">
                {new Date(exp.startDate).getFullYear()} —{" "}
                {exp.isCurrent
                  ? "Present"
                  : new Date(exp.endDate).getFullYear()}
              </span>
            </div>
            <p className="text-[#5b7cfa] font-black text-xs uppercase tracking-widest mb-4">
              {exp.companyName} • {exp.employmentType}
            </p>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              {exp.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceSection;
