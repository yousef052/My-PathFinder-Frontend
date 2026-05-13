// src/features/profile/presentation/screens/ProfileScreen.jsx
import React, { useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import SkillsSection from "../components/SkillsSection";
import ExperienceSection from "../components/ExperienceSection";
import EducationSection from "../components/EducationSection";
import EditProfileModal from "../components/EditProfileModal";
import { resolveMediaUrl } from "../../../../core/utils/mediaUrl";

// ─── Main Screen ──────────────────────────────────────────────────────────────
const ProfileScreen = () => {
  const { user, isLoading: isProfileLoading, refreshProfile } = useProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  React.useEffect(() => {
    document.documentElement.style.setProperty('--theme-color', '#4763e1');
    document.documentElement.style.setProperty('--bg-orb-1', '#4763e1');
    document.documentElement.style.setProperty('--bg-orb-2', '#33aefc');
    document.documentElement.style.setProperty('--bg-orb-3', '#1e1b4b');
    document.documentElement.style.setProperty('--bg-gradient-start', '#1e1b4b');
    document.documentElement.style.setProperty('--bg-gradient-end', '#0f172a');
  }, []);

  if (isProfileLoading) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4 animate-fade-in">
        <div className="h-16 w-16 animate-spin rounded-full border-[6px] border-primary/20 border-t-primary shadow-xl" />
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary animate-pulse">Scanning Profile...</p>
      </div>
    );
  }

  const rawPic = user?.profilePictureUrl || user?.ProfilePictureUrl;
  const finalProfilePic = resolveMediaUrl(rawPic);
  const isProfileIncomplete = !user?.firstName || !user?.lastName;

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.userName || "PathFinder Talent";

  const initial = user?.firstName
    ? user.firstName[0]
    : user?.userName
      ? user.userName[0]
      : "P";

  return (
    <div className="space-y-10 pb-16 animate-pop">
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentUser={user}
        onUpdateSuccess={refreshProfile}
      />

      {/* ── Incomplete Profile Alert ── */}
      {isProfileIncomplete && (
        <div className="group relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-[2.5rem] bg-primary p-8 shadow-2xl shadow-primary/20 sm:flex-row">
          <div className="relative z-10 text-center sm:text-left">
             <h3 className="text-xl font-black text-white italic mb-1">Establish Identity 🚀</h3>
             <p className="text-xs font-medium text-white/80 leading-relaxed">
               Your profile is currently an anonymous node. Complete setup to calibrate AI.
             </p>
          </div>
          <button onClick={() => setIsEditModalOpen(true)} className="relative z-10 shrink-0 bg-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary shadow-xl hover:-translate-y-1 transition-all">Calibrate Now ↗</button>
        </div>
      )}

      {/* ── Profile Hero ── */}
      <div className="glass-card relative flex flex-col items-center gap-10 overflow-hidden p-10 md:p-14 rounded-[4rem] md:flex-row group border border-white/50 shadow-glass bg-white/70 backdrop-blur-xl">
        <div className="relative z-10 flex h-44 w-44 shrink-0 items-center justify-center overflow-hidden rounded-[2rem] border-4 border-white bg-slate-100 text-6xl font-black text-slate-300 shadow-2xl md:h-52 md:w-52 transition-all duration-700 hover:scale-105 group-hover:rotate-2">
          {finalProfilePic ? <img src={finalProfilePic} alt="Profile" className="h-full w-full object-cover" /> : <div className="uppercase tracking-tighter">{initial}</div>}
        </div>

        <div className="relative z-10 flex-1 space-y-6 text-center md:text-left">
          <div className="space-y-3">
            <div className="inline-flex rounded-full bg-primary/10 px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-primary">Verified Talent Node</div>
            <h2 className="text-4xl font-black capitalize tracking-tighter text-slate-950 lg:text-7xl leading-[0.8] italic uppercase">{displayName}</h2>
            <p className="max-w-2xl text-lg font-medium italic text-slate-400 leading-relaxed">{user?.bio || "Professional Trajectory Active. Ready for optimization."}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 pt-4 md:justify-start">
            <div className="bg-white/50 backdrop-blur-md px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-500 border border-slate-100 shadow-sm flex items-center gap-2"><span>📍</span> {user?.location || "Global Node"}</div>
            <div className="bg-white/50 backdrop-blur-md px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-500 border border-slate-100 shadow-sm flex items-center gap-2"><span>📧</span> {user?.email}</div>
          </div>
        </div>

        <button onClick={() => setIsEditModalOpen(true)} className="relative z-30 bg-primary text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all md:absolute md:right-12 md:top-12">✏️ Update Node</button>
      </div>

      {/* ── Content Grid ── */}
      <div className="grid grid-main items-start">
        <div className="col-span-4 lg:col-span-4 lg:sticky lg:top-24">
          <SkillsSection />
        </div>
        <div className="col-span-4 lg:col-span-10 space-y-10">
          <ExperienceSection />
          <EducationSection />
          
          <div className="glass-card p-10 rounded-[3rem] border border-slate-100 shadow-glass flex flex-col items-center text-center space-y-4">
             <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl">📄</div>
             <div>
               <h4 className="text-xl font-black text-slate-950 italic">Portfolio Synchronized</h4>
               <p className="text-xs font-medium text-slate-400 mt-2 max-w-lg">Your identity node is stable. Proceed to the CV Lab for high-precision analysis.</p>
             </div>
             <button onClick={() => window.location.href = "/cv-manager"} className="bg-primary text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all">Manage CV Portfolio →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
