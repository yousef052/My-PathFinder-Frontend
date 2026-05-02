// src/features/careerPath/presentation/screens/MyCareerPathsScreen.jsx
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserCareerPath } from "../../hooks/useUserCareerPath";
import Button from "../../../../core/ui_components/Button";

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
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyPaths();
    fetchRecommendedPaths();
  }, [fetchMyPaths, fetchRecommendedPaths]);

  const getStatusBadge = (status) => {
    const baseClass =
      "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm";
    switch (status) {
      case "Completed":
        return (
          <span className={`${baseClass} bg-emerald-100 text-emerald-700`}>
            Completed
          </span>
        );
      case "InProgress":
        return (
          <span className={`${baseClass} bg-blue-100 text-blue-700`}>
            In Progress
          </span>
        );
      default:
        return (
          <span className={`${baseClass} bg-slate-100 text-gray-500`}>
            Not Started
          </span>
        );
    }
  };

  return (
    <div className="space-y-12 animate-fade-in pb-10">
      {recommendedPaths.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl border border-gray-50">
              ✨
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              AI Recommended For You
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendedPaths.map((path) => (
              <div
                key={path.id}
                className="bg-gradient-to-br from-[#5b7cfa] to-[#3652d9] p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-100 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-700"></div>
                <h3 className="text-xl font-black mb-3 relative z-10">
                  {path.title || path.name}
                </h3>
                <p className="text-blue-100 text-xs font-medium mb-8 line-clamp-2 relative z-10 leading-relaxed">
                  {path.description}
                </p>
                <div className="flex justify-between items-center relative z-10">
                  <span className="text-[10px] font-black bg-white/20 px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/10 uppercase tracking-tighter">
                    AI Analysis: 98% Match
                  </span>
                  <button
                    onClick={() => enrollInPath(path.id)}
                    className="bg-white text-primary px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-lg active:scale-95"
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white p-10 rounded-[3rem] border border-white shadow-sm space-y-10">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Active Learning Paths
          </h2>
          <Button
            onClick={() => navigate("/career-paths")}
            variant="outline"
            className="text-[10px] px-8"
          >
            Explore Catalog
          </Button>
        </div>

        {myPaths.length === 0 ? (
          <div className="text-center py-24 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
            <span className="text-6xl block mb-6 opacity-20">🛤️</span>
            <h3 className="text-xl font-black text-gray-700">
              Your journey hasn't started yet.
            </h3>
            <Link
              to="/career-match"
              className="text-primary font-black text-xs mt-6 inline-block uppercase tracking-widest hover:underline"
            >
              Take Career Test →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {myPaths.map((userPath) => {
              const pathData = userPath.careerPath || userPath;
              return (
                <div
                  key={userPath.id || userPath.userCareerPathId}
                  className="flex gap-6 p-8 rounded-[2.5rem] border border-gray-50 bg-slate-50/20 hover:bg-white hover:shadow-xl hover:shadow-blue-50/50 transition-all group"
                >
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-gray-50 flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform duration-500">
                    {pathData.icon || "🛤️"}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-black text-gray-900 text-lg leading-tight">
                        {pathData.title || pathData.name}
                      </h3>
                      {getStatusBadge(
                        userPath.careerPathStatus || userPath.status,
                      )}
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 font-medium mb-6 leading-relaxed">
                      {pathData.description}
                    </p>
                    <div className="flex items-center gap-4 mt-auto">
                      <Button
                        onClick={() => navigate(`/career-paths/${pathData.id}`)}
                        className="py-2.5 px-8 text-[10px] shadow-lg"
                      >
                        Continue
                      </Button>
                      <button
                        onClick={() => unenrollFromPath(userPath.id)}
                        className="text-[10px] font-black text-gray-300 hover:text-red-400 uppercase tracking-widest transition-colors ml-auto"
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
