// src/features/profile/presentation/components/EducationSection.jsx
import React, { useState } from "react";
import { useEducation } from "../../hooks/useEducation";
import Button from "../../../../core/ui_components/Button";

const EducationSection = () => {
  const {
    educations,
    isLoading,
    isSubmitting,
    handleAdd,
    handleDelete,
    handleDeleteCertificate,
  } = useEducation(); // جلب كافة الوظائف والبيانات من الهوك

  const [showForm, setShowForm] = useState(false); // التحكم في إظهار نموذج الإضافة[cite: 48]

  // حالة الفورم الكاملة للإضافة كما في الكود الأصلي[cite: 48]
  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
  });
  const [selectedCerts, setSelectedCerts] = useState([]); // حالة ملفات الشهادات المحددة[cite: 48]

  const onFormChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value }); // تحديث قيم الحقول النصية[cite: 48]

  const onFileChange = (e) => setSelectedCerts(Array.from(e.target.files)); // تحديث قائمة الملفات المختارة[cite: 48]

  const onSubmit = async (e) => {
    e.preventDefault();
    const success = await handleAdd(formData, selectedCerts); // إرسال البيانات للملف الشخصي[cite: 48]
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

  if (isLoading)
    return (
      <div className="p-10 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#5b7cfa] mx-auto"></div>
      </div>
    ); // حالة التحميل[cite: 48]

  return (
    <div className="bg-white p-10 rounded-[3rem] border border-white shadow-xl shadow-blue-50/30 animate-fade-in">
      {/* رأس القسم المطور[cite: 47] */}
      <div className="flex justify-between items-center mb-10 px-2">
        <div>
          <h3 className="text-2xl font-black text-gray-900 italic tracking-tight">
            🎓 Education
          </h3>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">
            Academic Background
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-50 text-[#5b7cfa] hover:bg-[#5b7cfa] hover:text-white px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm active:scale-95"
        >
          {showForm ? "Cancel" : "+ Add Education"}
        </button>
      </div>

      {/* نموذج الإضافة الكامل (Full Logic) بتصميم Figma[cite: 16, 48] */}
      {showForm && (
        <form
          onSubmit={onSubmit}
          className="bg-slate-50 p-8 rounded-[2.5rem] mb-12 border border-slate-100 space-y-6 animate-fade-in shadow-inner"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                Institution Name
              </label>
              <input
                required
                type="text"
                name="institution"
                placeholder="e.g. Cairo University"
                value={formData.institution}
                onChange={onFormChange}
                className="w-full p-4 rounded-2xl bg-white border-none outline-none font-bold text-sm shadow-sm focus:ring-2 focus:ring-blue-50 transition-all placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                Degree / Certificate
              </label>
              <input
                required
                type="text"
                name="degree"
                placeholder="e.g. Bachelor's Degree"
                value={formData.degree}
                onChange={onFormChange}
                className="w-full p-4 rounded-2xl bg-white border-none outline-none font-bold text-sm shadow-sm focus:ring-2 focus:ring-blue-50 transition-all placeholder:text-gray-300"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                Field of Study
              </label>
              <input
                required
                type="text"
                name="fieldOfStudy"
                placeholder="e.g. Computer Science & AI"
                value={formData.fieldOfStudy}
                onChange={onFormChange}
                className="w-full p-4 rounded-2xl bg-white border-none outline-none font-bold text-sm shadow-sm focus:ring-2 focus:ring-blue-50 transition-all placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                Start Date
              </label>
              <input
                required
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={onFormChange}
                className="w-full p-4 rounded-2xl bg-white border-none outline-none font-bold text-sm shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                End Date (Expected)
              </label>
              <input
                required
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={onFormChange}
                className="w-full p-4 rounded-2xl bg-white border-none outline-none font-bold text-sm shadow-sm"
              />
            </div>

            <div className="md:col-span-2 pt-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-2 block">
                Upload Credentials (PDF/Images)
              </label>
              <div className="relative group">
                <input
                  type="file"
                  multiple
                  accept=".pdf,image/*"
                  onChange={onFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="w-full p-6 rounded-2xl border-2 border-dashed border-slate-200 bg-white text-center group-hover:border-[#5b7cfa] transition-colors flex flex-col items-center gap-2">
                  <span className="text-2xl">📄</span>
                  <span className="text-gray-400 font-bold text-[10px] uppercase tracking-tighter">
                    {selectedCerts.length > 0
                      ? `${selectedCerts.length} files selected`
                      : "Click or drag certificates here"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              isLoading={isSubmitting}
              fullWidth
              className="py-5 shadow-blue-100 rounded-2xl"
            >
              Save Education History
            </Button>
          </div>
        </form>
      )}

      {/* قائمة التاريخ التعليمي[cite: 48] */}
      <div className="space-y-6">
        {educations.length === 0 && !showForm ? (
          <div className="text-center py-20 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
            <span className="text-6xl block mb-6 opacity-20">🎓</span>
            <p className="text-gray-400 font-black text-xs uppercase tracking-widest">
              Your education path is empty.
            </p>
          </div>
        ) : (
          educations.map((edu) => (
            <div
              key={edu.id || edu.educationId}
              className="group relative bg-slate-50/50 p-8 rounded-[2.5rem] border border-transparent hover:bg-white hover:border-blue-50 hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-300"
            >
              {/* زر الحذف[cite: 48] */}
              <button
                onClick={() => handleDelete(edu.id || edu.educationId)}
                className="absolute top-8 right-8 w-10 h-10 bg-white text-gray-300 hover:text-red-500 rounded-xl flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all border border-gray-50 active:scale-90"
                title="Delete Entry"
              >
                ✕
              </button>

              <div className="flex flex-col md:flex-row justify-between mb-4 gap-2">
                <h4 className="text-xl font-black text-gray-900 tracking-tight leading-tight">
                  {edu.institution}
                </h4>
                <span className="text-[10px] font-black text-[#5b7cfa] bg-blue-50 px-4 py-1.5 rounded-full uppercase tracking-tighter self-start border border-blue-100">
                  {new Date(edu.startDate).getFullYear()} —{" "}
                  {new Date(edu.endDate).getFullYear()}
                </span>
              </div>

              <p className="text-[#5b7cfa] font-black text-xs uppercase tracking-widest mb-6 px-1">
                {edu.degree} in {edu.fieldOfStudy}
              </p>

              {/* عرض الشهادات المرفقة مع خيار الحذف الفردي[cite: 48] */}
              {edu.certificates && edu.certificates.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-slate-100">
                  {edu.certificates.map((certUrl, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl text-[10px] font-black border border-slate-100 shadow-sm group/cert hover:border-[#5b7cfa]/30 transition-all"
                    >
                      <span className="text-[#5b7cfa] text-lg">📄</span>
                      <span className="text-gray-600 uppercase tracking-tighter truncate max-w-[120px]">
                        Credential {idx + 1}
                      </span>
                      <button
                        onClick={() =>
                          handleDeleteCertificate(
                            edu.id || edu.educationId,
                            certUrl,
                          )
                        }
                        className="text-gray-300 hover:text-red-500 transition-colors w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-50"
                        title="Remove Certificate"
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
