// src/features/jobs/presentation/screens/JobSourcesManagerScreen.jsx

import React, { useEffect, useState } from "react";
import { useJobSources } from "../../hooks/useJobSources";
import Button from "../../../../core/ui_components/Button";
import { useAuth } from "../../../../core/context/AuthContext";

const JobSourcesManagerScreen = () => {
  const { sources, isLoading, error, fetchSources, addSource, deleteSource } =
    useJobSources();
  const { isAdmin } = useAuth();

  // التحقق من الصلاحيات
  const [formData, setFormData] = useState({
    sourceName: "",
    sourceType: "",
    apiEndpoint: "",
    isActive: true,
  });

  useEffect(() => {
    if (isAdmin) {
      fetchSources(false); // جلب كل المصادر (النشطة وغير النشطة)
    }
  }, [fetchSources, isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await addSource(formData);
    if (success) {
      setFormData({
        sourceName: "",
        sourceType: "",
        apiEndpoint: "",
        isActive: true,
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المصدر؟")) {
      await deleteSource(id);
    }
  };

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
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-black text-gray-900">
          Job Sources Manager
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          إدارة واجهات الربط (APIs) ومصادر الوظائف الخارجية.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-bold text-center">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-sm">
        {/* فورم الإضافة */}
        <div className="lg:col-span-1 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm h-fit">
          <h3 className="font-black text-lg text-gray-800 mb-4">
            Add New Source
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">
                Source Name
              </label>
              <input
                type="text"
                required
                value={formData.sourceName}
                onChange={(e) =>
                  setFormData({ ...formData, sourceName: e.target.value })
                }
                className="w-full p-3 bg-slate-50 rounded-xl border border-gray-100 outline-none focus:border-primary"
                placeholder="e.g., LinkedIn, Wuzzuf..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">
                Source Type
              </label>
              <input
                type="text"
                required
                value={formData.sourceType}
                onChange={(e) =>
                  setFormData({ ...formData, sourceType: e.target.value })
                }
                className="w-full p-3 bg-slate-50 rounded-xl border border-gray-100 outline-none focus:border-primary"
                placeholder="e.g., API, Scraper..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">
                API Endpoint
              </label>
              <input
                type="url"
                value={formData.apiEndpoint}
                onChange={(e) =>
                  setFormData({ ...formData, apiEndpoint: e.target.value })
                }
                className="w-full p-3 bg-slate-50 rounded-xl border border-gray-100 outline-none focus:border-primary"
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-2 px-1">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-4 h-4 text-primary"
              />
              <label
                htmlFor="isActive"
                className="text-xs font-bold text-gray-700 cursor-pointer"
              >
                Active Source
              </label>
            </div>
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full shadow-lg shadow-primary/20"
            >
              Save Source
            </Button>
          </form>
        </div>

        {/* قائمة المصادر */}
        <div className="lg:col-span-2 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <h3 className="font-black text-lg text-gray-800 mb-4">
            Connected Sources
          </h3>
          {isLoading && sources.length === 0 ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : sources.length === 0 ? (
            <div className="text-center py-10 text-gray-400 font-bold bg-slate-50 rounded-2xl border border-dashed border-gray-200">
              لا توجد مصادر مضافة حالياً.
            </div>
          ) : (
            <div className="space-y-3">
              {sources.map((src) => (
                <div
                  key={src.id}
                  className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-gray-50 hover:bg-white hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-lg">
                      🔗
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-black text-gray-900">
                          {src.sourceName}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${src.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-500"}`}
                        >
                          {src.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                        <span className="font-bold text-gray-400 mr-1">
                          [{src.sourceType}]
                        </span>
                        {src.apiEndpoint || "No endpoint provided"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(src.id)}
                    className="text-gray-300 hover:text-red-500 bg-white p-2 rounded-lg transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSourcesManagerScreen;
