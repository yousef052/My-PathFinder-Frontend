// src/features/careerPath/presentation/screens/CareerPathModal.jsx

import React, { useState } from "react";
import { createPortal } from "react-dom";
// استخدم زرار الـ Button الخاص بك أو أي زرار عادي لو المسار مختلف
import Button from "../../../../core/ui_components/Button";

const CareerPathModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  // مطابقة لأسماء الحقول في الـ API
  const [formData, setFormData] = useState({
    careerPathName: "",
    description: "",
    difficultyLevel: "Beginner",
    durationInMonths: 0,
    categoryId: 0,
    subCategoryId: 0,
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // تحويل الأرقام لـ Number عشان الباك إند ميضربش 400 Bad Request
      [name]:
        name.includes("Id") || name === "durationInMonths"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onSubmit(formData);
    if (success) {
      // تفريغ الحقول بعد النجاح
      setFormData({
        careerPathName: "",
        description: "",
        difficultyLevel: "Beginner",
        durationInMonths: 0,
        categoryId: 0,
        subCategoryId: 0,
      });
      onClose();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-black text-gray-800">
            Add New Career Path
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Path Name
            </label>
            <input
              type="text"
              name="careerPathName"
              required
              value={formData.careerPathName}
              onChange={handleChange}
              className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl focus:border-primary outline-none transition-colors"
              placeholder="e.g. Full-Stack Developer"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl focus:border-primary outline-none transition-colors resize-none h-24"
              placeholder="What is this path about?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                name="difficultyLevel"
                value={formData.difficultyLevel}
                onChange={handleChange}
                className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Duration (Months)
              </label>
              <input
                type="number"
                name="durationInMonths"
                min="1"
                required
                value={formData.durationInMonths}
                onChange={handleChange}
                className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Category ID
              </label>
              <input
                type="number"
                name="categoryId"
                required
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Sub-Category ID
              </label>
              <input
                type="number"
                name="subCategoryId"
                required
                value={formData.subCategoryId}
                onChange={handleChange}
                className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 !bg-gray-100 !text-gray-600 hover:!bg-gray-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              className="flex-1 shadow-lg shadow-primary/20"
            >
              Save Path
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default CareerPathModal;
