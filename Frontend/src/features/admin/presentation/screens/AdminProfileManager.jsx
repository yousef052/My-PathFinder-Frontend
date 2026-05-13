import React, { useState } from "react";
import { useProfile } from "../../../profile/hooks/useProfile";
import EditProfileModal from "../../../profile/presentation/components/EditProfileModal";
import { resolveMediaUrl } from "../../../../core/utils/mediaUrl";

const SkeletonProfile = () => (
  <div className="space-y-10 pb-20">
    <div className="flex animate-pulse flex-col justify-between gap-5 lg:flex-row lg:items-end">
      <div className="space-y-3">
        <div className="h-3 w-32 rounded bg-slate-100" />
        <div className="h-8 w-64 rounded bg-slate-100" />
        <div className="h-4 w-96 rounded bg-slate-100" />
      </div>
      <div className="h-12 w-48 rounded-2xl bg-slate-100" />
    </div>
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
      <div className="h-[400px] animate-pulse rounded-[3rem] bg-slate-100 lg:col-span-1" />
      <div className="h-[400px] animate-pulse rounded-[3rem] bg-slate-100 lg:col-span-2" />
    </div>
  </div>
);

const AdminProfileManager = () => {
  const { user, isLoading, refreshProfile } = useProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (isLoading) return <SkeletonProfile />;

  const displayName = (user?.firstName || user?.FirstName) && (user?.lastName || user?.LastName) 
    ? `${user.firstName || user.FirstName} ${user.lastName || user.LastName}` 
    : user?.userName || user?.UserName || "Admin User";
  const profilePic = resolveMediaUrl(user?.profilePictureUrl || user?.ProfilePictureUrl);

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>

      <div className="space-y-10 pb-20" style={{ animation: "fadeSlideUp 0.35s ease both" }}>
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentUser={user}
          onUpdateSuccess={refreshProfile}
        />

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--color-primary)]">
              Account Management
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Admin Profile
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-slate-500">
              Manage your identity, contact information, and administrative bio.
            </p>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center justify-center rounded-2xl bg-[var(--color-primary)] px-8 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-blue-100 transition duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-blue-200 active:scale-95"
          >
            ✏️ Edit Profile Info
          </button>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Left Column: Avatar & Summary */}
          <div
            className="group lg:col-span-1"
            style={{ animation: "fadeSlideUp 0.4s ease both 60ms" }}
          >
            <div className="flex flex-col items-center rounded-[3rem] border border-slate-100 bg-white p-10 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-primary)]/20 hover:shadow-xl hover:shadow-blue-50/70">
              <div className="mb-6 flex h-40 w-40 items-center justify-center overflow-hidden rounded-[2.5rem] border-4 border-white bg-gradient-to-br from-[var(--color-primary)] to-[#818cf8] text-6xl font-black text-white shadow-2xl transition-transform duration-300 group-hover:scale-105">
                {profilePic ? (
                  <img src={profilePic} alt="Admin" className="h-full w-full object-cover" />
                ) : (
                  (user?.firstName?.[0] || user?.userName?.[0] || "A").toUpperCase()
                )}
              </div>
              <h3 className="text-2xl font-black text-slate-900">{displayName}</h3>
              <p className="mt-1 text-sm font-bold text-slate-400">{user?.email}</p>
              <div className="mt-6 inline-flex rounded-full bg-blue-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)]">
                System Administrator
              </div>
            </div>
          </div>

          {/* Right Column: Details Grid */}
          <div
            className="lg:col-span-2 space-y-8"
            style={{ animation: "fadeSlideUp 0.45s ease both 120ms" }}
          >
            <div className="rounded-[3rem] border border-slate-100 bg-white p-10 shadow-sm transition-all duration-300 hover:border-[var(--color-primary)]/20 hover:shadow-xl hover:shadow-blue-50/70">
              <h4 className="mb-8 border-b border-slate-50 pb-4 text-lg font-black text-slate-900">
                Personal Details
              </h4>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                  <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Full Name
                  </p>
                  <p className="text-sm font-black text-slate-700">{displayName}</p>
                </div>
                <div>
                  <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Username
                  </p>
                  <p className="text-sm font-black text-slate-700">@{user?.userName || user?.UserName}</p>
                </div>
                <div>
                  <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Phone Number
                  </p>
                  <p className="text-sm font-black text-slate-700">{user?.phoneNumber || user?.PhoneNumber || "Not provided"}</p>
                </div>
                <div>
                  <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Location
                  </p>
                  <p className="text-sm font-black text-slate-700">{user?.location || user?.Location || "Not provided"}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Bio / Status
                  </p>
                  <p className="text-sm font-medium leading-relaxed italic text-slate-500">
                    {user?.bio || user?.Bio || "No administrative bio provided yet."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProfileManager;
