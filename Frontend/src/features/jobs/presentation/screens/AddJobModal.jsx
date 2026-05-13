// src/features/jobs/presentation/screens/AddJobModal.jsx

import React, { useEffect, useState } from "react";
import Button from "../../../../core/ui_components/Button";
import { useJobSources } from "../../hooks/useJobSources";

const emptyForm = {
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

const AddJobModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState(emptyForm);
  const { sources, fetchSources } = useJobSources();

  useEffect(() => {
    if (isOpen) {
      setFormData(emptyForm);
      fetchSources(false); // fetch all sources (active & inactive)
    }
  }, [isOpen, fetchSources]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" || name === "sourceId" || name === "salaryMin" || name === "salaryMax"
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      expiryDate: formData.expiryDate
        ? new Date(formData.expiryDate).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
    const success = await onSubmit(payload);
    if (success) onClose();
  };

  const inputCls = "w-full p-2.5 bg-slate-50 rounded-xl outline-none border border-gray-200 text-sm font-bold focus:border-[var(--color-primary)] focus:bg-white transition";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-black text-gray-800">Add New Job</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 font-bold text-xl">✕</button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form id="job-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Job Title *</label>
                <input type="text" name="jobTitle" required value={formData.jobTitle} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Company Name *</label>
                <input type="text" name="companyName" required value={formData.companyName} onChange={handleChange} className={inputCls} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Description *</label>
              <textarea name="description" required value={formData.description} onChange={handleChange} className={`${inputCls} h-24 resize-none`} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Job Type</label>
                <select name="jobType" value={formData.jobType} onChange={handleChange} className={inputCls}>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Experience Level</label>
                <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className={inputCls}>
                  <option value="Entry Level">Entry Level</option>
                  <option value="Junior">Junior</option>
                  <option value="Mid Level">Mid Level</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Min Salary</label>
                <input type="number" name="salaryMin" min="0" value={formData.salaryMin} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Max Salary</label>
                <input type="number" name="salaryMax" min="0" value={formData.salaryMax} onChange={handleChange} className={inputCls} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">External URL (Application Link)</label>
              <input type="url" name="externalUrl" value={formData.externalUrl} onChange={handleChange} className={inputCls} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Expiry Date</label>
                <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Job Source *</label>
                <select name="sourceId" value={formData.sourceId} onChange={handleChange} className={inputCls} required>
                  <option value={0}>Select source...</option>
                  {sources.map((s) => (
                    <option key={s.id} value={s.id}>{s.sourceName || s.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-gray-100 flex gap-3 shrink-0">
          <Button type="button" onClick={onClose} className="flex-1 !bg-gray-100 !text-gray-600 border">Cancel</Button>
          <Button type="submit" form="job-form" isLoading={isLoading} className="flex-1 shadow-lg shadow-primary/20">Post Job</Button>
        </div>
      </div>
    </div>
  );
};

export default AddJobModal;
