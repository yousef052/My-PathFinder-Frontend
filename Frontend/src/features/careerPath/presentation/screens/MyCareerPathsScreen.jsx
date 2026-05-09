// src/features/careerPath/presentation/screens/MyCareerPathsScreen.jsx
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserCareerPath } from "../../hooks/useUserCareerPath";
import Button from "../../../../core/ui_components/Button";
import { useProfile } from "../../../profile/hooks/useProfile";

const MyCareerPathsScreen = () => {
  const {
    myPaths,
    recommendedPaths,
    isLoading,
    error,
    fetchMyPaths,
    fetchRecommendedPaths,
    enrollInPath,
    unenrollFromPath,
  } = useUserCareerPath();
  const { user, isLoading: isProfileLoading } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyPaths();
  }, [fetchMyPaths]);

  useEffect(() => {
    const hasProfileSignal =
      user?.firstName ||
      user?.lastName ||
      user?.jobTitle ||
      user?.targetJobTitle ||
      user?.desiredJobTitle;

    if (!isProfileLoading && hasProfileSignal) {
      fetchRecommendedPaths();
    }
  }, [fetchRecommendedPaths, isProfileLoading, user]);

  const getStatusBadge = (status) => {
    const baseClass =
      "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm border";
    switch (status) {
      case "Completed":
        return (
          <span className={`${baseClass} bg-emerald-50 text-emerald-600 border-emerald-100`}>
            Completed
          </span>
        );
      case "InProgress":
        return (
          <span className={`${baseClass} bg-blue-50 text-blue-600 border-blue-100`}>
            In Progress
          </span>
        );
      default:
        return (
          <span className={`${baseClass} bg-slate-50 text-slate-400 border-slate-100`}>
            Not Started
          </span>
        );
    }
  };

  return (
    <div className="space-y-12 animate-fade-in-up pb-20">
      {/* AI Recommendations Header */}
      {(recommendedPaths.length > 0 || !isLoading) && (
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-4">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-black text-slate-950 tracking-tight italic flex items-center gap-3 justify-center md:justify-start">
                <span className="text-4xl">✨</span> Personalized Blueprints
              </h2>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">
                Strategic career paths based on your AI profile
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {recommendedPaths.length > 0 && recommendedPaths.map((path) => (
                <div
                  key={path.id}
                  className="bg-slate-950 p-10 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-700"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-1000"></div>
                  
                  <div className="flex justify-between items-start mb-6">
                    <span className="px-3 py-1.5 bg-primary/20 text-primary-light rounded-xl font-black text-[8px] uppercase tracking-widest border border-primary/10">
                      98% Match Score
                    </span>
                    <span className="text-2xl opacity-40 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-500">🎯</span>
                  </div>

                  <h3 className="text-xl font-black mb-4 relative z-10 leading-tight italic">
                    {path.careerPathName || path.name || path.title}
                  </h3>
                  <p className="text-slate-400 text-xs font-medium mb-10 line-clamp-2 relative z-10 leading-relaxed">
                    {path.description || path.careerPathDescription || "Optimized curriculum to master the required technologies for this career track."}
                  </p>
                  
                  <div className="flex justify-between items-center relative z-10 gap-4 pt-4 border-t border-white/5">
                    <button
                      onClick={() => navigate(`/career-paths/${path.id}`)}
                      className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                    >
                      Inspect Path
                    </button>
                    <button
                      onClick={() => enrollInPath(path.id)}
                      className="bg-white text-slate-950 px-8 py-3.5 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-lg active:scale-95"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Active Tracks Section */}
      <div className="bg-white p-12 lg:p-16 rounded-[4rem] border border-white shadow-sm space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl lg:text-3xl font-black text-slate-950 tracking-tight italic">
              Active Learning Tracks
            </h2>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">
              Managing your professional development
            </p>
          </div>
          <button
            onClick={() => navigate("/career-paths")}
            className="px-10 py-4 rounded-2xl border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            Explore More
          </button>
        </div>

        {myPaths.length === 0 ? (
          <div className="text-center py-32 bg-slate-50/20 rounded-[3.5rem] border-2 border-dashed border-slate-100 flex flex-col items-center">
            <span className="text-7xl block mb-8 opacity-20 grayscale">🛤️</span>
            <h3 className="text-xl font-black text-slate-700 italic">No Active Journeys</h3>
            <p className="text-slate-400 text-sm mt-3 max-w-sm mx-auto font-medium leading-relaxed">
              Unlock your professional potential by enrolling in a curated career path or taking the AI evaluation.
            </p>
            <div className="flex gap-4 mt-10">
              <Link to="/career-match" className="btn-primary px-12">Start AI Test</Link>
              <Link to="/career-paths" className="px-12 py-4 rounded-2xl border border-slate-200 font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-sm">Browse Catalog</Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {myPaths.map((userPath) => {
              const pathData = userPath.careerPath || userPath;
              const pathId = pathData.id || userPath.careerPathId;
              
              return (
                <div
                  key={userPath.id || userPath.userCareerPathId}
                  className="flex flex-col sm:flex-row gap-8 p-10 rounded-[3.5rem] border border-slate-50 bg-slate-50/30 hover:bg-white hover:shadow-2xl hover:shadow-blue-100/20 transition-all duration-700 group"
                >
                  <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-xl border border-slate-50 flex items-center justify-center text-4xl shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-blue-100/20">
                    {pathData.icon || "🛤️"}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <h3 className="font-black text-slate-900 text-xl leading-tight italic group-hover:text-primary transition-colors">
                        {pathData.careerPathName || pathData.name || pathData.title}
                      </h3>
                      {getStatusBadge(
                        userPath.careerPathStatus || userPath.status,
                      )}
                    </div>
                    <p className="text-sm text-slate-400 line-clamp-2 font-medium mb-8 leading-relaxed">
                      {pathData.description || "Continue mastering the modules in this specialized track."}
                    </p>
                    <div className="flex items-center gap-6 mt-auto">
                      <button
                        onClick={() => {
                          const finalId = pathData.id || userPath.careerPathId || userPath.id;
                          if (finalId) navigate(`/career-paths/${finalId}`);
                          else alert("Invalid Path ID");
                        }}
                        className="flex-1 bg-slate-950 text-white py-4 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-primary transition-all active:scale-95"
                      >
                        Enter Path ↗
                      </button>
                      <button
                        onClick={() => unenrollFromPath(userPath.id || userPath.userCareerPathId)}
                        className="text-[9px] font-black text-slate-300 hover:text-red-500 uppercase tracking-widest transition-all hover:scale-105"
                      >
                        Unenroll
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCareerPathsScreen;
