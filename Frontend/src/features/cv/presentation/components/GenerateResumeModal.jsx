// src/features/cv/presentation/components/GenerateResumeModal.jsx
import React, { useState } from "react";
import Button from "../../../../core/ui_components/Button";
import { useResumeBuilder } from "../../hooks/useResumeBuilder";

const GenerateResumeModal = ({ isOpen, onClose }) => {
  const { generateAndDownloadResume, isGenerating, error } = useResumeBuilder();
  const [formData, setFormData] = useState({
    targetJobTitle: "",
    style: "Professional",
    language: "English",
    additionalNotes: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.targetJobTitle) return;

    const success = await generateAndDownloadResume(formData); // تنفيذ التوليد[cite: 29]
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden border border-gray-100">
        <div className="p-8 border-b border-gray-50 bg-gradient-to-r from-[#5b7cfa] to-[#3652d9] text-white text-center">
          <span className="text-5xl block mb-3">📄</span>
          <h2 className="text-2xl font-black italic tracking-tight">
            AI Resume Builder
          </h2>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80">
            Intelligence Powered CV
          </p>
        </div>

        <div className="p-8 space-y-6">
          {error && (
            <div className="text-[11px] font-bold text-red-500 bg-red-50 p-4 rounded-2xl border border-red-100 text-center animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Target Job Title *
              </label>
              <input
                required
                value={formData.targetJobTitle}
                onChange={(e) =>
                  setFormData({ ...formData, targetJobTitle: e.target.value })
                }
                className="w-full p-4 bg-slate-50 border border-gray-100 rounded-2xl text-sm font-bold focus:bg-white outline-none transition-all"
                placeholder="e.g. .NET Backend Developer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Style
                </label>
                <select
                  value={formData.style}
                  onChange={(e) =>
                    setFormData({ ...formData, style: e.target.value })
                  }
                  className="w-full p-4 bg-slate-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none"
                >
                  <option value="Professional">Professional</option>
                  <option value="Modern">Modern</option>
                  <option value="Creative">Creative</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Language
                </label>
                <select
                  value={formData.language}
                  onChange={(e) =>
                    setFormData({ ...formData, language: e.target.value })
                  }
                  className="w-full p-4 bg-slate-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none"
                >
                  <option value="English">English</option>
                  <option value="Arabic">Arabic</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Notes (Optional)
              </label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) =>
                  setFormData({ ...formData, additionalNotes: e.target.value })
                }
                className="w-full p-4 bg-slate-50 border border-gray-100 rounded-2xl text-sm font-medium h-24 resize-none outline-none"
                placeholder="Any specific focus?"
              />
            </div>

            <div className="pt-4 flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 text-gray-400 font-black text-[10px] uppercase"
              >
                Cancel
              </button>
              <Button
                type="submit"
                isLoading={isGenerating}
                className="flex-[2] py-4 shadow-xl shadow-blue-100"
              >
                {isGenerating ? "Generating..." : "Download PDF"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GenerateResumeModal;
