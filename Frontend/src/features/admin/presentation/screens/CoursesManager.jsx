import React, { useEffect, useMemo, useState } from "react";
import { useAdminCourses } from "../../hooks/useAdminCourses";
import { useAdminPlatforms } from "../../hooks/useAdminPlatforms";
import { useAdminCareerPaths } from "../../hooks/useAdminCareerPaths"; 
import { resolveMediaUrl } from "../../../../core/utils/mediaUrl";

const emptyCourseForm = {
  courseName: "",
  description: "",
  platformId: 0,
  categoryId: 0,
  difficultyLevel: "Beginner",
  courseUrl: "",
  price: 0,
  language: "English",
  rating: 0,
};

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
    className="inline-flex items-center justify-center rounded-2xl bg-[#5b7cfa] px-5 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-blue-100 transition hover:bg-[#3652d9] disabled:cursor-not-allowed disabled:opacity-60"
  >
    {children}
  </button>
);

const GhostButton = ({ children, type = "button", onClick, disabled }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-500 transition hover:border-[#5b7cfa] hover:text-[#5b7cfa] disabled:cursor-not-allowed disabled:opacity-60"
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

const CourseModal = ({ isOpen, title, initialValue, isSaving, onClose, onSubmit, platforms, categories }) => {
  const [formData, setFormData] = useState(emptyCourseForm);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (initialValue) {
      setFormData({
        courseName: initialValue.name || initialValue.courseName || initialValue.Name || "",
        description: initialValue.description || initialValue.Description || "",
        platformId: initialValue.platformId || initialValue.PlatformId || 0,
        categoryId: initialValue.categoryId || initialValue.CategoryId || 0,
        difficultyLevel: initialValue.difficultyLevel || initialValue.DifficultyLevel || "Beginner",
        courseUrl: initialValue.courseUrl || initialValue.ExternalUrl || "",
        price: initialValue.price || initialValue.Price || 0,
        language: initialValue.language || "English",
        rating: initialValue.rating || initialValue.Rating || 0,
      });
    } else {
      setFormData(emptyCourseForm);
    }
    setSelectedImage(null);
  }, [initialValue, isOpen]);

  if (!isOpen) return null;

  const updateField = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: (name === 'platformId' || name === 'categoryId' || name === 'price' || name === 'rating') ? Number(value) : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = new FormData();
    
    // Map internal names back to Swagger-expected names
    payload.append("Name", formData.courseName);
    payload.append("Description", formData.description);
    payload.append("ExternalUrl", formData.courseUrl);
    payload.append("PlatformId", formData.platformId);
    payload.append("CategoryId", formData.categoryId);
    payload.append("DifficultyLevel", formData.difficultyLevel);
    payload.append("Price", formData.price);
    payload.append("Rating", formData.rating);
    payload.append("Language", formData.language);

    if (selectedImage) {
      payload.append("ThumbnailFile", selectedImage);
    }
    const success = await onSubmit(payload);
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl my-8">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 sticky top-0 bg-white z-10">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#5b7cfa]">Course</p>
            <h2 className="text-xl font-black text-slate-900">{title}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl px-3 py-2 text-sm font-black text-slate-400 hover:bg-slate-50 hover:text-red-500">Close</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
            <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-3xl shadow-xl overflow-hidden border-2 border-white">
              {selectedImage ? (
                <img src={URL.createObjectURL(selectedImage)} className="w-full h-full object-cover" alt="Preview" />
              ) : formData.thumbnailUrl ? (
                <img src={resolveMediaUrl(formData.thumbnailUrl)} className="w-full h-full object-cover" alt="Current" />
              ) : (
                "📚"
              )}
            </div>
            <label className="bg-[#5b7cfa] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest cursor-pointer hover:shadow-lg transition-all shadow-blue-100 active:scale-95">
              Change Thumbnail
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setSelectedImage(e.target.files[0])} />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Course Name">
              <input name="courseName" value={formData.courseName} onChange={updateField} className={inputClass} required />
            </Field>
            <Field label="Course URL">
              <input name="courseUrl" type="url" value={formData.courseUrl} onChange={updateField} className={inputClass} required />
            </Field>
            
            <Field label="Platform">
              <select name="platformId" value={formData.platformId} onChange={updateField} className={inputClass} required>
                <option value={0}>Select Platform...</option>
                {platforms.map(p => <option key={p.id} value={p.id}>{p.name || p.platformName || p.Name}</option>)}
              </select>
            </Field>

            <Field label="Category">
              <select name="categoryId" value={formData.categoryId} onChange={updateField} className={inputClass} required>
                <option value={0}>Select Category...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name || c.categoryName}</option>)}
              </select>
            </Field>

            <Field label="Difficulty Level">
              <select name="difficultyLevel" value={formData.difficultyLevel} onChange={updateField} className={inputClass} required>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </Field>
            <Field label="Language">
              <input name="language" value={formData.language} onChange={updateField} className={inputClass} required />
            </Field>
            <Field label="Price">
              <input name="price" type="number" step="0.01" value={formData.price} onChange={updateField} className={inputClass} required />
            </Field>
            <Field label="Rating">
              <input name="rating" type="number" step="0.1" max="5" min="0" value={formData.rating} onChange={updateField} className={inputClass} required />
            </Field>
          </div>
          
          <Field label="Description">
            <textarea name="description" value={formData.description} onChange={updateField} className={`${inputClass} min-h-[100px] resize-none`} required />
          </Field>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 sticky bottom-0 bg-white">
            <GhostButton onClick={onClose} disabled={isSaving}>Cancel</GhostButton>
            <PrimaryButton type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save"}</PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};

const CoursesManager = () => {
  const { courses, isLoading, isSaving, error, fetchCourses, saveCourse, deleteCourse } = useAdminCourses();
  const { platforms, fetchPlatforms } = useAdminPlatforms();
  const { categories, fetchCategories } = useAdminCareerPaths();

  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState({ isOpen: false, item: null });

  useEffect(() => {
    fetchCourses();
    fetchPlatforms();
    fetchCategories();
  }, [fetchCourses, fetchPlatforms, fetchCategories]);

  const visibleCourses = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    if (!needle) return courses;
    return courses.filter((c) => (c.name || c.Name || c.courseName || c.title || "").toLowerCase().includes(needle));
  }, [courses, searchTerm]);

  const openCreate = () => setModal({ isOpen: true, item: null });
  const openEdit = (course) => setModal({ isOpen: true, item: course });
  const handleSave = (payload) => saveCourse(payload, modal.item?.id);
  
  const handleDelete = async (course) => {
    const name = course.name || course.Name || course.courseName || `#${course.id}`;
    if (window.confirm(`Delete course "${name}"?`)) {
      await deleteCourse(course.id);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#5b7cfa]">Admin Module</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Courses</h1>
          <p className="mt-2 max-w-2xl text-sm font-medium text-slate-500">Manage learning content, difficulties, and associated platforms.</p>
        </div>
        <PrimaryButton onClick={openCreate} disabled={isSaving}>+ New Course</PrimaryButton>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Courses</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{courses.length}</p>
        </div>
      </div>

      {error && <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-600">{error}</div>}

      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-5 flex justify-between items-center gap-4">
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search courses..." className={`${inputClass} max-w-md`} />
          <GhostButton onClick={() => fetchCourses(searchTerm)} disabled={isLoading}>Search API</GhostButton>
        </div>

        {isLoading ? <Spinner /> : visibleCourses.length === 0 ? (
          <div className="p-6"><EmptyState title="No courses found" message="Create a new course to get started." /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <tr>
                  <th className="px-5 py-4">Course</th>
                  <th className="px-5 py-4">Platform</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleCourses.map((course) => {
                  const platformName = platforms.find(p => p.id === course.platformId)?.name || platforms.find(p => p.id === course.PlatformId)?.name || course.platformName || "N/A";
                  const categoryName = categories.find(c => c.id === course.categoryId)?.name || course.categoryName || "N/A";
                  
                  return (
                  <tr key={course.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100">
                        {course.thumbnailUrl || course.ThumbnailUrl ? (
                          <img src={resolveMediaUrl(course.thumbnailUrl || course.ThumbnailUrl)} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg">📚</div>
                        )}
                      </div>
                      <div>
                        <p className="font-black text-slate-900">{course.name || course.Name || course.courseName || course.title || "Untitled"}</p>
                        <p className="text-[9px] font-black text-[#5b7cfa] uppercase tracking-widest">{course.difficultyLevel || course.DifficultyLevel}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                       <span className="text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">{platformName}</span>
                    </td>
                    <td className="px-5 py-4">
                       <span className="text-xs font-bold text-slate-500">{categoryName}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => openEdit(course)} className="rounded-xl px-3 py-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100">Edit</button>
                        <button type="button" onClick={() => handleDelete(course)} disabled={isSaving} className="rounded-xl px-3 py-2 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50">Delete</button>
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <CourseModal 
        isOpen={modal.isOpen} 
        title={modal.item?.id ? "Edit Course" : "Create Course"} 
        initialValue={modal.item} 
        isSaving={isSaving} 
        onClose={() => setModal({ isOpen: false, item: null })} 
        onSubmit={handleSave} 
        platforms={platforms}
        categories={categories}
      />
    </div>
  );
};

export default CoursesManager;
