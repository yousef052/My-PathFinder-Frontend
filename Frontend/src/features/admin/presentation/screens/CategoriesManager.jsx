import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAdminCategories } from "../../hooks/useAdminCategories";

const emptyCategoryForm = { name: "" };
const emptySubcategoryForm = { name: "", categoryId: 0 };

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

const EntityModal = ({
  isOpen,
  title,
  initialValue,
  isSaving,
  onClose,
  onSubmit,
  includeCategoryId = false,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#5b7cfa]">
              Taxonomy
            </p>
            <h2 className="text-xl font-black text-slate-900">{title}</h2>
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
          <Field label="Name">
            <input
              name="name"
              value={formData.name}
              onChange={updateField}
              className={inputClass}
              required
            />
          </Field>

          {includeCategoryId && (
            <Field label="Category ID">
              <input
                type="number"
                min="1"
                name="categoryId"
                value={formData.categoryId}
                onChange={updateField}
                className={inputClass}
                required
              />
            </Field>
          )}

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
  const [categoryModal, setCategoryModal] = useState({
    isOpen: false,
    item: null,
  });
  const [subcategoryModal, setSubcategoryModal] = useState({
    isOpen: false,
    item: null,
  });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const visibleCategories = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    if (!needle) return categories || [];

    return (categories || []).filter((category) =>
      (category?.name || category?.categoryName || "")
        .toLowerCase()
        .includes(needle),
    );
  }, [categories, searchTerm]);

  const openCreateCategory = () =>
    setCategoryModal({ isOpen: true, item: null });

  const openEditCategory = (category) =>
    setCategoryModal({
      isOpen: true,
      item: {
        id: category.id,
        name: category.name || category.categoryName || "",
      },
    });

  const openCreateSubcategory = () =>
    setSubcategoryModal({
      isOpen: true,
      item: { ...emptySubcategoryForm, categoryId: selectedCategory?.id || 0 },
    });

  const openEditSubcategory = (subcategory) =>
    setSubcategoryModal({
      isOpen: true,
      item: {
        id: subcategory.id,
        name: subcategory.name || subcategory.subcategoryName || "",
        categoryId: selectedCategory?.id || subcategory.categoryId || 0,
      },
    });

  const handleSaveCategory = (payload) =>
    saveCategory({ name: payload.name }, categoryModal.item?.id);

  const handleSaveSubcategory = (payload) =>
    saveSubcategory(
      {
        name: payload.name,
        categoryId: payload.categoryId || selectedCategory?.id,
      },
      subcategoryModal.item?.id,
    );

  const handleDeleteCategory = async (category) => {
    const name = category.name || category.categoryName || `#${category.id}`;
    if (window.confirm(`Delete category "${name}"?`)) {
      await deleteCategory(category.id);
    }
  };

  const handleDeleteSubcategory = async (subcategory) => {
    const name =
      subcategory.name || subcategory.subcategoryName || `#${subcategory.id}`;
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
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#5b7cfa]">
            Admin Module
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Categories
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-medium text-slate-500">
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
          <GhostButton
            onClick={() => fileInputRef.current?.click()}
            disabled={isSaving}
          >
            Import JSON
          </GhostButton>
          <PrimaryButton onClick={openCreateCategory} disabled={isSaving}>
            New Category
          </PrimaryButton>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Categories
          </p>
          <p className="mt-2 text-3xl font-black text-slate-900">
            {stats.categories}
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Selected subcategories
          </p>
          <p className="mt-2 text-3xl font-black text-slate-900">
            {stats.subcategories}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_440px]">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-5">
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Filter loaded categories..."
              className={`${inputClass} max-w-md`}
            />
          </div>

          {isLoading ? (
            <Spinner />
          ) : visibleCategories.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No categories found"
                message="Create a category or import a JSON taxonomy from the API."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">ID</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleCategories.map((category) => {
                    const isSelected = selectedCategory?.id === category.id;

                    return (
                      <tr
                        key={category.id}
                        className={
                          isSelected ? "bg-blue-50/60" : "hover:bg-slate-50/80"
                        }
                      >
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => fetchSubcategories(category)}
                            className="text-left"
                          >
                            <p className="font-black text-slate-900">
                              {category.name ||
                                category.categoryName ||
                                "Untitled"}
                            </p>
                            <p className="mt-1 text-xs font-medium text-slate-400">
                              Select to manage subcategories
                            </p>
                          </button>
                        </td>
                        <td className="px-5 py-4 font-bold text-slate-500">
                          {category.id}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditCategory(category)}
                              className="rounded-xl px-3 py-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(category)}
                              className="rounded-xl px-3 py-2 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50"
                              disabled={isSaving}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Subcategories
              </p>
              <h2 className="mt-1 text-lg font-black text-slate-900">
                {selectedCategory
                  ? selectedCategory.name || selectedCategory.categoryName
                  : "No category selected"}
              </h2>
            </div>
            <PrimaryButton
              onClick={openCreateSubcategory}
              disabled={!selectedCategory || isSaving}
            >
              Add
            </PrimaryButton>
          </div>

          <div className="p-5">
            {!selectedCategory ? (
              <EmptyState
                title="Select a category"
                message="Choose a category from the table to load its subcategories."
              />
            ) : isSubcategoriesLoading ? (
              <Spinner />
            ) : subcategories.length === 0 ? (
              <EmptyState
                title="No subcategories"
                message="Create the first subcategory for the selected category."
              />
            ) : (
              <div className="space-y-3">
                {subcategories.map((subcategory) => (
                  <div
                    key={subcategory.id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <div>
                      <p className="font-black text-slate-800">
                        {subcategory.name ||
                          subcategory.subcategoryName ||
                          "Untitled"}
                      </p>
                      <p className="mt-1 text-xs font-bold text-slate-400">
                        ID: {subcategory.id}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditSubcategory(subcategory)}
                        className="rounded-xl px-3 py-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-white"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSubcategory(subcategory)}
                        className="rounded-xl px-3 py-2 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50"
                        disabled={isSaving}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <EntityModal
        isOpen={categoryModal.isOpen}
        title={categoryModal.item?.id ? "Edit category" : "Create category"}
        initialValue={categoryModal.item}
        isSaving={isSaving}
        onClose={() => setCategoryModal({ isOpen: false, item: null })}
        onSubmit={handleSaveCategory}
      />
      <EntityModal
        isOpen={subcategoryModal.isOpen}
        title={
          subcategoryModal.item?.id ? "Edit subcategory" : "Create subcategory"
        }
        initialValue={subcategoryModal.item}
        isSaving={isSaving}
        onClose={() => setSubcategoryModal({ isOpen: false, item: null })}
        onSubmit={handleSaveSubcategory}
        includeCategoryId
      />
    </div>
  );
};

export default CategoriesManager;
