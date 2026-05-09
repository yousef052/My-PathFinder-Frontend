// src/features/courses/presentation/screens/PlatformManagerScreen.jsx
import React, { useEffect, useState } from "react";
import { useCoursePlatform } from "../../hooks/useCoursePlatform";
import Button from "../../../../core/ui_components/Button";
import { useAuth } from "../../../../core/context/AuthContext";
import { resolveMediaUrl } from "../../../../core/utils/mediaUrl";

const PlatformManagerScreen = () => {
  const {
    platforms,
    isLoading,
    error,
    fetchPlatforms,
    addPlatform,
    deletePlatform,
  } = useCoursePlatform();
  const { isAdmin } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    baseUrl: "",
    logoUrl: "",
    isActive: true,
  });

  useEffect(() => {
    fetchPlatforms();
  }, [fetchPlatforms]);

  if (!isAdmin)
    return (
      <div className="p-20 text-center font-black uppercase text-gray-300">
        Access Restricted
      </div>
    );

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="bg-white p-10 rounded-[3rem] border border-white shadow-sm">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          Platform Configuration
        </h2>
        <p className="text-gray-400 font-medium text-xs mt-1 uppercase tracking-widest px-1">
          Manage External API Providers
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] border border-white shadow-sm h-fit space-y-6">
          <h3 className="font-black text-gray-900 px-2">
            Register New Provider
          </h3>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (await addPlatform(formData))
                setFormData({
                  name: "",
                  description: "",
                  baseUrl: "",
                  logoUrl: "",
                  isActive: true,
                });
            }}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="Platform Name"
              className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:bg-white focus:shadow-inner transition-all text-sm font-bold"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <textarea
              placeholder="Service Description"
              className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none h-24 resize-none text-sm font-medium"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <input
              type="url"
              placeholder="API Base Endpoint"
              className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none text-sm font-bold"
              value={formData.baseUrl}
              onChange={(e) =>
                setFormData({ ...formData, baseUrl: e.target.value })
              }
              required
            />
            <Button
              type="submit"
              isLoading={isLoading}
              fullWidth
              className="py-4 shadow-blue-100"
            >
              Save Platform
            </Button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-white shadow-sm space-y-6">
          <h3 className="font-black text-gray-900 px-2">Active Integrations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {platforms.map((p) => (
              <div
                key={p.id}
                className="flex justify-between items-center p-6 bg-slate-50/50 rounded-3xl border border-gray-50 hover:bg-white hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:rotate-6 transition-transform">
                    {resolveMediaUrl(p.logoUrl) ? (
                      <img
                        src={resolveMediaUrl(p.logoUrl)}
                        className="w-6 h-6 object-contain"
                        alt=""
                      />
                    ) : (
                      "🌐"
                    )}
                  </div>
                  <div>
                    <p className="font-black text-gray-800 text-sm">{p.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold truncate max-w-[120px]">
                      {p.baseUrl}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deletePlatform(p.id)}
                  className="w-10 h-10 bg-white text-gray-300 hover:text-red-500 rounded-xl flex items-center justify-center shadow-sm transition-colors"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlatformManagerScreen;
