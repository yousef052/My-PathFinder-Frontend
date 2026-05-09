import React, { useState } from "react";
import { useProfile } from "../../../profile/hooks/useProfile";
import EditProfileModal from "../../../profile/presentation/components/EditProfileModal";
import { resolveMediaUrl } from "../../../../core/utils/mediaUrl";

const AdminProfileManager = () => {
  const { user, isLoading, refreshProfile } = useProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-40">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#5b7cfa]" />
      </div>
    );

  const displayName = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.userName || "Admin User";
  const profilePic = resolveMediaUrl(user?.profilePictureUrl || user?.ProfilePictureUrl);

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentUser={user}
        onUpdateSuccess={refreshProfile}
      />

      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#5b7cfa]">Account Management</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Admin Profile</h1>
          <p className="mt-2 max-w-2xl text-sm font-medium text-slate-500">Manage your identity, contact information, and administrative bio.</p>
        </div>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="inline-flex items-center justify-center rounded-2xl bg-[#5b7cfa] px-8 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-blue-100 transition hover:bg-[#3652d9] active:scale-95"
        >
          ✏️ Edit Profile Info
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-8">
          <div className="rounded-[3rem] bg-white p-10 border border-slate-100 shadow-xl shadow-blue-50/50 flex flex-col items-center text-center">
            <div className="w-40 h-40 bg-[#5b7cfa] rounded-[2.5rem] flex items-center justify-center text-6xl font-black text-white shadow-2xl overflow-hidden border-4 border-white mb-6">
              {profilePic ? (
                <img src={profilePic} alt="Admin" className="w-full h-full object-cover" />
              ) : (
                (user?.firstName?.[0] || user?.userName?.[0] || "A").toUpperCase()
              )}
            </div>
            <h3 className="text-2xl font-black text-slate-900">{displayName}</h3>
            <p className="text-sm font-bold text-slate-400 mt-1">{user?.email}</p>
            <div className="mt-6 inline-flex px-4 py-1.5 bg-blue-50 text-[#5b7cfa] rounded-full text-[10px] font-black uppercase tracking-widest">
              System Administrator
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-[3rem] bg-white p-10 border border-slate-100 shadow-sm">
            <h4 className="text-lg font-black text-slate-900 mb-8 border-b border-slate-50 pb-4">Personal Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Full Name</p>
                <p className="text-sm font-black text-slate-700">{displayName}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Username</p>
                <p className="text-sm font-black text-slate-700">@{user?.userName}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Phone Number</p>
                <p className="text-sm font-black text-slate-700">{user?.phoneNumber || "Not provided"}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Location</p>
                <p className="text-sm font-black text-slate-700">{user?.location || "Not provided"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Bio / Status</p>
                <p className="text-sm font-medium text-slate-500 italic leading-relaxed">
                  {user?.bio || "No administrative bio provided yet."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfileManager;
