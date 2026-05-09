// src/features/courses/presentation/screens/CategoriesManagerScreen.jsx

import React, { useEffect, useState, useRef } from "react";
import { useCourseCategory } from "../../hooks/useCourseCategory";
import Button from "../../../../core/ui_components/Button";
import { useAuth } from "../../../../core/context/AuthContext";

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

  // حالة لتتبع التصنيف الرئيسي المحدد حالياً لعرض تصنيفاته الفرعية
  const [selectedCategory, setSelectedCategory] = useState(null);

  // حالات نصوص الإضافة
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubcategoryName, setNewSubcategoryName] = useState("");

  const fileInputRef = useRef(null);

  // جلب التصنيفات الرئيسية عند تحميل الشاشة
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // جلب التصنيفات الفرعية كلما تغير التصنيف الرئيسي المحدد
  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories(selectedCategory.id);
    } else {
      fetchSubcategories(null); // تفريغ القائمة
    }
  }, [selectedCategory, fetchSubcategories]);

  // -- دوال التعامل مع الإضافة والحذف --

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const success = await addCategory(newCategoryName);
    if (success) setNewCategoryName("");
  };

  const handleAddSubcategory = async (e) => {
    e.preventDefault();
    if (!newSubcategoryName.trim() || !selectedCategory) return;
    const success = await addSubcategory(
      newSubcategoryName,
      selectedCategory.id,
    );
    if (success) setNewSubcategoryName("");
  };

  const handleDeleteCategory = async (id) => {
    if (
      window.confirm(
        "هل أنت متأكد من حذف هذا التصنيف؟ سيتم حذف جميع الكورسات والتصنيفات الفرعية المرتبطة به.",
      )
    ) {
      const success = await deleteCategory(id);
      if (success && selectedCategory?.id === id) setSelectedCategory(null);
    }
  };

  const handleDeleteSubcategory = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا التصنيف الفرعي؟")) {
      await deleteSubcategory(id);
    }
  };

  // -- دالة استيراد JSON --
  const handleImportJson = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const success = await importJsonCategories(file);
    if (success) {
      alert("تم استيراد التصنيفات بنجاح!");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // حماية الشاشة (إظهار رسالة لغير المديرين)
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-white rounded-[2rem] border border-gray-100 shadow-sm animate-fade-in">
        <span className="text-6xl mb-4">⛔</span>
        <h2 className="text-2xl font-black text-gray-800">Access Denied</h2>
        <p className="text-gray-500 font-medium mt-2">
          عذراً، هذه الشاشة مخصصة لمديري النظام (Admins) فقط.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* الترويسة وأزرار التحكم */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-gray-900">
            Categories Manager
          </h2>
          <p className="text-gray-500 font-medium text-sm mt-1">
            إدارة التصنيفات الرئيسية والفرعية للكورسات
          </p>
        </div>

        {/* زر رفع ملف JSON */}
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept=".json,application/json"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImportJson}
          />
          <Button
            onClick={() => fileInputRef.current.click()}
            isLoading={isLoading}
            className="bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
          >
            📥 Import JSON
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-bold text-center">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* العمود الأول: التصنيفات الرئيسية */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col h-[600px]">
          <h3 className="text-lg font-black text-gray-800 mb-4 border-b border-gray-50 pb-4">
            Main Categories
          </h3>

          {/* فورم إضافة تصنيف رئيسي */}
          <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New Category Name..."
              className="flex-1 p-3 bg-slate-50 border border-gray-200 rounded-xl outline-none focus:border-primary text-sm"
              disabled={isLoading}
            />
            <Button
              type="submit"
              isLoading={isLoading}
              className="px-6 shadow-sm"
            >
              Add
            </Button>
          </form>

          {/* قائمة التصنيفات */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {categories.length === 0 && !isLoading ? (
              <p className="text-center text-gray-400 text-sm py-10">
                لا توجد تصنيفات رئيسية.
              </p>
            ) : (
              categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`flex justify-between items-center p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedCategory?.id === cat.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-gray-100 hover:border-gray-300 bg-white"
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  <span className="font-bold text-gray-800">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
                      ID: {cat.id}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(cat.id);
                      }}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      title="حذف التصنيف"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* العمود الثاني: التصنيفات الفرعية */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col h-[600px]">
          {!selectedCategory ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <span className="text-5xl mb-4">👈</span>
              <p className="font-bold">يرجى اختيار تصنيف رئيسي أولاً</p>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-black text-gray-800 mb-4 border-b border-gray-50 pb-4 flex items-center gap-2">
                Subcategories for{" "}
                <span className="text-primary bg-primary/10 px-3 py-1 rounded-lg text-sm">
                  {selectedCategory.name}
                </span>
              </h3>

              {/* فورم إضافة تصنيف فرعي */}
              <form onSubmit={handleAddSubcategory} className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newSubcategoryName}
                  onChange={(e) => setNewSubcategoryName(e.target.value)}
                  placeholder="New Subcategory Name..."
                  className="flex-1 p-3 bg-slate-50 border border-gray-200 rounded-xl outline-none focus:border-primary text-sm"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="px-6 shadow-sm"
                >
                  Add
                </Button>
              </form>

              {/* قائمة التصنيفات الفرعية */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                {isLoading && subcategories.length === 0 ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : subcategories.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-10">
                    لا توجد تصنيفات فرعية لهذا القسم.
                  </p>
                ) : (
                  subcategories.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex justify-between items-center p-4 rounded-xl border border-gray-100 bg-slate-50 hover:bg-white transition-colors"
                    >
                      <span className="font-bold text-gray-700">
                        {sub.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded-lg">
                          ID: {sub.id}
                        </span>
                        <button
                          onClick={() => handleDeleteSubcategory(sub.id)}
                          className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
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
  );
};

export default CategoriesManagerScreen;
