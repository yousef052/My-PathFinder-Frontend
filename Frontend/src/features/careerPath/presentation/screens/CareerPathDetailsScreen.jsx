// src/features/careerPath/presentation/screens/CareerPathDetailsScreen.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCareerPath } from "../../hooks/useCareerPath";
import { useUserCareerPath } from "../../hooks/useUserCareerPath";
import Button from "../../../../core/ui_components/Button";

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
      // Refresh local state or navigate
    }
    setIsEnrolling(false);
  };

  if (isPathLoading || !path) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="h-16 w-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Loading Architecture...</p>
      </div>
    );
  }

  const isEnrolled = myPaths.some(p => p.careerPathId === Number(id) || p.id === Number(id));

  return (
    <div className="space-y-12 animate-fade-in-up pb-20">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-slate-950 rounded-[4rem] p-12 lg:p-20 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 -skew-x-12 translate-x-20"></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="space-y-8 max-w-2xl">
            <button 
              onClick={() => navigate(-1)}
              className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors flex items-center gap-2"
            >
              ← Back to Catalog
            </button>
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="px-4 py-1.5 bg-primary/20 text-primary-light border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {path.difficultyLevel || "All Levels"}
                </span>
                <span className="px-4 py-1.5 bg-white/5 text-slate-400 border border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {path.durationInMonths || 0} Months
                </span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-tight italic">
                {path.careerPathName || path.name}
              </h1>
            </div>
            <p className="text-slate-400 font-medium text-lg leading-relaxed">
              {path.description || "A comprehensive curriculum designed to take you from fundamentals to mastery in this specialized domain."}
            </p>
            <div className="flex flex-wrap gap-4">
              {isEnrolled ? (
                <Button className="bg-emerald-500 hover:bg-emerald-600 px-12 h-16 rounded-2xl text-sm shadow-emerald-900/20">
                  Enrolled ✓
                </Button>
              ) : (
                <Button 
                  onClick={handleEnroll} 
                  isLoading={isEnrolling}
                  className="px-12 h-16 rounded-2xl text-sm shadow-primary/20"
                >
                  Start This Journey 🚀
                </Button>
              )}
            </div>
          </div>
          
          <div className="hidden lg:flex w-64 h-64 bg-white/5 rounded-[3rem] items-center justify-center text-8xl border border-white/5 shadow-inner">
             {path.icon || "🛤️"}
          </div>
        </div>
      </div>

      {/* Modules / Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 space-y-8">
           <div className="flex items-center gap-4 px-4">
              <h2 className="text-2xl font-black text-slate-900 italic">Learning Modules</h2>
              <div className="h-px flex-1 bg-slate-100"></div>
           </div>

           <div className="space-y-6">
             {path.courses?.length > 0 ? (
               path.courses.map((course, idx) => (
                 <div key={course.id || idx} className="premium-card p-8 flex items-center gap-8 group">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl font-black text-slate-300 group-hover:bg-primary group-hover:text-white transition-all">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-black text-slate-900 mb-1 group-hover:text-primary transition-colors">
                        {course.courseName || course.name || course.title}
                      </h4>
                      <p className="text-xs text-slate-400 font-medium line-clamp-1">
                        {course.description || "Foundational concepts and practical applications."}
                      </p>
                    </div>
                    <button 
                      onClick={() => navigate(`/courses`)}
                      className="text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      View Details →
                    </button>
                 </div>
               ))
             ) : (
               <div className="bg-white p-12 rounded-[3rem] border-2 border-dashed border-slate-100 text-center">
                  <p className="text-slate-300 font-black uppercase text-[10px] tracking-[0.3em]">Curriculum details coming soon</p>
               </div>
             )}
           </div>
        </div>

        <div className="space-y-8">
           <div className="premium-card p-10 bg-primary text-white shadow-primary/20">
              <h3 className="text-xl font-black mb-6 italic">Path Benefits</h3>
              <ul className="space-y-4">
                {[
                  "Industry-aligned curriculum",
                  "Verified skill acquisition",
                  "Job placement assistance",
                  "Lifetime access to modules"
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium">
                    <span className="text-primary-light">✔</span> {benefit}
                  </li>
                ))}
              </ul>
           </div>

           <div className="premium-card p-10">
              <h3 className="text-lg font-black text-slate-900 mb-6 italic">Requirements</h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">Experience</span>
                    <span className="font-black text-slate-700">{path.difficultyLevel || "None"}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">Commitment</span>
                    <span className="font-black text-slate-700">~10 hrs / week</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CareerPathDetailsScreen;
