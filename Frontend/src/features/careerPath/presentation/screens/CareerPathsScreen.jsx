// src/features/careerPath/presentation/screens/CareerPathsScreen.jsx
import React, { useEffect, useState } from "react";
import { useCareerPath } from "../../hooks/useCareerPath";
import { useUserCareerPath } from "../../hooks/useUserCareerPath";
import CareerPathModal from "./CareerPathModal";
import ManageCoursesModal from "./ManageCoursesModal";
import { useAuth } from "../../../../core/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../../../../core/ui_components/Button";

const CareerPathsScreen = () => {
  const { careerPaths, isLoading, fetchCareerPaths, addCareerPath, deleteCareerPath } = useCareerPath();
  const { enrollInPath, myPaths, fetchMyPaths } = useUserCareerPath();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [selectedPath, setSelectedPath] = useState({ id: null, name: "" });
  const [isEnrollingId, setIsEnrollingId] = useState(null);

  useEffect(() => {
    fetchCareerPaths();
    fetchMyPaths();
  }, [fetchCareerPaths, fetchMyPaths]);

  const handleEnroll = async (pathId) => {
    setIsEnrollingId(pathId);
    await enrollInPath(pathId);
    setIsEnrollingId(null);
  };

  return (
    <div className="space-y-16 pb-24 animate-fade-in">
      
      {/* ── Premium Strategic Hero ── */}
      <div className="p-16 lg:p-24 bg-slate-950 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -mr-48 -mt-48 transition-all duration-1000 group-hover:bg-primary/20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -ml-24 -mb-24" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left space-y-6 max-w-2xl">
             <div className="inline-flex rounded-full bg-primary/20 border border-primary/30 px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary">Career Paths</div>
             <h2 className="text-5xl lg:text-8xl font-black italic tracking-tighter leading-[0.85]">
               Career <br />
               <span className="text-slate-400 not-italic">Paths</span>
             </h2>
             <p className="text-xl font-medium text-slate-500 leading-relaxed">Navigate the future of industry with AI-synthesized professional blueprints designed for global mastery.</p>
          </div>
          {isAdmin && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-10 py-5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:-translate-y-1 transition-all active:scale-95"
            >
              + Add Career Path
            </button>
          )}
        </div>
      </div>

      {/* ── Trajectory Grid ── */}
      <div className="grid grid-main gap-y-12">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="col-span-4 lg:col-span-7 h-96 bg-white/50 backdrop-blur-md rounded-[3.5rem] border border-white animate-pulse shadow-sm" />
          ))
        ) : careerPaths.length === 0 ? (
          <div className="col-span-14 py-32 text-center bg-white/40 backdrop-blur-xl rounded-[4rem] border border-white shadow-glass">
             <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl opacity-20">🛤️</div>
             <h3 className="text-2xl font-black text-slate-900 italic mb-3">No Blueprints Localized</h3>
             <p className="text-sm font-medium text-slate-400">Our AI is currently synthesizing new professional trajectories.</p>
          </div>
        ) : (
          careerPaths.map((path) => {
            const isEnrolled = myPaths.some(p => p.careerPathId === path.id || p.id === path.id);
            return (
              <div 
                key={path.id} 
                className="col-span-4 lg:col-span-7 p-12 bg-white/80 backdrop-blur-xl border border-white rounded-[3.5rem] shadow-glass hover:shadow-2xl transition-all duration-700 flex flex-col group animate-fade-in-up hover:-translate-y-2"
              >
                 <div className="flex justify-between items-start mb-10">
                    <div className="space-y-5">
                       <div className="flex gap-3">
                          <span className="px-4 py-2 bg-primary/5 text-[9px] font-black uppercase tracking-[0.2em] text-primary rounded-xl border border-primary/10">{path.difficultyLevel || "Elite Path"}</span>
                          <span className="px-4 py-2 bg-slate-50 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 rounded-xl border border-slate-100">{path.durationInMonths} Month Cycle</span>
                       </div>
                       <h3 className="text-3xl font-black text-slate-950 group-hover:text-primary transition-colors italic tracking-tight leading-none">{path.careerPathName}</h3>
                    </div>
                    {isAdmin && (
                       <div className="flex gap-2">
                          <button onClick={() => { setSelectedPath({ id: path.id, name: path.careerPathName }); setIsManageModalOpen(true); }} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm">📚</button>
                          <button onClick={() => deleteCareerPath(path.id)} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm">✕</button>
                       </div>
                    )}
                 </div>
                 
                 <p className="text-base font-medium text-slate-500 leading-relaxed line-clamp-3 mb-12 min-h-[4.5rem]">
                   {path.description || "A master-level curriculum synthesized by AI to navigate the complexities of this modern professional domain."}
                 </p>
                 
                 <div className="mt-auto pt-10 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl shadow-inner group-hover:rotate-12 transition-transform">🎓</div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Structure</p>
                          <p className="text-xs font-black text-slate-900">{path.estimatedCoursesCount || 12} Specialized Modules</p>
                       </div>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                       <button 
                         onClick={() => navigate(`/career-paths/${path.id}`)}
                         className="flex-1 sm:flex-none px-8 py-4 bg-slate-50 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 border border-slate-100"
                       >
                         Analyze
                       </button>
                       {!isAdmin && (
                          isEnrolled ? (
                             <button className="flex-1 sm:flex-none px-10 py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20" onClick={() => navigate("/my-career-paths")}>Synchronized ✓</button>
                          ) : (
                             <button 
                               onClick={() => handleEnroll(path.id)} 
                               disabled={isEnrollingId === path.id}
                               className="flex-1 sm:flex-none px-10 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
                             >
                               {isEnrollingId === path.id ? "Syncing..." : "Begin Evolution 🚀"}
                             </button>
                          )
                       )}
                    </div>
                 </div>
              </div>
            );
          })
        )}
      </div>

      {isAdmin && (
        <>
          <CareerPathModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={addCareerPath} isLoading={isLoading} />
          {isManageModalOpen && <ManageCoursesModal isOpen={isManageModalOpen} onClose={() => setIsManageModalOpen(false)} careerPathId={selectedPath.id} careerPathName={selectedPath.name} isAdmin={isAdmin} />}
        </>
      )}
    </div>
  );
};

export default CareerPathsScreen;
