import React, { useEffect, useState } from "react";
import { useProfile } from "../../../profile/hooks/useProfile";
import { useCourseRecommendation } from "../../../courses/hooks/useCourseRecommendation";
import { useCourseProgress } from "../../../courses/hooks/useCourseProgress";
import { useSkills } from "../../../profile/hooks/useSkills";
import { Link } from "react-router-dom";

// ─── Stat Counter Component ───────────────────────────────────────────────────
const StatCounter = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);
  return <span>{count}</span>;
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const DashboardScreen = () => {
  const { user, isLoading: isProfileLoading } = useProfile();
  const { recommendations, fetchRecommendations } = useCourseRecommendation();
  const { userProgress, fetchMyProgress } = useCourseProgress();
  const { mySkills } = useSkills();

  useEffect(() => {
    if (fetchMyProgress) fetchMyProgress(); document.documentElement.style.setProperty("--theme-color", "#4763e1"); document.documentElement.style.setProperty("--bg-orb-1", "#4763e1"); document.documentElement.style.setProperty("--bg-orb-2", "var(--color-secondary)"); document.documentElement.style.setProperty("--bg-orb-3", "#1e293b"); document.documentElement.style.setProperty("--bg-gradient-start", "#0f172a"); document.documentElement.style.setProperty("--bg-gradient-end", "#020617");
  }, [fetchMyProgress]);

  useEffect(() => {
    const targetTitle = user?.targetJobTitle || user?.jobTitle || "";
    fetchRecommendations(targetTitle);
  }, [fetchRecommendations, user]);

  if (isProfileLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-6 animate-fade-in">
        <div className="h-24 w-24 animate-spin rounded-full border-[8px] border-primary border-t-transparent shadow-2xl" />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary animate-pulse">Syncing Trajectory...</p>
      </div>
    );
  }

  const greetingName = user?.firstName || user?.userName || "Explorer";

  // Journey Intelligence: Decide the next mission
  const getNextMission = () => {
    if (!mySkills || mySkills.length === 0) return { title: "Establish Identity", task: "Analyze CV to extract your skill matrix", link: "/cv-manager", icon: "📄", color: "bg-cv" };
    if (!user?.targetJobTitle) return { title: "Define Objective", task: "Take the AI Career Discovery to map your path", link: "/career-match", icon: "🎯", color: "bg-primary" };
    if (userProgress && userProgress.length > 0) return { title: "Maintain Momentum", task: "Continue your active learning tracks", link: "/courses", icon: "📚", color: "bg-success" };
    return { title: "Explore Markets", task: "Discover job opportunities for your profile", link: "/jobs", icon: "💼", color: "bg-secondary" };
  };

  const mission = getNextMission();

  return (
    <div className="space-y-16 pb-16">
      
      {/* ── Dynamic Mission Portal ── */}
      <div className="grid grid-main items-stretch gap-y-12">
        
        {/* Welcome Block (Spans 10 of 14 columns) */}
        <div className="col-span-4 lg:col-span-10 p-8 rounded-[3rem] bg-white border border-slate-100 shadow-glass relative overflow-hidden group animate-fade-in-up">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-primary/10 transition-all duration-1000" />
           <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-3">
                 <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-xl shadow-xl">👋</div>
                 <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Status: Active</p>
              </div>
              <h2 className="text-6xl md:text-8xl font-black text-slate-950 tracking-tighter leading-[0.8] uppercase italic">
                Ready for the <br />
                next <span className="text-primary not-italic">leap,</span> <br />
                <span className="text-slate-400">{greetingName}?</span>
              </h2>
              <div className="flex flex-wrap gap-4 pt-4">
                 <div className="px-6 py-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <span className="text-primary font-black"><StatCounter end={userProgress?.length || 0} /></span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Tracks Active</span>
                 </div>
                 <div className="px-6 py-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <span className="text-secondary font-black"><StatCounter end={mySkills?.length || 0} /></span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Verified Skills</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Mission Card (Spans 4 of 14 columns) */}
        <div className="col-span-4 lg:col-span-4">
          <div className="flex h-full flex-col justify-between rounded-[3rem] bg-white/70 backdrop-blur-xl p-8 border border-white/50 shadow-glass transition-all hover:scale-[1.02]">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-2xl shadow-inner">📄</div>
                 <div className="rounded-full bg-primary/10 px-4 py-1 text-[8px] font-black uppercase tracking-widest text-primary">Next Phase</div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black italic text-slate-950 leading-tight">Establish Identity</h3>
                <p className="text-xs font-medium leading-relaxed text-slate-500">Analyze CV to extract your skill matrix and professional DNA.</p>
              </div>
            </div>
            <Link to="/cv-manager" className="group mt-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              Initiate Sequence <span className="transition-transform group-hover:translate-x-2">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Action Grid ── */}
      <div className="grid grid-main items-stretch animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        {[
          { icon: "📄", label: "Profile", link: "/profile", count: mySkills?.length || 0, span: "lg:col-span-3", color: "bg-blue-50 text-blue-500" },
          { icon: "💼", label: "Jobs", link: "/jobs", count: "Global", span: "lg:col-span-4", color: "bg-emerald-50 text-emerald-500" },
          { icon: "🎓", label: "Courses", link: "/courses", count: recommendations?.length || 0, span: "lg:col-span-4", color: "bg-purple-50 text-purple-500" },
          { icon: "🎯", label: "Career Match", link: "/career-match", count: "AI", span: "lg:col-span-3", color: "bg-orange-50 text-orange-500" }
        ].map((item, idx) => (
          <Link
            key={idx}
            to={item.link}
            className={`col-span-4 ${item.span} group relative p-8 bg-white/70 backdrop-blur-xl border border-white shadow-glass hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 flex flex-col items-center text-center gap-6 rounded-[2.5rem]`}
          >
            <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
              {item.icon}
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">{item.label}</p>
              <h4 className="text-sm font-black text-slate-950 italic">{item.count} Active</h4>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Recommendation Slide ── */}
      <div className="p-16 rounded-[4rem] bg-white border border-slate-100 shadow-glass animate-fade-in-up" style={{ animationDelay: '600ms' }}>
         <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <div className="text-center md:text-left">
               <h3 className="text-3xl font-black text-slate-950 italic mb-2">Recommended Courses</h3>
               <p className="text-sm font-medium text-slate-500">Intelligent learning paths matched to your target trajectory</p>
            </div>
            <Link to="/courses" className="px-10 py-5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-transform active:scale-95">View Catalog</Link>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recommendations?.slice(0, 3).map((rec, i) => (
               <div key={i} className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-500 group">
                  <div className="mb-6 flex justify-between items-start">
                     <span className="px-3 py-1 bg-white rounded-full text-[8px] font-black uppercase tracking-widest text-slate-400">Course</span>
                     <span className="text-2xl opacity-30 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500">→</span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 leading-tight mb-4">{rec.title}</h4>
                  <div className="flex items-center gap-2">
                     <div className="h-1.5 w-1.5 bg-success rounded-full" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">High Match</span>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
