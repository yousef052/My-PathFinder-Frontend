import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useProfile } from "../../hooks/useProfile";

const inputCls =
  "w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:bg-white focus:border-[var(--color-primary)] focus:ring-4 focus:ring-blue-50/50 transition-all font-bold text-sm shadow-inner";

const EditProfileModal = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateSuccess,
}) => {
  const { updateProfile, isUpdating } = useProfile({ autoFetch: false });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    phoneNumber: "",
    bio: "",
    location: "",
    dateOfBirth: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (currentUser) {
      let formattedDate = "";
      if (currentUser.dateOfBirth) {
        try {
          formattedDate = new Date(currentUser.dateOfBirth).toISOString().split('T')[0];
        } catch (e) {
          console.error("Invalid date", currentUser.dateOfBirth);
        }
      }

      setFormData({
        firstName: currentUser.firstName || currentUser.FirstName || "",
        lastName: currentUser.lastName || currentUser.LastName || "",
        userName: currentUser.userName || currentUser.UserName || "",
        phoneNumber: currentUser.phoneNumber || currentUser.PhoneNumber || "",
        bio: currentUser.bio || currentUser.Bio || "",
        location: currentUser.location || currentUser.Location || "",
        dateOfBirth: formattedDate,
      });
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await updateProfile(formData, selectedImage);
    if (success) {
      if (onUpdateSuccess) onUpdateSuccess();
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      <style>{`
        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes overlayFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      >
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          onClick={onClose}
          style={{ animation: "overlayFade 0.3s ease both" }}
        />

        {/* Modal Content */}
        <div 
          className="relative w-full max-w-3xl overflow-hidden rounded-[3.5rem] border border-white bg-white shadow-2xl flex flex-col max-h-[92vh]"
          style={{ animation: "modalPop 0.4s cubic-bezier(0.16, 1, 0.3, 1) both" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-50 bg-slate-50/50 px-10 py-8">
            <div>
              <h2 className="text-3xl font-black italic tracking-tight text-slate-900">
                Edit Profile
              </h2>
              <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Personal Identity & Details
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm transition-all hover:bg-red-50 hover:text-red-500 active:scale-90"
            >
              <span className="text-2xl font-light">✕</span>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-10 py-10 scrollbar-hide">
            <form onSubmit={handleSubmit} className="space-y-10">
              
              {/* Avatar Upload */}
              <div className="group relative flex items-center gap-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 transition-colors hover:border-[var(--color-primary)]/30 hover:bg-blue-50/10">
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-xl">
                  {selectedImage ? (
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      className="h-full w-full object-cover"
                      alt="Preview"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[var(--color-primary)] text-4xl font-black text-white uppercase">
                      {formData.firstName?.[0] || "👤"}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Profile Photo</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed">
                    JPG or PNG. Recommended size: 400x400px.
                  </p>
                  <label className="mt-2 inline-flex cursor-pointer items-center justify-center rounded-xl bg-white border border-slate-100 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)] shadow-sm transition-all hover:bg-[var(--color-primary)] hover:text-white active:scale-95">
                    Choose New Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setSelectedImage(e.target.files[0])}
                    />
                  </label>
                </div>
              </div>

              {/* Grid Form Fields */}
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {[
                  { name: "firstName", label: "First Name", type: "text", placeholder: "John" },
                  { name: "lastName", label: "Last Name", type: "text", placeholder: "Doe" },
                  { name: "userName", label: "Username", type: "text", placeholder: "johndoe" },
                  { name: "phoneNumber", label: "Phone Number", type: "tel", placeholder: "+1 (000) 000-0000" },
                  { name: "location", label: "Current Location", type: "text", placeholder: "e.g. Cairo, Egypt" },
                  { name: "dateOfBirth", label: "Date of Birth", type: "date" },
                ].map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.name] || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, [field.name]: e.target.value })
                      }
                      className={inputCls}
                    />
                  </div>
                ))}
                
                <div className="space-y-2 md:col-span-2">
                  <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Short Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    rows={4}
                    className={`${inputCls} resize-none leading-relaxed`}
                    placeholder="Write a short summary about your professional background..."
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isUpdating}
                className="w-full py-5 bg-[var(--color-primary)] text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-[var(--color-primary-hover)] transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
              >
                {isUpdating ? "Syncing Profile..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default EditProfileModal;
