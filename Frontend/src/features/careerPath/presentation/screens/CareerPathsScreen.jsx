// src/features/careerPath/presentation/screens/CareerPathsScreen.jsx
import React, { useEffect, useState } from "react";
import { useCareerPath } from "../../hooks/useCareerPath";
import { useUserCareerPath } from "../../hooks/useUserCareerPath";
import Button from "../../../../core/ui_components/Button";
import CareerPathModal from "./CareerPathModal";
import ManageCoursesModal from "./ManageCoursesModal";
import { useAuth } from "../../../../core/context/AuthContext";
import { useNavigate } from "react-router-dom";

const CareerPathsScreen = () => {
  const {
    careerPaths,
    isLoading,
    fetchCareerPaths,
    addCareerPath,
    deleteCareerPath,
  } = useCareerPath();
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
    const success = await enrollInPath(pathId);
    if (success) {
      // toast or notification could go here
    }
    setIsEnrollingId(null);
  };

  return (
    <div className="space-y-12 animate-fade-in-up pb-20">
      {/* Header */}
      <div className="bg-white p-10 lg:p-14 rounded-[4rem] border border-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h2 className="text-3xl lg:text-4xl font-black text-slate-950 tracking-tight italic">
            Career Paths
          </h2>
          <p className="text-slate-400 font-bold text-xs mt-2 uppercase tracking-[0.3em]">
            Engineer your professional future
          </p>
        </div>

        {isAdmin && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="px-10 h-14 rounded-2xl shadow-xl shadow-blue-100 relative z-10"
          >
            + New Path
          </Button>
        )}
      </div>

      {isLoading && (
        <div className="flex h-64 items-center justify-center animate-pulse">
           <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}

      {!isLoading && careerPaths.length === 0 && (
        <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
          <span className="text-6xl block mb-6 grayscale opacity-20">🗺️</span>
          <p className="text-slate-300 font-black uppercase text-[10px] tracking-[0.4em]">
            No career paths established yet
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {careerPaths.map((path) => {
          const isEnrolled = myPaths.some(p => p.careerPathId === path.id || p.id === path.id);
          
          return (
            <div
              key={path.id}
              className="premium-card p-10 flex flex-col group h-full relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-xl font-black text-[9px] uppercase tracking-widest">
                      {path.difficultyLevel}
                    </span>
                    <span className="px-3 py-1.5 bg-slate-100 text-slate-500 rounded-xl font-black text-[9px] uppercase tracking-widest">
                      {path.durationInMonths} Months
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-primary transition-colors">
                    {path.careerPathName}
                  </h3>
                </div>

                {isAdmin && (
                  <div className="flex gap-2 relative z-20">
                    <button
                      onClick={() => {
                        setSelectedPath({ id: path.id, name: path.careerPathName });
                        setIsManageModalOpen(true);
                      }}
                      className="w-11 h-11 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm active:scale-90"
                    >
                      📚
                    </button>
                    <button
                      onClick={() => deleteCareerPath(path.id)}
                      className="w-11 h-11 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>

              <p className="text-slate-400 font-medium leading-relaxed text-sm mb-10 line-clamp-3">
                {path.description || "Start your journey towards becoming a professional with our curated curriculum."}
              </p>

              <div className="mt-auto flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 border-t border-slate-50">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-xs border border-slate-100">🎓</div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {path.estimatedCoursesCount != null
                      ? `${path.estimatedCoursesCount} Modules`
                      : "Multi-Source Path"}
                  </span>
                </div>
                
                <div className="flex gap-3 w-full sm:w-auto">
                  <button 
                    className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
                    onClick={() => {
                      const finalId = path.id || path.careerPathId || path.careerPathID;
                      if (finalId) navigate(`/career-paths/${finalId}`);
                      else alert("Invalid Path ID");
                    }}
                  >
                    View Details
                  </button>

                  {!isAdmin && (
                    <>
                      {isEnrolled ? (
                        <button 
                          className="flex-1 sm:flex-none px-8 py-3.5 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100 active:scale-95"
                          onClick={() => navigate("/my-career-paths")}
                        >
                          Enrolled ✓
                        </button>
                      ) : (
                        <button 
                          className="flex-1 sm:flex-none px-8 py-3.5 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-primary-dark transition-all active:scale-95 disabled:opacity-50"
                          onClick={() => handleEnroll(path.id)}
                          disabled={isEnrollingId === path.id}
                        >
                          {isEnrollingId === path.id ? "..." : "Enroll Now 🚀"}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isAdmin && (
        <>
          <CareerPathModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={addCareerPath}
            isLoading={isLoading}
          />
          <ManageCoursesModal
            isOpen={isManageModalOpen}
            onClose={() => setIsManageModalOpen(false)}
            careerPathId={selectedPath.id}
            careerPathName={selectedPath.name}
            isAdmin={isAdmin}
          />
        </>
      )}
    </div>
  );
};

export default CareerPathsScreen;
