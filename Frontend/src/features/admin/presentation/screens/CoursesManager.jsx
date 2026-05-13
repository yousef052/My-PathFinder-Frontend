import React, { useEffect, useMemo, useState } from "react";
import { useAdminCourses } from "../../hooks/useAdminCourses";
import { useAdminPlatforms } from "../../hooks/useAdminPlatforms";
import { useAdminCareerPaths } from "../../hooks/useAdminCareerPaths";
import { resolveMediaUrl } from "../../../../core/utils/mediaUrl";
import { adminService } from "../../services/adminService";

const emptyCourseForm = {
  courseName: "",
  description: "",
  instructor: "",
  platformId: 0,
  categoryId: 0,
  subCategoryId: 0,
  difficultyLevel: "Beginner",
  courseUrl: "",
  price: 0,
  durationHours: 0,
  totalLessons: 0,
  rating: 0,
};

import Button from "../../../../core/ui_components/Button";
import Input from "../../../../core/ui_components/Input";

// ─── Skeleton Loader ─────────────────────────────────────────────────────────
const SkeletonCard = ({ delay = 0 }) => (
  <div
    className="flex flex-col overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm"
    style={{ animation: `fadeSlideUp 0.4s ease both ${delay}ms` }}
  >
    <div className="h-40 animate-pulse bg-slate-100" />
    <div className="flex-1 p-5">
      <div className="mb-4 h-5 w-3/4 animate-pulse rounded-lg bg-slate-100" />
      <div className="space-y-2">
        <div className="h-3 w-full animate-pulse rounded-lg bg-slate-100" />
        <div className="h-3 w-5/6 animate-pulse rounded-lg bg-slate-100" />
      </div>
      <div className="mt-5 flex items-center justify-between">
        <div className="h-6 w-16 animate-pulse rounded-lg bg-slate-100" />
        <div className="flex gap-2">
           <div className="h-8 w-12 animate-pulse rounded-xl bg-slate-100" />
           <div className="h-8 w-12 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </div>
    </div>
  </div>
);

// ─── Course Card ──────────────────────────────────────────────────────────────
const CourseCard = ({ course, platforms, categories, onEdit, onDelete, isSaving, delay = 0 }) => {
  const name = course.name || course.Name || course.courseName || course.title || "Untitled Course";
  const platformName = platforms.find((p) => p.id === course.platformId || p.id === course.PlatformId)?.name || course.platformName || "Unknown Platform";
  const categoryName = categories.find((c) => c.id === course.categoryId)?.name || course.categoryName || "Uncategorized";
  const thumbnail = resolveMediaUrl(course.thumbnailUrl || course.ThumbnailUrl);

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-primary)]/20 hover:shadow-xl hover:shadow-blue-50/70"
      style={{ animation: `fadeSlideUp 0.45s cubic-bezier(0.16,1,0.3,1) both ${delay}ms` }}
    >
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        {thumbnail ? (
          <img src={thumbnail} alt={name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl transition-transform duration-500 group-hover:scale-110">
            📚
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
           <span className="rounded-xl bg-white/20 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-md">
             {course.difficultyLevel || course.DifficultyLevel}
           </span>
           <span className="flex items-center gap-1 rounded-xl bg-amber-400 px-2 py-1 text-[10px] font-black text-slate-900">
             ⭐ {course.rating || course.Rating || "0.0"}
           </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-base font-black leading-snug text-slate-900 line-clamp-2" title={name}>
          {name}
        </h3>
        
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-lg border border-slate-100 bg-slate-50 px-2 py-1 text-[9px] font-bold text-slate-600">
            {platformName}
          </span>
          <span className="rounded-lg border border-slate-100 bg-slate-50 px-2 py-1 text-[9px] font-bold text-slate-500">
            {categoryName}
          </span>
        </div>

        <p className="mt-4 text-xs font-medium leading-relaxed text-slate-500 line-clamp-2">
          {course.description || course.Description || "No description provided for this course."}
        </p>

        <div className="mt-auto pt-6 flex items-center justify-between">
          <p className="text-lg font-black text-[var(--color-primary)]">
            ${course.price || course.Price || "0"}
          </p>
          <div className="flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {course.courseUrl || course.ExternalUrl ? (
              <a
                href={course.courseUrl || course.ExternalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition hover:bg-[var(--color-primary)] hover:text-white active:scale-95"
                title="View Course Source"
              >
                🔗
              </a>
            ) : null}
            <button
              type="button"
              onClick={() => onEdit(course)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition hover:bg-[var(--color-primary)] hover:text-white active:scale-95"
              title="Edit Course"
            >
              ✏️
            </button>
            <button
              type="button"
              onClick={() => onDelete(course)}
              disabled={isSaving}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-500 hover:text-white active:scale-95 disabled:opacity-40"
              title="Delete Course"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

// ─── Course Modal ─────────────────────────────────────────────────────────────
const CourseModal = ({ isOpen, title, initialValue, isSaving, onClose, onSubmit, platforms, categories }) => {
  const [formData, setFormData] = useState(emptyCourseForm);
  const [selectedImage, setSelectedImage] = useState(null);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    if (initialValue) {
      setFormData({
        courseName: initialValue.name || initialValue.courseName || initialValue.Name || "",
        description: initialValue.description || initialValue.Description || "",
        instructor: initialValue.instructor || initialValue.Instructor || "",
        platformId: initialValue.platformId || initialValue.PlatformId || 0,
        categoryId: initialValue.categoryId || initialValue.CategoryId || 0,
        subCategoryId: initialValue.subCategoryId || initialValue.SubCategoryId || 0,
        difficultyLevel: initialValue.difficultyLevel || initialValue.DifficultyLevel || "Beginner",
        courseUrl: initialValue.courseUrl || initialValue.ExternalUrl || "",
        price: initialValue.price || initialValue.Price || 0,
        durationHours: initialValue.durationHours || initialValue.DurationHours || 0,
        totalLessons: initialValue.totalLessons || initialValue.TotalLessons || 0,
        rating: initialValue.rating || initialValue.Rating || 0,
      });
    } else {
      setFormData(emptyCourseForm);
    }
    setSelectedImage(null);
  }, [initialValue, isOpen]);

  useEffect(() => {
    if (formData.categoryId) {
      adminService.categories.getSubcategories(formData.categoryId)
        .then(data => {
          const subData = Array.isArray(data) ? data : (data.data || data.items || data.result || []);
          setSubcategories(subData);
        })
        .catch(err => {
          console.error("Failed to fetch subcategories", err);
          setSubcategories([]);
        });
    } else {
      setSubcategories([]);
    }
  }, [formData.categoryId]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  const updateField = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: (name === 'platformId' || name === 'categoryId' || name === 'subCategoryId' || name === 'price' || name === 'rating' || name === 'durationHours' || name === 'totalLessons') ? Number(value) : value 
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = new FormData();
    
    payload.append("Name", formData.courseName);
    payload.append("Description", formData.description);
    payload.append("Instructor", formData.instructor);
    payload.append("ExternalUrl", formData.courseUrl);
    payload.append("PlatformId", formData.platformId);
    payload.append("CategoryId", formData.categoryId);
    if (formData.subCategoryId) {
      payload.append("SubCategoryId", formData.subCategoryId);
    }
    payload.append("DifficultyLevel", formData.difficultyLevel);
    payload.append("Price", formData.price);
    payload.append("DurationHours", formData.durationHours);
    payload.append("TotalLessons", formData.totalLessons);
    payload.append("Rating", formData.rating);

    if (selectedImage) {
      payload.append("ThumbnailFile", selectedImage);
    }
    const success = await onSubmit(payload);
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ animation: "fadeIn 0.2s ease both" }}>
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl" style={{ animation: "slideUp 0.3s cubic-bezier(0.16,1,0.3,1) both" }}>
        <div className="h-1 w-full bg-gradient-to-r from-[var(--color-primary)] via-[#818cf8] to-[#a78bfa]" />

        <div className="flex items-center justify-between border-b border-slate-100 px-7 py-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)]">Course Details</p>
            <h2 className="text-xl font-black text-slate-900">{title}</h2>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-500 active:scale-90">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex max-h-[80vh] flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-7 space-y-6">
            
            {/* Thumbnail Upload */}
            <div className="flex items-center gap-6 p-6 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200 transition-colors hover:border-[var(--color-primary)]/40">
              <div className="flex h-24 w-32 flex-shrink-0 items-center justify-center overflow-hidden rounded-[1.5rem] bg-white text-4xl shadow-md border-4 border-white">
                {selectedImage ? (
                  <img src={URL.createObjectURL(selectedImage)} className="h-full w-full object-cover" alt="Preview" />
                ) : formData.thumbnailUrl || initialValue?.ThumbnailUrl ? (
                  <img src={resolveMediaUrl(formData.thumbnailUrl || initialValue?.ThumbnailUrl)} className="h-full w-full object-cover" alt="Current" />
                ) : (
                  "📚"
                )}
              </div>
              <div>
                <h4 className="font-black text-slate-800">Course Thumbnail</h4>
                <p className="text-xs font-medium text-slate-500 mb-3">Upload a descriptive cover image (16:9 recommended).</p>
                <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-white px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-700 shadow-sm border border-slate-200 transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] active:scale-95">
                  Choose Image
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setSelectedImage(e.target.files[0])} />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Course Name" required>
                <Input name="courseName" value={formData.courseName} onChange={updateField} required className="!gap-0" />
              </Field>
              <Field label="Course URL" required>
                <Input name="courseUrl" type="url" value={formData.courseUrl} onChange={updateField} placeholder="https://" required className="!gap-0" />
              </Field>
              <Field label="Instructor" required>
                <Input name="instructor" value={formData.instructor} onChange={updateField} required className="!gap-0" />
              </Field>
              
              <Field label="Platform" required>
                <select name="platformId" value={formData.platformId} onChange={updateField} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:bg-white transition-all" required>
                  <option value={0}>Select Platform...</option>
                  {platforms.map(p => <option key={p.id} value={p.id}>{p.name || p.platformName || p.Name}</option>)}
                </select>
              </Field>

              <Field label="Category" required>
                <select name="categoryId" value={formData.categoryId} onChange={updateField} className={inputCls} required>
                  <option value={0}>Select Category...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name || c.categoryName}</option>)}
                </select>
              </Field>
              
              <Field label="Sub Category">
                <select name="subCategoryId" value={formData.subCategoryId} onChange={updateField} className={inputCls} disabled={!subcategories.length}>
                  <option value={0}>Select Subcategory...</option>
                  {subcategories.map(s => <option key={s.id} value={s.id}>{s.name || s.categoryName}</option>)}
                </select>
              </Field>

              <Field label="Difficulty Level" required>
                <select name="difficultyLevel" value={formData.difficultyLevel} onChange={updateField} className={inputCls} required>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </Field>
              <Field label="Price (USD)" required>
                <Input name="price" type="number" step="0.01" min="0" value={formData.price} onChange={updateField} required className="!gap-0" />
              </Field>
              <Field label="Duration (Hours)" required>
                <input name="durationHours" type="number" min="0" value={formData.durationHours} onChange={updateField} className={inputCls} required />
              </Field>
              <Field label="Total Lessons" required>
                <input name="totalLessons" type="number" min="0" value={formData.totalLessons} onChange={updateField} className={inputCls} required />
              </Field>
              <div className="md:col-span-2">
                <Field label="Rating (0.0 - 5.0)" required>
                  <Input name="rating" type="number" step="0.1" max="5" min="0" value={formData.rating} onChange={updateField} required className="!gap-0" />
                </Field>
              </div>
            </div>
            
            <Field label="Description" required>
              <textarea name="description" value={formData.description} onChange={updateField} className={`${inputCls} min-h-[120px] resize-none`} required />
            </Field>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 p-8 bg-slate-50/50">
            <Button variant="secondary" onClick={onClose} disabled={isSaving}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={isSaving} icon="💾">
               Save Course
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
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
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)     scale(1);    }
        }
      `}</style>

      <div className="space-y-8 pb-24" style={{ animation: "fadeSlideUp 0.35s ease both" }}>
        
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">
              Admin Module
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Courses
            </h1>
            <p className="mt-2 max-w-xl text-sm font-medium text-slate-500">
              Manage learning content, difficulties, and associated platforms.
            </p>
          </div>
          <Button variant="primary" onClick={openCreate} disabled={isSaving} icon="+">
             New Course
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="flex flex-col justify-center rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md" style={{ animation: "fadeSlideUp 0.4s ease both" }}>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Courses</p>
            <p className="mt-1 text-3xl font-black text-slate-900">{courses.length}</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-600" style={{ animation: "fadeSlideUp 0.3s ease both" }}>
            <span className="text-lg">⚠️</span> {error}
          </div>
        )}

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex-1 min-w-[200px]">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search courses by title..."
              onKeyDown={(e) => { if(e.key === 'Enter') fetchCourses(searchTerm); }}
              className="!gap-0"
              icon="🔍"
            />
          </div>
          <Button variant="secondary" onClick={() => fetchCourses(searchTerm)} isLoading={isLoading}>Search API</Button>
          {searchTerm && (
            <button
              onClick={() => { setSearchTerm(""); fetchCourses(""); }}
              className="px-3 text-xs font-bold text-slate-400 hover:text-slate-700"
            >
              Clear
            </button>
          )}
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} delay={i * 50} />)}
          </div>
        ) : visibleCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-slate-200 bg-white px-6 py-24 text-center" style={{ animation: "fadeSlideUp 0.4s ease both" }}>
             <span className="mb-4 text-5xl">🎓</span>
            <h3 className="text-lg font-black text-slate-700">No courses found</h3>
            <p className="mt-2 text-sm font-medium text-slate-400">Add a new course or adjust your search filters.</p>
            <div className="mt-6">
              <Button variant="primary" onClick={openCreate} icon="+">Create First Course</Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400" style={{ animation: "fadeSlideUp 0.3s ease both" }}>
              Showing {visibleCourses.length} course{visibleCourses.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleCourses.map((course, i) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  platforms={platforms}
                  categories={categories}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  isSaving={isSaving}
                  delay={i * 40}
                />
              ))}
            </div>
          </>
        )}
      </div>

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
    </>
  );
};

export default CoursesManager;
