// src/features/profile/presentation/components/EditProfileModal.jsx
import React, { useState, useEffect } from "react";
import { useProfile } from "../../hooks/useProfile";
import Button from "../../../../core/ui_components/Button";

const EditProfileModal = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateSuccess,
}) => {
  const { updateProfile, isUpdating } = useProfile();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    phoneNumber: "",
    bio: "",
    location: "",
    email: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (currentUser)
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        userName: currentUser.userName || "",
        phoneNumber: currentUser.phoneNumber || "",
        bio: currentUser.bio || "",
        location: currentUser.location || "",
        email: currentUser.email || "",
      });
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // تنفيذ التحديث[cite: 37, 46]
    const success = await updateProfile(formData, selectedImage);
    if (success) {
      // 💡 استدعاء دالة التحديث في الشاشة الأب لضمان ظهور البيانات الجديدة فوراً[cite: 46]
      if (onUpdateSuccess) onUpdateSuccess();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden border border-white flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Edit Identity Profile
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm transition-all"
          >
            ✕
          </button>
        </div>

        <div className="p-10 overflow-y-auto custom-scrollbar flex-1 bg-white">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* قسم الصورة الشخصية */}
            <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
              <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-3xl shadow-xl overflow-hidden border-2 border-white">
                {selectedImage ? (
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                ) : (
                  <>{formData.firstName?.[0] || "👤"}</>
                )}
              </div>
              <label className="bg-[#5b7cfa] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest cursor-pointer hover:shadow-lg transition-all shadow-blue-100 active:scale-95">
                Change Photo
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setSelectedImage(e.target.files[0])}
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "firstName",
                "lastName",
                "userName",
                "phoneNumber",
                "location",
                "email",
              ].map((field) => (
                <div key={field} className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    value={formData[field]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all font-bold text-sm shadow-sm"
                  />
                </div>
              ))}
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                  Bio Description
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="w-full p-6 bg-slate-50 rounded-[2rem] h-32 resize-none outline-none text-sm font-medium shadow-sm"
                />
              </div>
            </div>
            <Button
              type="submit"
              isLoading={isUpdating}
              fullWidth
              className="py-5 shadow-blue-200"
            >
              Sync & Save Changes
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
