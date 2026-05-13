import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCareerPath } from "../../hooks/useCareerPath";
import { useUserCareerPath } from "../../hooks/useUserCareerPath";

// ─── Main Screen ──────────────────────────────────────────────────────────────
const CareerPathDetailsScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCareerPathById, isLoading: isPathLoading } = useCareerPath();
  const { enrollInPath, myPaths, fetchMyPaths } = useUserCareerPath();
  
  const [path, setPath] = useState(null);
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchCareerPathById(id);
      setPath(data);
      fetchMyPaths();
    };
    loadData();
  }, [id, fetchCareerPathById, fetchMyPaths]);

  const handleEnroll = async () => {
    setIsEnrolling(true);
    const success = await enrollInPath(id);
    if (success) {
      // Success logic
    }
    setIsEnrolling(false);
  };

  if (isPathLoading || !path) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 py-48">
        <div className="h-20 w-20 animate-spin rounded-full border-4 border-career-main/10 border-t-career-main" />
        <p className="animate-pulse text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">Synchronizing Roadmap...</p>
      </div>
    );
  }

  const isEnrolled = myPaths.some(p => p.careerPathId === Number(id) || p.id === Number(id));

  return (
    <div className="space-y-12 pb-24 max-w-7xl mx-auto px-4" style={{ animation: "pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}>
      
      {/* ── Premium Hero Roadmap ── */}
      <div className="relative overflow-hidden rounded-5xl bg-neutral-900 p-12 text-white shadow-2xl lg:p-20 group">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-career-main/20 blur-[120px] transition-all duration-1000 group-hover:bg-career-main/30" />
        <div className="absolute -left-40 -bottom-40 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
        
        <div className="relative z-10 flex flex-col items-center justify-between gap-12 lg:flex-row">
          <div className="max-w-3xl space-y-10">
            <button 
              onClick={() => navigate(-1)}
              className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 transition-all hover:text-white"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to Catalog
            </button>
            
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full bg-career-main/20 px-5 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-career-main border border-career-main/30">
                  {path.difficultyLevel || "Advanced Path"}
                </span>
                <span className="rounded-full bg-white/5 px-5 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-neutral-300 border border-white/10">
                  {path.durationInMonths || 6} Months Intensity
                </span>
              </div>
              <h1 className="text-5xl font-black italic tracking-tight lg:text-8xl leading-[0.9]">
                {path.careerPathName || path.name}
              </h1>
            </div>
            
            <p className="text-xl font-medium leading-relaxed text-neutral-400 max-w-2xl">
              {path.description || "A master-level curriculum synthesized by AI to navigate the complexities of this modern professional domain."}
            </p>
            
            <div className="flex flex-wrap gap-5 pt-6">
              {isEnrolled ? (
                <div className="flex h-16 items-center justify-center rounded-2xl bg-career-main px-12 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-career-main/20">
                  Enrolled & Active ✓
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  className="group relative inline-flex h-16 items-center justify-center overflow-hidden rounded-2xl bg-career-main px-14 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-career-main/30 transition-all hover:-translate-y-1 hover:shadow-2xl active:scale-95 disabled:opacity-50"
                >
                  <span className="relative z-10">{isEnrolling ? "Engaging AI..." : "Begin Your Evolution 🚀"}</span>
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                </button>
              )}
            </div>
          </div>
          
          <div className="hidden h-72 w-72 items-center justify-center rounded-[4rem] border border-white/10 bg-white/5 text-9xl shadow-glass lg:flex animate-float transition-transform hover:scale-110">
             {path.icon || "🛤️"}
          </div>
        </div>
      </div>

      {/* ── Learning Architecture Grid ── */}
      <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-3">
        
        {/* Module Timeline */}
        <div className="space-y-12 lg:col-span-2">
           <div className="flex items-center gap-6 px-4">
              <h2 className="text-3xl font-black text-neutral-900 italic">Core Modules</h2>
              <div className="h-px flex-1 bg-neutral-100" />
           </div>

           <div className="space-y-8 relative before:absolute before:left-12 before:top-4 before:bottom-4 before:w-1 before:bg-neutral-50">
             {path.courses?.length > 0 ? (
               path.courses.map((course, idx) => (
                 <div 
                    key={course.id || idx} 
                    className="group relative flex items-center gap-10 rounded-4xl border border-neutral-50 bg-white p-10 shadow-glass transition-all hover:-translate-y-1 hover:border-career-main/20 hover:shadow-2xl"
                    style={{ animation: `pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both ${idx * 60}ms` }}
                 >
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-neutral-50 text-2xl font-black text-neutral-300 transition-all duration-500 group-hover:bg-career-main group-hover:text-white shadow-inner group-hover:rotate-6">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="mb-2 truncate text-xl font-black text-neutral-900 transition-colors group-hover:text-career-main">
                        {course.courseName || course.name || course.title}
                      </h4>
                      <p className="truncate text-sm font-medium text-neutral-400">
                        {course.description || "Mastering foundational logic and system architecture."}
                      </p>
                    </div>
                    <button 
                      onClick={() => navigate(`/courses`)}
                      className="opacity-0 transition-all duration-300 translate-x-4 text-[10px] font-black uppercase tracking-widest text-career-main group-hover:opacity-100 group-hover:translate-x-0 bg-career-main-lightest px-4 py-2 rounded-xl"
                    >
                      Analyze →
                    </button>
                 </div>
               ))
             ) : (
               <div className="rounded-4xl border-4 border-dashed border-neutral-50 bg-neutral-50/20 py-24 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-300">Curriculum Synthesis in Progress</p>
               </div>
             )}
           </div>
        </div>

        {/* Tactical Intel Sidebar */}
        <div className="space-y-10 lg:sticky lg:top-8">
           
           <div className="rounded-4xl bg-neutral-900 p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-career-main/10 to-transparent opacity-50" />
              <h3 className="mb-8 text-xl font-black italic relative z-10">Strategic Outcomes</h3>
              <ul className="space-y-6 relative z-10">
                {[
                  "Elite Industry Alignment",
                  "Verified Competency Matrix",
                  "AI-Driven Job Matchmaking",
                  "Synchronized Portfolio Assets"
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-5 text-sm font-medium text-neutral-300 group-hover:translate-x-2 transition-transform duration-300" style={{ transitionDelay: `${i * 50}ms` }}>
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-career-main/20 text-career-main text-xs font-black">✓</span> 
                    {benefit}
                  </li>
                ))}
              </ul>
           </div>

           <div className="glass-card p-10 rounded-4xl">
              <h3 className="mb-8 text-xl font-black text-neutral-900">Path Metrics</h3>
              <div className="space-y-6">
                 <div className="flex items-center justify-between border-b border-neutral-50 pb-5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Expertise</span>
                    <span className="text-xs font-black text-neutral-700 bg-neutral-50 px-3 py-1 rounded-lg">{path.difficultyLevel || "Advanced"}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Velocity</span>
                    <span className="text-xs font-black text-neutral-700 bg-neutral-50 px-3 py-1 rounded-lg">~15 hrs / week</span>
                 </div>
              </div>
           </div>
           
        </div>
      </div>
    </div>
  );
};

export default CareerPathDetailsScreen;
