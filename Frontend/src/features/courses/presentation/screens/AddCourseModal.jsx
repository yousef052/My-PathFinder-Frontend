import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Button from "../../../../core/ui_components/Button";

const AddCourseModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    Name: "",
    Description: "",
    Instructor: "",
    ExternalUrl: "",
    Price: 0,
    DurationHours: 0,
    TotalLessons: 0,
    DifficultyLevel: "Beginner",
    CategoryId: 1,
    SubCategoryId: 1,
    PlatformId: 1,
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    Object.keys(formData).forEach((key) =>
      submitData.append(key, formData[key]),
    );
    if (thumbnailFile) submitData.append("ThumbnailFile", thumbnailFile);

    if (await onSubmit(submitData)) {
      setFormData({
        Name: "",
        Description: "",
        Instructor: "",
        ExternalUrl: "",
        Price: 0,
        DurationHours: 0,
        TotalLessons: 0,
        DifficultyLevel: "Beginner",
        CategoryId: 1,
        SubCategoryId: 1,
        PlatformId: 1,
      });
      setThumbnailFile(null);
      onClose();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-[3rem] w-full max-w-4xl shadow-2xl overflow-hidden border border-white flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 shrink-0">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight italic">
            Add New Course
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-10 overflow-y-auto custom-scrollbar flex-1 bg-white">
          <form
            id="add-course-form"
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                  Course Details
                </label>
                <input
                  type="text"
                  name="Name"
                  required
                  value={formData.Name}
                  onChange={(e) =>
                    setFormData({ ...formData, Name: e.target.value })
                  }
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all font-bold"
                  placeholder="Course Name"
                />
                <input
                  type="url"
                  name="ExternalUrl"
                  required
                  value={formData.ExternalUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, ExternalUrl: e.target.value })
                  }
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none text-xs font-medium"
                  placeholder="Source URL (Udemy, Coursera...)"
                />
              </div>
              <textarea
                name="Description"
                value={formData.Description}
                onChange={(e) =>
                  setFormData({ ...formData, Description: e.target.value })
                }
                className="w-full p-6 bg-slate-50 rounded-[2rem] outline-none h-40 resize-none text-sm font-medium"
                placeholder="Describe what students will learn..."
              />
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                    Instructor
                  </label>
                  <input
                    type="text"
                    name="Instructor"
                    value={formData.Instructor}
                    onChange={(e) =>
                      setFormData({ ...formData, Instructor: e.target.value })
                    }
                    className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="Price"
                    value={formData.Price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        Price: Number(e.target.value),
                      })
                    }
                    className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm"
                  />
                </div>
              </div>

              <div className="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center group hover:bg-blue-50 transition-all cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">
                  🖼️
                </span>
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">
                  {thumbnailFile ? thumbnailFile.name : "Upload Cover Image"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  className="py-4"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="py-4 shadow-blue-200"
                >
                  Save Course
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};
export default AddCourseModal;
