import React, { useEffect, useMemo, useState } from "react";
import { useAdminCareerPaths } from "../../hooks/useAdminCareerPaths";

const emptyPathForm = {
  careerPathName: "",
  description: "",
  difficultyLevel: "Beginner",
  durationInMonths: 1,
  categoryId: 0,
  subCategoryId: 0,
};

const emptyPathCourseForm = {
  courseId: 0,
  orderNumber: 1,
  isRequired: true,
  completionCriteria: "Complete the course",
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

const PathModal = ({
  isOpen,
  initialValue,
  isSaving,
  onClose,
  onSubmit,
  categories,
}) => {
  const [formData, setFormData] = useState(emptyPathForm);

  useEffect(() => {
    setFormData(initialValue || emptyPathForm);
  }, [initialValue, isOpen]);

  if (!isOpen) return null;

  const updateField = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes("Id") || name === "durationInMonths"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await onSubmit(formData);
    if (success) onClose();
  };

  const subcategories = useMemo(() => {
    if (!formData.categoryId) return [];
    const cat = categories.find((c) => c.id === formData.categoryId);
    return cat?.subCategories || cat?.subcategories || [];
  }, [formData.categoryId, categories]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#5b7cfa]">
              Career Path
            </p>
            <h2 className="text-xl font-black text-slate-900">
              {initialValue?.id ? "Edit path" : "Create path"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-3 py-2 text-sm font-black text-slate-400 hover:bg-slate-50 hover:text-red-500"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <Field label="Path name">
            <input
              name="careerPathName"
              value={formData.careerPathName}
              onChange={updateField}
              className={inputClass}
              required
            />
          </Field>

          <Field label="Description">
            <textarea
              name="description"
              value={formData.description}
              onChange={updateField}
              className={`${inputClass} min-h-28 resize-none`}
              required
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Difficulty">
              <select
                name="difficultyLevel"
                value={formData.difficultyLevel}
                onChange={updateField}
                className={inputClass}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </Field>
            <Field label="Duration months">
              <input
                type="number"
                min="1"
                name="durationInMonths"
                value={formData.durationInMonths}
                onChange={updateField}
                className={inputClass}
                required
              />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Category">
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={updateField}
                className={inputClass}
                required
              >
                <option value={0}>Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Subcategory">
              <select
                name="subCategoryId"
                value={formData.subCategoryId}
                onChange={updateField}
                className={inputClass}
                disabled={!formData.categoryId}
              >
                <option value={0}>Select Subcategory</option>
                {subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <GhostButton onClick={onClose} disabled={isSaving}>
              Cancel
            </GhostButton>
            <PrimaryButton type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};

const LinkedCoursesModal = ({
  isOpen,
  careerPath,
  pathCourses,
  allCourses,
  isLoading,
  isSaving,
  onClose,
  onLink,
  onUnlink,
}) => {
  const [formData, setFormData] = useState(emptyPathCourseForm);

  useEffect(() => {
    if (isOpen) setFormData(emptyPathCourseForm);
  }, [isOpen]);

  if (!isOpen || !careerPath) return null;

  const updateField = (event) => {
    const { name, type, checked, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "courseId" || name === "orderNumber"
            ? Number(value)
            : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await onLink(formData);
    if (success) setFormData(emptyPathCourseForm);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#5b7cfa]">
              Linked courses
            </p>
            <h2 className="text-xl font-black text-slate-900">
              {careerPath.careerPathName || careerPath.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-3 py-2 text-sm font-black text-slate-400 hover:bg-slate-50 hover:text-red-500"
          >
            Close
          </button>
        </div>

        <div className="grid gap-6 overflow-y-auto p-6 lg:grid-cols-[360px_1fr]">
          <form
            onSubmit={handleSubmit}
            className="h-fit space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
          >
            <h3 className="font-black text-slate-800">Attach a course</h3>
            <Field label="Select Course">
              <select
                name="courseId"
                value={formData.courseId}
                onChange={updateField}
                className={inputClass}
                required
              >
                <option value={0}>Select a course...</option>
                {allCourses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Order number">
              <input
                type="number"
                min="1"
                name="orderNumber"
                value={formData.orderNumber}
                onChange={updateField}
                className={inputClass}
                required
              />
            </Field>
            <Field label="Completion criteria">
              <input
                name="completionCriteria"
                value={formData.completionCriteria}
                onChange={updateField}
                className={inputClass}
                required
              />
            </Field>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600">
              <input
                type="checkbox"
                name="isRequired"
                checked={formData.isRequired}
                onChange={updateField}
                className="h-4 w-4"
              />
              Required course
            </label>
            <PrimaryButton type="submit" disabled={isSaving || !formData.courseId}>
              {isSaving ? "Linking..." : "Link Course"}
            </PrimaryButton>
          </form>

          <div className="min-w-0">
            {isLoading ? (
              <Spinner />
            ) : pathCourses.length === 0 ? (
              <EmptyState
                title="No linked courses"
                message="Attach courses by name to build this path sequence."
              />
            ) : (
              <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
                <table className="w-full min-w-[620px] text-left text-sm">
                  <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <tr>
                      <th className="px-5 py-4">Order</th>
                      <th className="px-5 py-4">Course</th>
                      <th className="px-5 py-4">Required</th>
                      <th className="px-5 py-4">Criteria</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pathCourses.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80">
                        <td className="px-5 py-4 font-black text-slate-900">
                          {item.orderNumber ?? "-"}
                        </td>
                        <td className="px-5 py-4 font-bold text-slate-600">
                          {item.courseName || `Course #${item.courseId}`}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                              item.isRequired
                                ? "bg-red-50 text-red-600"
                                : "bg-emerald-50 text-emerald-600"
                            }`}
                          >
                            {item.isRequired ? "Required" : "Optional"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-500">
                          {item.completionCriteria || "-"}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => onUnlink(item.id)}
                            className="rounded-xl px-3 py-2 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50"
                            disabled={isSaving}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CareerPathsManager = () => {
  const {
    careerPaths,
    pathCourses,
    categories,
    allCourses,
    selectedCareerPath,
    stats,
    isLoading,
    isSaving,
    isCoursesLoading,
    error,
    fetchCareerPaths,
    fetchCategories,
    fetchAllCourses,
    saveCareerPath,
    deleteCareerPath,
    fetchPathCourses,
    linkCourseToPath,
    unlinkCourseFromPath,
    clearSelectedCareerPath,
  } = useAdminCareerPaths();

  const [searchTerm, setSearchTerm] = useState("");
  const [editingPath, setEditingPath] = useState(null);
  const [isPathModalOpen, setIsPathModalOpen] = useState(false);
  const [isCoursesModalOpen, setIsCoursesModalOpen] = useState(false);

  useEffect(() => {
    fetchCareerPaths();
    fetchCategories();
    fetchAllCourses();
  }, [fetchCareerPaths, fetchCategories, fetchAllCourses]);

  const sortedPaths = useMemo(
    () =>
      [...careerPaths].sort((a, b) =>
        (a.careerPathName || a.name || a.Name || "").localeCompare(
          b.careerPathName || b.name || b.Name || "",
        ),
      ),
    [careerPaths],
  );

  const openCreateModal = () => {
    setEditingPath(null);
    setIsPathModalOpen(true);
  };

  const openEditModal = (path) => {
    setEditingPath({
      id: path.id,
      careerPathName: path.careerPathName || path.name || "",
      description: path.description || "",
      difficultyLevel: path.difficultyLevel || "Beginner",
      durationInMonths: path.durationInMonths || 1,
      categoryId: path.categoryId || 0,
      subCategoryId: path.subCategoryId || path.subcategoryId || 0,
    });
    setIsPathModalOpen(true);
  };

  const handleSave = (payload) => saveCareerPath(payload, editingPath?.id);

  const handleDelete = async (path) => {
    const name = path.careerPathName || path.name || `#${path.id}`;
    if (window.confirm(`Delete career path "${name}"?`)) {
      await deleteCareerPath(path.id);
    }
  };

  const openCoursesModal = async (path) => {
    setIsCoursesModalOpen(true);
    await fetchPathCourses(path);
  };

  const closeCoursesModal = () => {
    setIsCoursesModalOpen(false);
    clearSelectedCareerPath();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#5b7cfa]">
            Admin Module
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Career Paths
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-medium text-slate-500">
            Create, update, search, delete, and attach courses to platform
            learning paths.
          </p>
        </div>
        <PrimaryButton onClick={openCreateModal}>New Career Path</PrimaryButton>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Total paths
          </p>
          <p className="mt-2 text-3xl font-black text-slate-900">
            {stats.total}
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Beginner
          </p>
          <p className="mt-2 text-3xl font-black text-slate-900">
            {stats.beginner}
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Advanced
          </p>
          <p className="mt-2 text-3xl font-black text-slate-900">
            {stats.advanced}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            fetchCareerPaths(searchTerm);
          }}
          className="flex flex-col gap-3 border-b border-slate-100 p-5 md:flex-row"
        >
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search career paths..."
            className={`${inputClass} md:max-w-md`}
          />
          <PrimaryButton type="submit" disabled={isLoading}>
            Search
          </PrimaryButton>
          <GhostButton
            onClick={() => {
              setSearchTerm("");
              fetchCareerPaths();
            }}
            disabled={isLoading}
          >
            Reset
          </GhostButton>
        </form>

        {isLoading ? (
          <Spinner />
        ) : sortedPaths.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No career paths found"
              message="Use the create button to add the first path from the API."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <tr>
                  <th className="px-5 py-4">Path Name</th>
                  <th className="px-5 py-4">Category / Sub</th>
                  <th className="px-5 py-4">Stats</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedPaths.map((path) => {
                  const catName = categories.find(c => c.id === path.categoryId)?.name || path.categoryName || "N/A";
                  const subCatName = categories.find(c => c.id === path.categoryId)?.subCategories?.find(s => s.id === (path.subCategoryId || path.subcategoryId))?.name || path.subCategoryName || "N/A";
                  
                  return (
                  <tr key={path.id} className="hover:bg-slate-50/80">
                    <td className="px-5 py-4">
                      <p className="font-black text-slate-900">
                        {path.careerPathName || path.name || path.Name || "Untitled"}
                      </p>
                      <div className="flex gap-2 mt-1">
                         <span className="text-[9px] font-black uppercase text-[#5b7cfa]">{path.difficultyLevel || "-"}</span>
                         <span className="text-[9px] font-bold text-slate-300">•</span>
                         <span className="text-[9px] font-bold text-slate-400">{path.durationInMonths ?? "-"} months</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                       <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-700">{catName}</span>
                          <span className="text-[10px] font-bold text-slate-400 italic">{subCatName}</span>
                       </div>
                    </td>
                    <td className="px-5 py-4">
                       <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-100">
                          {path.estimatedCoursesCount || 0} Modules
                       </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openCoursesModal(path)}
                          className="rounded-xl px-3 py-2 text-xs font-black uppercase tracking-widest text-[#5b7cfa] hover:bg-blue-50"
                        >
                          Courses
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(path)}
                          className="rounded-xl px-3 py-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(path)}
                          className="rounded-xl px-3 py-2 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50"
                          disabled={isSaving}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <PathModal
        isOpen={isPathModalOpen}
        initialValue={editingPath}
        isSaving={isSaving}
        onClose={() => setIsPathModalOpen(false)}
        onSubmit={handleSave}
        categories={categories}
      />
      <LinkedCoursesModal
        isOpen={isCoursesModalOpen}
        careerPath={selectedCareerPath}
        pathCourses={pathCourses}
        allCourses={allCourses}
        isLoading={isCoursesLoading}
        isSaving={isSaving}
        onClose={closeCoursesModal}
        onLink={linkCourseToPath}
        onUnlink={unlinkCourseFromPath}
      />
    </div>
  );
};

export default CareerPathsManager;
