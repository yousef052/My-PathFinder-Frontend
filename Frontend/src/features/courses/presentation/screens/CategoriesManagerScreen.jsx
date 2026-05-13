import React, { useEffect, useState, useRef } from "react";
import { useCourseCategory } from "../../hooks/useCourseCategory";
import { useAuth } from "../../../../core/context/AuthContext";

// ─── Primitive UI Components ──────────────────────────────────────────────────
const PrimaryBtn = ({ children, onClick, disabled, className = "", type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center rounded-2xl bg-[var(--color-primary)] px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-100 transition duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-blue-200 active:scale-95 disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

const GhostBtn = ({ children, onClick, disabled, className = "", type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 transition duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] active:scale-95 disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

const inputCls =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none transition duration-200 focus:border-[var(--color-primary)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(91,124,250,0.08)]";

// ─── Loaders ─────────────────────────────────────────────────────────────────
const SkeletonItem = () => (
  <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
    <div className="h-4 w-1/3 animate-pulse rounded-md bg-slate-100" />
    <div className="flex gap-2">
      <div className="h-6 w-12 animate-pulse rounded-md bg-slate-100" />
      <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-100" />
    </div>
  </div>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const CategoriesManagerScreen = () => {
  const {
    categories,
    subcategories,
    isLoading,
    error,
    fetchCategories,
    fetchSubcategories,
    addCategory,
    deleteCategory,
    addSubcategory,
    deleteSubcategory,
    importJsonCategories,
  } = useCourseCategory();

  const { isAdmin } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories(selectedCategory.id);
    } else {
      fetchSubcategories(null);
    }
  }, [selectedCategory, fetchSubcategories]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const success = await addCategory(newCategoryName);
    if (success) setNewCategoryName("");
  };

  const handleAddSubcategory = async (e) => {
    e.preventDefault();
    if (!newSubcategoryName.trim() || !selectedCategory) return;
    const success = await addSubcategory(newSubcategoryName, selectedCategory.id);
    if (success) setNewSubcategoryName("");
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category? All related subcategories will be removed.")) {
      const success = await deleteCategory(id);
      if (success && selectedCategory?.id === id) setSelectedCategory(null);
    }
  };

  const handleDeleteSubcategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      await deleteSubcategory(id);
    }
  };

  const handleImportJson = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const success = await importJsonCategories(file);
    if (success) {
      alert("Categories imported successfully!");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex h-96 flex-col items-center justify-center rounded-[3.5rem] border border-slate-100 bg-white shadow-sm" style={{ animation: "fadeSlideUp 0.4s ease both" }}>
        <span className="mb-4 text-6xl">⛔</span>
        <h2 className="text-2xl font-black italic text-slate-900">Access Denied</h2>
        <p className="mt-2 font-medium text-slate-500">
          This area is restricted to system administrators.
        </p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>

      <div className="space-y-8 pb-24" style={{ animation: "fadeSlideUp 0.4s ease both" }}>
        
        {/* ── Header Section ── */}
        <div className="flex flex-col items-start justify-between gap-6 rounded-[3.5rem] border border-slate-100 bg-white p-8 shadow-sm md:flex-row md:items-end lg:p-10">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">Settings</p>
            <h2 className="mt-2 text-3xl font-black italic tracking-tight text-slate-900">
              Categories Manager
            </h2>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Configure main categories and their subcategory structures.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="file"
              accept=".json,application/json"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImportJson}
            />
            <button
              onClick={() => fileInputRef.current.click()}
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-200 transition duration-200 hover:bg-emerald-600 active:scale-95 disabled:opacity-50"
            >
              📥 Import JSON
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-center font-bold text-red-600" style={{ animation: "fadeSlideUp 0.3s ease both" }}>
            ⚠️ {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          
          {/* ── Main Categories ── */}
          <div className="flex h-[600px] flex-col rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
            <h3 className="mb-6 border-b border-slate-50 pb-4 text-xl font-black text-slate-800">
              Main Categories
            </h3>

            <form onSubmit={handleAddCategory} className="mb-6 flex gap-3">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New Category Name..."
                className={inputCls}
                disabled={isLoading}
              />
              <PrimaryBtn type="submit" disabled={isLoading} className="shrink-0 px-8">Add</PrimaryBtn>
            </form>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              {isLoading && categories.length === 0 ? (
                [...Array(5)].map((_, i) => <SkeletonItem key={i} />)
              ) : categories.length === 0 ? (
                <p className="py-10 text-center text-sm font-bold text-slate-400">
                  No main categories found.
                </p>
              ) : (
                categories.map((cat, i) => (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat)}
                    className={`group flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all duration-300 ${
                      selectedCategory?.id === cat.id
                        ? "border-[var(--color-primary)] bg-blue-50/50 shadow-md"
                        : "border-slate-100 bg-white hover:border-[var(--color-primary)]/30 hover:shadow-sm"
                    }`}
                    style={{ animation: `fadeSlideUp 0.3s ease both ${i * 30}ms` }}
                  >
                    <span className="font-black text-slate-800 transition-colors group-hover:text-[var(--color-primary)]">
                      {cat.name}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="rounded-lg bg-slate-50 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-slate-400 border border-slate-100">
                        ID: {cat.id}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(cat.id);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-300 transition-all hover:bg-red-50 hover:text-red-500"
                        title="Delete Category"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── Subcategories ── */}
          <div className="flex h-[600px] flex-col rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
            {!selectedCategory ? (
              <div className="flex h-full flex-col items-center justify-center text-slate-400">
                <span className="mb-4 text-6xl opacity-30 grayscale">📂</span>
                <p className="font-black text-slate-500">Select a main category to manage its subcategories.</p>
              </div>
            ) : (
              <>
                <h3 className="mb-6 flex items-center gap-3 border-b border-slate-50 pb-4 text-xl font-black text-slate-800">
                  Subcategories for
                  <span className="rounded-xl bg-blue-50 px-3 py-1.5 text-sm text-[var(--color-primary)]">
                    {selectedCategory.name}
                  </span>
                </h3>

                <form onSubmit={handleAddSubcategory} className="mb-6 flex gap-3">
                  <input
                    type="text"
                    value={newSubcategoryName}
                    onChange={(e) => setNewSubcategoryName(e.target.value)}
                    placeholder="New Subcategory Name..."
                    className={inputCls}
                    disabled={isLoading}
                  />
                  <PrimaryBtn type="submit" disabled={isLoading} className="shrink-0 px-8">Add</PrimaryBtn>
                </form>

                <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                  {isLoading && subcategories.length === 0 ? (
                    [...Array(4)].map((_, i) => <SkeletonItem key={i} />)
                  ) : subcategories.length === 0 ? (
                    <p className="py-10 text-center text-sm font-bold text-slate-400">
                      No subcategories exist for this category.
                    </p>
                  ) : (
                    subcategories.map((sub, i) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:border-[var(--color-primary)]/20 hover:bg-white hover:shadow-sm"
                        style={{ animation: `fadeSlideUp 0.3s ease both ${i * 30}ms` }}
                      >
                        <span className="font-bold text-slate-700">{sub.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="rounded-lg bg-white px-2 py-1 text-[9px] font-black uppercase tracking-widest text-slate-400 border border-slate-100">
                            ID: {sub.id}
                          </span>
                          <button
                            onClick={() => handleDeleteSubcategory(sub.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-300 transition-all hover:bg-red-50 hover:text-red-500"
                            title="Delete Subcategory"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoriesManagerScreen;
