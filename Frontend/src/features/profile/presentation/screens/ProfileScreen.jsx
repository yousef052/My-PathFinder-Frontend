// src/features/profile/presentation/screens/ProfileScreen.jsx
import React, { useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import SkillsSection from "../components/SkillsSection";
import ExperienceSection from "../components/ExperienceSection";
import EducationSection from "../components/EducationSection";
import EditProfileModal from "../components/EditProfileModal";
import { resolveMediaUrl } from "../../../../core/utils/mediaUrl";

const ProfileScreen = () => {
  const { user, isLoading: isProfileLoading, refreshProfile } = useProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (isProfileLoading)
    return (
      <div className="flex items-center justify-center py-40">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#5b7cfa]"></div>
      </div>
    );

  const rawPic = user?.profilePictureUrl || user?.ProfilePictureUrl;
  const finalProfilePic = resolveMediaUrl(rawPic);

  // 💡 التفكير الهندسي: معالجة البيانات الناقصة بذكاء
  const isProfileIncomplete = !user?.firstName || !user?.lastName;
  const displayName =
    user?.firstName && user?.lastName
      ? `${user?.firstName} ${user?.lastName}`
      : user?.userName || "Professional User";

  const initial = user?.firstName
    ? user.firstName[0]
    : user?.userName
      ? user.userName[0]
      : "P";

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-in pb-20 px-4">
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentUser={user}
        onUpdateSuccess={refreshProfile}
      />

      {/* 💡 Banner لتشجيع المستخدم على إكمال بياناته إذا كانت ناقصة */}
      {isProfileIncomplete && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-4 animate-fade-in shadow-sm mt-4">
          <div>
            <h3 className="font-black text-lg mb-1">
              Welcome to Path Finder! 🎉
            </h3>
            <p className="text-sm font-medium opacity-80">
              Please take a moment to set up your profile name and bio to unlock
              personalized recommendations.
            </p>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="bg-[#5b7cfa] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-colors whitespace-nowrap shadow-md"
          >
            Complete Profile
          </button>
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-xl shadow-blue-50/50 border border-white flex flex-col md:flex-row gap-10 items-center md:items-start relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50 z-0"></div>

        <div className="w-40 h-40 md:w-48 md:h-48 bg-[#5b7cfa] text-white rounded-[2.5rem] flex items-center justify-center text-6xl font-black shadow-2xl shadow-blue-200 overflow-hidden border-4 border-white relative z-10">
          {finalProfilePic ? (
            <img
              src={finalProfilePic}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="uppercase">{initial}</div>
          )}
        </div>

        <div className="flex-1 space-y-6 relative z-10 text-center md:text-left">
          <div className="space-y-2">
            {/* 💡 استخدام الـ Display Name الآمن */}
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 capitalize tracking-tight">
              {displayName}
            </h2>
            <p className="text-xl text-gray-400 font-semibold italic">
              {user?.bio || "No bio set yet."}
            </p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4 border-t border-slate-50">
            <span className="bg-slate-50 px-5 py-2.5 rounded-2xl text-gray-600 font-black text-[11px] uppercase tracking-widest border border-gray-50">
              📍 {user?.location || "Not Set"}
            </span>
            <span className="bg-slate-50 px-5 py-2.5 rounded-2xl text-gray-600 font-black text-[11px] uppercase tracking-widest border border-gray-50">
              📧 {user?.email}
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsEditModalOpen(true)}
          className="relative z-30 md:absolute top-10 right-10 bg-white text-[#5b7cfa] hover:bg-[#5b7cfa] hover:text-white px-8 py-4 rounded-2xl font-black transition-all border border-blue-100 shadow-lg flex items-center gap-2 uppercase text-[10px] tracking-widest active:scale-95"
        >
          ✏️ Edit Profile
        </button>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-4 space-y-10">
          <SkillsSection />
        </div>

        <div className="lg:col-span-8 space-y-10">
          <ExperienceSection />
          <EducationSection />
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
