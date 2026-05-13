import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAdminCategories } from "../../hooks/useAdminCategories";

const emptyCategoryForm = { name: "" };
const emptySubcategoryForm = { name: "", categoryId: 0 };

// ─── Primitive UI Components ──────────────────────────────────────────────────
const inputCls =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none transition duration-200 focus:border-[var(--color-primary)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(91,124,250,0.08)]";

const Field = ({ label, required, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-[11px] font-black uppercase tracking-widest text-slate-500">
      {label}{required && <span className="ml-0.5 text-red-400">*</span>}
    </span>
    {children}
  </label>
);

const PrimaryBtn = ({ children, type = "button", onClick, disabled, small, className = "" }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center rounded-2xl bg-[var(--color-primary)] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-100 transition duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-blue-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${small ? "px-4 py-2 text-[10px]" : "px-5 py-3 text-xs"} ${className}`}
  >
    {children}
  </button>
);

const GhostBtn = ({ children, type = "button", onClick, disabled, small, className = "" }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white font-black uppercase tracking-widest text-slate-500 transition duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] active:scale-95 disabled:opacity-50 ${small ? "px-4 py-2 text-[10px]" : "px-5 py-3 text-xs"} ${className}`}
  >
    {children}
  </button>
);

// ─── Skeleton Loaders ────────────────────────────────────────────────────────
const SkeletonCategoryCard = ({ delay = 0 }) => (
  <div
    className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm"
    style={{ animation: `fadeSlideUp 0.4s ease both ${delay}ms` }}
  >
    <div className="flex items-start gap-4">
      <div className="h-10 w-10 animate-pulse rounded-2xl bg-slate-100" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-4 w-3/4 animate-pulse rounded-lg bg-slate-100" />
        <div className="h-3 w-1/2 animate-pulse rounded-lg bg-slate-100" />
      </div>
    </div>
  </div>
);

const SkeletonSubcategoryRow = ({ delay = 0 }) => (
  <div
    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
    style={{ animation: `fadeSlideUp 0.3s ease both ${delay}ms` }}
  >
    <div className="space-y-2">
      <div className="h-4 w-32 animate-pulse rounded-lg bg-slate-100" />
      <div className="h-3 w-16 animate-pulse rounded-lg bg-slate-100" />
    </div>
    <div className="h-8 w-16 animate-pulse rounded-xl bg-slate-100" />
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, color = "bg-blue-50 text-[var(--color-primary)]", delay = 0 }) => (
  <div
    className="flex items-center gap-4 rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm transition duration-200 hover:shadow-md"
    style={{ animation: `fadeSlideUp 0.4s ease both ${delay}ms` }}
  >
    <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl text-lg ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-black text-slate-900">{value}</p>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
    </div>
  </div>
);

// ─── Entity Modal ─────────────────────────────────────────────────────────────
const EntityModal = ({
  isOpen,
  title,
  initialValue,
  isSaving,
  onClose,
  onSubmit,
  includeCategoryId = false,
  categories = [],
}) => {
  const [formData, setFormData] = useState(
    includeCategoryId ? emptySubcategoryForm : emptyCategoryForm,
  );

  useEffect(() => {
    setFormData(
      initialValue ||
        (includeCategoryId ? emptySubcategoryForm : emptyCategoryForm),
    );
  }, [includeCategoryId, initialValue, isOpen]);

  if (!isOpen) return null;

  const updateField = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "categoryId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await onSubmit(formData);
    if (success) onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ animation: "fadeIn 0.2s ease both" }}>
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] bg-white shadow-2xl" style={{ animation: "slideUp 0.3s cubic-bezier(0.16,1,0.3,1) both" }}>
        <div className="h-1 w-full bg-gradient-to-r from-[var(--color-primary)] via-[#818cf8] to-[#a78bfa]" />

        <div className="flex items-center justify-between border-b border-slate-100 px-7 py-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)]">Taxonomy</p>
            <h2 className="text-xl font-black text-slate-900">{title}</h2>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-500 active:scale-90">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-7 py-6">
          <Field label="Name" required>
            <input name="name" value={formData.name} onChange={updateField} className={inputCls} required autoFocus />
          </Field>

          {includeCategoryId && (
            <Field label="Parent Category" required>
              <select name="categoryId" value={formData.categoryId} onChange={updateField} className={inputCls} required>
                <option value={0}>Select Category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name || cat.categoryName}
                  </option>
                ))}
              </select>
            </Field>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 mt-5">
            <GhostBtn onClick={onClose} disabled={isSaving}>Cancel</GhostBtn>
            <PrimaryBtn type="submit" disabled={isSaving}>
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Saving...
                </span>
              ) : "Save Entity"}
            </PrimaryBtn>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const CategoriesManager = () => {
  const {
    categories,
    subcategories,
    selectedCategory,
    stats,
    isLoading,
    isSubcategoriesLoading,
    isSaving,
    error,
    fetchCategories,
    fetchSubcategories,
    saveCategory,
    deleteCategory,
    saveSubcategory,
    deleteSubcategory,
    importJsonCategories,
  } = useAdminCategories();

  const fileInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryModal, setCategoryModal] = useState({ isOpen: false, item: null });
  const [subcategoryModal, setSubcategoryModal] = useState({ isOpen: false, item: null });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const visibleCategories = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    if (!needle) return categories || [];
    return (categories || []).filter((category) =>
      (category?.name || category?.categoryName || "").toLowerCase().includes(needle),
    );
  }, [categories, searchTerm]);

  const openCreateCategory = () => setCategoryModal({ isOpen: true, item: null });
  const openEditCategory = (category) =>
    setCategoryModal({ isOpen: true, item: { id: category.id, name: category.name || category.categoryName || "" } });

  const openCreateSubcategory = () =>
    setSubcategoryModal({ isOpen: true, item: { ...emptySubcategoryForm, categoryId: selectedCategory?.id || 0 } });
  const openEditSubcategory = (subcategory) =>
    setSubcategoryModal({
      isOpen: true,
      item: {
        id: subcategory.id,
        name: subcategory.name || subcategory.subcategoryName || "",
        categoryId: selectedCategory?.id || subcategory.categoryId || 0,
      },
    });

  const handleSaveCategory = (payload) => saveCategory({ name: payload.name }, categoryModal.item?.id);
  const handleSaveSubcategory = (payload) =>
    saveSubcategory({ name: payload.name, categoryId: payload.categoryId || selectedCategory?.id }, subcategoryModal.item?.id);

  const handleDeleteCategory = async (category, e) => {
    e.stopPropagation();
    const name = category.name || category.categoryName || `#${category.id}`;
    if (window.confirm(`Delete category "${name}"?`)) {
      await deleteCategory(category.id);
    }
  };

  const handleDeleteSubcategory = async (subcategory) => {
    const name = subcategory.name || subcategory.subcategoryName || `#${subcategory.id}`;
    if (window.confirm(`Delete subcategory "${name}"?`)) {
      await deleteSubcategory(subcategory.id);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    const success = await importJsonCategories(file);
    if (success && fileInputRef.current) fileInputRef.current.value = "";
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
        
        {/* ── Page Header ── */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">
              Admin Module
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Categories
            </h1>
            <p className="mt-2 max-w-xl text-sm font-medium text-slate-500">
              Manage course categories, subcategories, and JSON taxonomy imports.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleImport}
              className="hidden"
            />
            <GhostBtn onClick={() => fileInputRef.current?.click()} disabled={isSaving}>
              📥 Import JSON
            </GhostBtn>
            <PrimaryBtn onClick={openCreateCategory} disabled={isSaving}>
              + New Category
            </PrimaryBtn>
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total Categories" value={stats.categories} icon="📂" delay={0} />
          <StatCard label="Active Subcategories" value={stats.subcategories} icon="📑" color="bg-indigo-50 text-indigo-600" delay={60} />
        </div>

        {/* ── Error Banner ── */}
        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-600" style={{ animation: "fadeSlideUp 0.3s ease both" }}>
            <span className="text-lg">⚠️</span> {error}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_440px]">
          
          {/* ── Left Column: Categories List ── */}
          <section className="flex flex-col gap-5">
            <div className="flex items-center gap-3 rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search categories..."
                className="w-full flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700 outline-none transition focus:border-[var(--color-primary)] focus:bg-white"
              />
              {searchTerm && <GhostBtn onClick={() => setSearchTerm("")} small>Clear</GhostBtn>}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => <SkeletonCategoryCard key={i} delay={i * 40} />)}
              </div>
            ) : visibleCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-slate-200 bg-white px-6 py-24 text-center">
                <span className="mb-4 text-4xl text-slate-300">📂</span>
                <h3 className="text-lg font-black text-slate-700">No categories found</h3>
                <p className="mt-2 text-sm font-medium text-slate-400">Create a category or import a JSON taxonomy.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {visibleCategories.map((category, i) => {
                  const isSelected = selectedCategory?.id === category.id;
                  return (
                    <div
                      key={category.id}
                      onClick={() => fetchSubcategories(category)}
                      className={`group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-[2rem] border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 ${isSelected ? "border-[var(--color-primary)] bg-blue-50/30 shadow-blue-100" : "border-slate-100 bg-white hover:border-[var(--color-primary)]/30 hover:shadow-lg"}`}
                      style={{ animation: `fadeSlideUp 0.3s ease both ${Math.min(i * 30, 400)}ms` }}
                    >
                      {isSelected && <div className="absolute inset-x-0 top-0 h-1 rounded-t-[2rem] bg-[var(--color-primary)]" />}
                      <div className="flex items-start justify-between gap-3">
                        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl text-lg transition-transform duration-300 group-hover:scale-110 ${isSelected ? "bg-[var(--color-primary)] text-white" : "bg-slate-50 text-slate-400"}`}>
                          📁
                        </div>
                        <div className="flex flex-col items-end gap-2">
                           <button
                             type="button"
                             onClick={(e) => { e.stopPropagation(); openEditCategory(category); }}
                             className="text-[10px] font-black uppercase tracking-widest text-slate-400 transition hover:text-[var(--color-primary)]"
                           >
                             Edit
                           </button>
                           <button
                             type="button"
                             onClick={(e) => handleDeleteCategory(category, e)}
                             disabled={isSaving}
                             className="text-[10px] font-black uppercase tracking-widest text-red-400 transition hover:text-red-500"
                           >
                             Del
                           </button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <h3 className={`text-base font-black leading-snug line-clamp-1 ${isSelected ? "text-[var(--color-primary)]" : "text-slate-900"}`}>
                          {category.name || category.categoryName || "Untitled"}
                        </h3>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">ID: {category.id}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* ── Right Column: Subcategories Panel ── */}
          <section className="sticky top-24 flex max-h-[85vh] flex-col overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-sm">
            <div className="flex items-start justify-between gap-4 border-b border-slate-50 bg-slate-50/30 p-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)]">
                  Subcategories
                </p>
                <h2 className="mt-1 text-lg font-black text-slate-900 line-clamp-1">
                  {selectedCategory ? selectedCategory.name || selectedCategory.categoryName : "Select a category"}
                </h2>
              </div>
              <PrimaryBtn
                onClick={openCreateSubcategory}
                disabled={!selectedCategory || isSaving}
                small
              >
                + Add
              </PrimaryBtn>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {!selectedCategory ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="mb-3 text-4xl text-slate-200">👈</span>
                  <p className="text-sm font-bold text-slate-400">Choose a category to load its subcategories.</p>
                </div>
              ) : isSubcategoriesLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => <SkeletonSubcategoryRow key={i} delay={i * 30} />)}
                </div>
              ) : subcategories.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="mb-3 text-3xl text-slate-200">📑</span>
                  <p className="text-sm font-bold text-slate-400">No subcategories yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {subcategories.map((subcategory, i) => (
                    <div
                      key={subcategory.id}
                      className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-[var(--color-primary)]/20 hover:shadow-md"
                      style={{ animation: `fadeSlideUp 0.3s ease both ${i * 20}ms` }}
                    >
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate font-black text-slate-800">
                          {subcategory.name || subcategory.subcategoryName || "Untitled"}
                        </p>
                        <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                          ID: {subcategory.id}
                        </p>
                      </div>
                      <div className="flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => openEditSubcategory(subcategory)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:bg-[var(--color-primary)] hover:text-white"
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSubcategory(subcategory)}
                          disabled={isSaving}
                          className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <EntityModal
        isOpen={categoryModal.isOpen}
        title={categoryModal.item?.id ? "Edit Category" : "Create Category"}
        initialValue={categoryModal.item}
        isSaving={isSaving}
        onClose={() => setCategoryModal({ isOpen: false, item: null })}
        onSubmit={handleSaveCategory}
      />
      
      <EntityModal
        isOpen={subcategoryModal.isOpen}
        title={subcategoryModal.item?.id ? "Edit Subcategory" : "Create Subcategory"}
        initialValue={subcategoryModal.item}
        isSaving={isSaving}
        onClose={() => setSubcategoryModal({ isOpen: false, item: null })}
        onSubmit={handleSaveSubcategory}
        includeCategoryId
        categories={categories}
      />
    </>
  );
};

export default CategoriesManager;
