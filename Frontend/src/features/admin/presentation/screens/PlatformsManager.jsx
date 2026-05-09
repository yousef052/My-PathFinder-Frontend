import React, { useEffect, useMemo, useState } from "react";
import { useAdminPlatforms } from "../../hooks/useAdminPlatforms";

const emptyPlatformForm = {
  platformName: "",
  platformUrl: "",
  isActive: true,
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

const PlatformModal = ({ isOpen, title, initialValue, isSaving, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(emptyPlatformForm);

  useEffect(() => {
    if (initialValue) {
      setFormData({
        platformName: initialValue.name || initialValue.platformName || initialValue.Name || "",
        platformUrl: initialValue.baseUrl || initialValue.platformUrl || initialValue.BaseUrl || "",
        isActive: initialValue.isActive !== undefined ? initialValue.isActive : true,
      });
    } else {
      setFormData(emptyPlatformForm);
    }
  }, [initialValue, isOpen]);

  if (!isOpen) return null;

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Map back to Swagger expected names if necessary (platform hook handles this)
    const payload = {
      name: formData.platformName,
      baseUrl: formData.platformUrl,
      isActive: formData.isActive
    };
    const success = await onSubmit(payload);
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#5b7cfa]">Platform</p>
            <h2 className="text-xl font-black text-slate-900">{title}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl px-3 py-2 text-sm font-black text-slate-400 hover:bg-slate-50 hover:text-red-500">Close</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <Field label="Platform Name">
            <input name="platformName" value={formData.platformName} onChange={updateField} className={inputClass} required />
          </Field>
          <Field label="Platform URL">
            <input name="platformUrl" type="url" value={formData.platformUrl} onChange={updateField} className={inputClass} required />
          </Field>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={updateField} className="w-5 h-5 rounded border-slate-300 text-[#5b7cfa] focus:ring-[#5b7cfa]" />
            <label htmlFor="isActive" className="text-sm font-bold text-slate-700">Is Active</label>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <GhostButton onClick={onClose} disabled={isSaving}>Cancel</GhostButton>
            <PrimaryButton type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save"}</PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};

const PlatformsManager = () => {
  const { platforms, isLoading, isSaving, error, fetchPlatforms, savePlatform, deletePlatform } = useAdminPlatforms();
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState({ isOpen: false, item: null });

  useEffect(() => {
    fetchPlatforms();
  }, [fetchPlatforms]);

  const visiblePlatforms = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    if (!needle) return platforms;
    return platforms.filter((p) => (p.name || p.platformName || p.Name || "").toLowerCase().includes(needle));
  }, [platforms, searchTerm]);

  const openCreate = () => setModal({ isOpen: true, item: null });
  const openEdit = (platform) => setModal({ isOpen: true, item: platform });
  const handleSave = (payload) => savePlatform(payload, modal.item?.id);
  
  const handleDelete = async (platform) => {
    const name = platform.name || platform.platformName || platform.Name || `#${platform.id}`;
    if (window.confirm(`Delete platform "${name}"?`)) {
      await deletePlatform(platform.id);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#5b7cfa]">Admin Module</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Course Platforms</h1>
          <p className="mt-2 max-w-2xl text-sm font-medium text-slate-500">Manage external course providers (e.g. Coursera, Udemy).</p>
        </div>
        <PrimaryButton onClick={openCreate} disabled={isSaving}>+ New Platform</PrimaryButton>
      </div>

      {error && <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-600">{error}</div>}

      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-5">
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Filter platforms..." className={`${inputClass} max-w-md`} />
        </div>

        {isLoading ? <Spinner /> : visiblePlatforms.length === 0 ? (
          <div className="p-6"><EmptyState title="No platforms found" message="Add a platform to display courses from it." /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <tr>
                  <th className="px-5 py-4">ID</th>
                  <th className="px-5 py-4">Platform Name</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visiblePlatforms.map((platform) => (
                  <tr key={platform.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-4 font-bold text-slate-500">{platform.id}</td>
                    <td className="px-5 py-4 font-black text-slate-900">{platform.name || platform.platformName || platform.Name || "Unnamed Platform"}</td>
                    <td className="px-5 py-4">
                      {platform.isActive ? (
                        <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg font-black text-[9px] uppercase tracking-widest">Active</span>
                      ) : (
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg font-black text-[9px] uppercase tracking-widest">Inactive</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => openEdit(platform)} className="rounded-xl px-3 py-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100">Edit</button>
                        <button type="button" onClick={() => handleDelete(platform)} disabled={isSaving} className="rounded-xl px-3 py-2 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default PlatformsManager;
