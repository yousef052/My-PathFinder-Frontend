// src/features/dashboard/presentation/screens/DashboardScreen.jsx
import React, { useEffect } from "react";
import { useProfile } from "../../../profile/hooks/useProfile";
import { useCourseRecommendation } from "../../../courses/hooks/useCourseRecommendation";
import { useCourseProgress } from "../../../courses/hooks/useCourseProgress";
import { useSkills } from "../../../profile/hooks/useSkills";
import { Link } from "react-router-dom";
import CourseCard from "../../../courses/presentation/components/CourseCard";
import Button from "../../../../core/ui_components/Button";

const DashboardScreen = () => {
  const { user, isLoading: isProfileLoading } = useProfile();
  const {
    recommendations,
    fetchRecommendations,
    isLoading: isRecLoading,
  } = useCourseRecommendation();
  const { userProgress, fetchMyProgress } = useCourseProgress();
  const { mySkills } = useSkills();

  useEffect(() => {
    if (fetchMyProgress) fetchMyProgress();
  }, [fetchMyProgress]);

  useEffect(() => {
    const targetTitle =
      user?.targetJobTitle ||
      user?.TargetJobTitle ||
      user?.desiredJobTitle ||
      user?.jobTitle ||
      "";

    fetchRecommendations(targetTitle);
  }, [fetchRecommendations, user]);

  if (isProfileLoading)
    return (
      <div className="flex flex-col justify-center items-center py-40 gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
        <p className="text-primary font-black text-[10px] uppercase tracking-widest animate-pulse">
          Syncing Journey...
        </p>
      </div>
    );

  const isProfileIncomplete = !user?.firstName || !user?.lastName;
  const greetingName = user?.firstName || user?.userName || "Explorer";

  return (
    <div className="space-y-12 pb-24 animate-fade-in-up">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden bg-slate-950 rounded-[4rem] p-12 lg:p-20 text-white shadow-2xl group border border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#5b7cfa]/20 via-transparent to-transparent opacity-60"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#5b7cfa]/10 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-16">
          <div className="space-y-10 max-w-2xl text-center lg:text-left">
            <div className="inline-flex px-5 py-2 bg-white/5 border border-white/10 rounded-full text-[#5b7cfa] text-[9px] font-black uppercase tracking-[0.3em] backdrop-blur-md">
              Evolutionary Path Active ⚡
            </div>
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[1] italic">
              Empower Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5b7cfa] to-blue-400">Future, {greetingName}</span>
            </h2>
            <p className="text-slate-400 font-medium leading-relaxed opacity-90 text-xl max-w-lg">
              {userProgress?.length > 0
                ? `You're currently mastering ${userProgress.length} tracks. Consistency is the key to professional excellence.`
                : "Your professional transformation starts here. Explore curated paths or take the AI match test."}
            </p>
            <div className="flex flex-wrap gap-5 justify-center lg:justify-start pt-4">
              <Link to="/career-paths">
                <button className="bg-[#5b7cfa] hover:bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">
                  Browse Paths ↗
                </button>
              </Link>
              <Link to="/career-match">
                <button className="px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/10 hover:bg-white/5 transition-all text-white backdrop-blur-sm">
                  Retake AI Test
                </button>
              </Link>
            </div>
          </div>
          
          <div className="w-full lg:w-80 aspect-square bg-gradient-to-br from-white/5 to-transparent rounded-[3.5rem] border border-white/10 flex items-center justify-center relative group-hover:rotate-3 transition-transform duration-1000">
             <div className="absolute inset-0 bg-[#5b7cfa]/20 blur-[80px] rounded-full opacity-50"></div>
             <div className="text-9xl group-hover:scale-110 transition-transform duration-700 select-none">🚀</div>
          </div>
        </div>
      </div>

      {/* Modernized Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="premium-card p-12 bg-white border-slate-100/50 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <p className="text-5xl font-black text-slate-900 mb-2">
                {userProgress?.length || 0}
              </p>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                Active Learning Tracks
              </p>
            </div>
            <div className="w-16 h-16 bg-blue-50 text-[#5b7cfa] rounded-2xl flex items-center justify-center text-3xl shadow-inner rotate-3 group-hover:rotate-12 transition-transform">
              📚
            </div>
          </div>
        </div>
        
        <div className="premium-card p-12 bg-white border-slate-100/50 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <p className="text-5xl font-black text-[#5b7cfa] mb-2">
                {mySkills?.length || 0}
              </p>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                Verified Proficiencies
              </p>
            </div>
            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center text-3xl shadow-inner -rotate-3 group-hover:rotate-0 transition-transform">
              ⚡
            </div>
          </div>
        </div>
      </div>

      {/* Action Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black text-slate-900 italic">Quick Access</h3>
                <span className="w-2 h-2 bg-[#5b7cfa] rounded-full animate-ping"></span>
             </div>
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {[
                  { icon: "📄", label: "My CV", link: "/profile/cv" },
                  { icon: "💼", label: "Jobs", link: "/jobs" },
                  { icon: "🔖", label: "Library", link: "/saved" },
                  { icon: "⚙️", label: "Settings", link: "/profile" }
                ].map((item, idx) => (
                  <Link key={idx} to={item.link} className="flex flex-col items-center gap-4 group p-6 rounded-[2rem] hover:bg-slate-50 transition-all">
                    <span className="text-3xl group-hover:scale-125 transition-transform">{item.icon}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900">{item.label}</span>
                  </Link>
                ))}
             </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#5b7cfa] to-blue-700 rounded-[3.5rem] p-10 text-white flex flex-col justify-center relative overflow-hidden shadow-2xl shadow-blue-200">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
           <h4 className="text-2xl font-black mb-4 italic leading-tight">Master New <br/>Horizons</h4>
           <p className="text-blue-100/80 text-xs font-medium mb-8 leading-relaxed">Continue your journey with the latest industry-standard courses.</p>
           <Link to="/courses">
              <button className="bg-white text-[#5b7cfa] w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition-all active:scale-95">
                Explore Courses
              </button>
           </Link>
        </div>
      </div>

      {/* Profile Reminder or Analysis State */}
      {(isProfileIncomplete || (!recommendations.length)) && (
        <div className="bg-white p-10 rounded-[3.5rem] border border-amber-100 flex flex-col md:flex-row justify-between items-center gap-8 shadow-xl shadow-amber-500/5">
          <div className="flex items-center gap-6 text-center md:text-left">
            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center text-3xl">🏗️</div>
            <div>
              <h3 className="font-black text-slate-900 text-lg italic">
                {(!recommendations.length) ? "Profile Under Analysis" : "Complete Your Foundation"}
              </h3>
              <p className="text-slate-400 text-xs font-medium mt-1">
                {(!recommendations.length) 
                  ? "Our AI is currently analyzing your background. Add more details to unlock tailored career matching." 
                  : "Provide more details to unlock tailored career matching."}
              </p>
            </div>
          </div>
          <Link to="/profile">
            <button className="bg-amber-500 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-amber-200">
              Update Profile
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardScreen;
