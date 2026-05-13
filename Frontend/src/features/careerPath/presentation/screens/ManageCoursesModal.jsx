// src/features/careerPath/presentation/screens/ManageCoursesModal.jsx

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCareerPathCourse } from "../../hooks/useCareerPathCourse";
import Button from "../../../../core/ui_components/Button";

const ManageCoursesModal = ({
  isOpen,
  onClose,
  careerPathId,
  careerPathName,
  isAdmin,
}) => {
  const {
    pathCourses,
    isLoading,
    error,
    fetchPathCourses,
    addCourseToPath,
    removeCourseFromPath,
  } = useCareerPathCourse();

  const [formData, setFormData] = useState({
    courseId: 0,
    orderNumber: 1,
    isRequired: true,
    completionCriteria: "Completion",
  });

  // جلب الكورسات بمجرد فتح النافذة للمسار المحدد
  useEffect(() => {
    if (isOpen && careerPathId) {
      fetchPathCourses(careerPathId);
    }
  }, [isOpen, careerPathId, fetchPathCourses]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name.includes("Id") || name.includes("Number")
            ? Number(value)
            : value,
    }));
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert("عذراً، إضافة الكورسات متاحة للمديرين فقط.");
      return;
    }

    const payload = {
      ...formData,
      careerPathId: careerPathId, // نأخذ الـ ID من الـ Props
    };

    const success = await addCourseToPath(payload);
    if (success) {
      setFormData({
        courseId: 0,
        orderNumber: 1,
        isRequired: true,
        completionCriteria: "Completion",
      });
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!isAdmin) {
      alert("عذراً، حذف الكورسات متاح للمديرين فقط.");
      return;
    }
    if (window.confirm("هل أنت متأكد من إزالة هذا الكورس من المسار؟")) {
      await removeCourseFromPath(id);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50 shrink-0">
          <div>
            <h2 className="text-xl font-black text-gray-800">Manage Courses</h2>
            <p className="text-xs text-primary font-bold mt-1">
              Path: {careerPathName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 font-bold transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8 bg-slate-50/30">
          {/* نموذج إضافة كورس جديد (يظهر للمدير فقط) */}
          {isAdmin && (
            <form
              onSubmit={handleAddCourse}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4"
            >
              <h3 className="text-sm font-black text-gray-800 border-b border-gray-50 pb-2">
                Link New Course
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    Course ID
                  </label>
                  <input
                    type="number"
                    name="courseId"
                    required
                    value={formData.courseId}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-slate-50 border border-gray-200 rounded-xl outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    Order No.
                  </label>
                  <input
                    type="number"
                    name="orderNumber"
                    min="1"
                    required
                    value={formData.orderNumber}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-slate-50 border border-gray-200 rounded-xl outline-none text-sm"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer pb-2">
                    <input
                      type="checkbox"
                      name="isRequired"
                      checked={formData.isRequired}
                      onChange={handleChange}
                      className="w-5 h-5 rounded text-primary"
                    />
                    <span className="text-sm font-bold text-gray-700">
                      Required?
                    </span>
                  </label>
                </div>
                <div className="col-span-2 md:col-span-4">
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    Completion Criteria
                  </label>
                  <input
                    type="text"
                    name="completionCriteria"
                    required
                    value={formData.completionCriteria}
                    onChange={handleChange}
                    placeholder="e.g. Pass final exam"
                    className="w-full p-2.5 bg-slate-50 border border-gray-200 rounded-xl outline-none text-sm"
                  />
                </div>
              </div>
              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full py-3 shadow-lg shadow-primary/20 text-xs"
              >
                + Add Course to Path
              </Button>
            </form>
          )}

          {/* قائمة الكورسات المرتبطة */}
          <div>
            <h3 className="text-sm font-black text-gray-800 mb-3">
              Linked Courses ({pathCourses.length})
            </h3>
            {isLoading && pathCourses.length === 0 ? (
              <p className="text-center text-gray-400 font-bold text-sm py-4">
                جاري التحميل...
              </p>
            ) : error ? (
              <p className="text-center text-red-500 font-bold text-sm py-4">
                {error}
              </p>
            ) : pathCourses.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-2xl border border-gray-100">
                <span className="text-4xl">📭</span>
                <p className="text-gray-400 font-medium text-sm mt-2">
                  لا توجد كورسات مرتبطة بهذا المسار حتى الآن.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pathCourses.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-black">
                        #{item.orderNumber}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">
                          Course ID: {item.courseId}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                          {item.completionCriteria}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {item.isRequired ? (
                        <span className="bg-red-50 text-red-600 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">
                          Required
                        </span>
                      ) : (
                        <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">
                          Optional
                        </span>
                      )}
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteCourse(item.id)}
                          className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                          title="إزالة الكورس"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ManageCoursesModal;
