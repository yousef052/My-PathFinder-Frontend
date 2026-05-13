// src/features/careerPath/presentation/screens/MyCareerPathsScreen.jsx
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserCareerPath } from "../../hooks/useUserCareerPath";
import { useProfile } from "../../../profile/hooks/useProfile";
import Button from "../../../../core/ui_components/Button";

const MyCareerPathsScreen = () => {
  const { myPaths, recommendedPaths, isLoading, fetchMyPaths, fetchRecommendedPaths, enrollInPath, unenrollFromPath } = useUserCareerPath();
  const { user, isLoading: isProfileLoading } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyPaths();
  }, [fetchMyPaths]);

  useEffect(() => {
    if (!isProfileLoading && (user?.targetJobTitle || user?.jobTitle)) fetchRecommendedPaths();
  }, [fetchRecommendedPaths, isProfileLoading, user]);

  return (
    <div className="space-y-16 pb-24 animate-fade-in">
      
      {/* ── AI Picks (Full Width Section but using grid) ── */}
      {(recommendedPaths.length > 0 || isLoading) && (
        <div className="space-y-10">
          <div className="flex items-center gap-3">
             <div className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
             <h2 className="text-3xl font-black italic text-slate-900">AI Synced Recommendations</h2>
          </div>

          <div className="grid grid-main !px-0">
             {isLoading && recommendedPaths.length === 0 ? (
                [...Array(3)].map((_, i) => <div key={i} className="col-span-4 lg:col-span-4 h-80 bg-white rounded-[3rem] animate-pulse" />)
             ) : (
                 recommendedPaths.map(path => (
                    <div key={path.id} className="col-span-4 lg:col-span-4 p-8 bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-glass relative overflow-hidden group transition-all hover:shadow-2xl">
                       <div className="relative z-10 space-y-6">
                          <div className="flex justify-between items-start">
                             <span className="px-3 py-1 themed-bg themed-text text-[8px] font-black uppercase tracking-widest rounded-lg">98% Fit</span>
                             <span className="text-2xl opacity-30 group-hover:opacity-100 group-hover:rotate-12 transition-all">🎯</span>
                          </div>
                          <h3 className="text-lg font-black italic text-slate-950 leading-tight">{path.careerPathName}</h3>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{path.description}</p>
                          <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                             <button onClick={() => navigate(`/career-paths/${path.id}`)} className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:themed-text transition-colors">Inspect Details</button>
                             <button onClick={() => enrollInPath(path.id)} className="themed-button px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all">Enroll Now</button>
                          </div>
                       </div>
                    </div>
                 ))
             )}
          </div>
        </div>
      )}

      {/* ── Active Tracks ── */}
      <div className="space-y-10">
        <div className="flex justify-between items-center">
           <h2 className="text-2xl font-black italic text-slate-900">Active Tracks</h2>
           <Button variant="secondary" onClick={() => navigate("/career-paths")}>Explore Marketplace</Button>
        </div>

        <div className="grid grid-main !px-0">
           {myPaths.length === 0 && !isLoading ? (
              <div className="col-span-14 py-32 text-center glass-card rounded-[3.5rem] border-dashed border-2 border-slate-100 flex flex-col items-center gap-6">
                 <div className="text-6xl grayscale opacity-20">🛤️</div>
                 <h3 className="text-xl font-black italic text-slate-900">No active journeys detected.</h3>
                 <div className="flex gap-4">
                    <Button onClick={() => navigate("/career-match")}>Start AI Assessment</Button>
                 </div>
              </div>
           ) : (
              myPaths.map(userPath => (
                 <div key={userPath.id} className="col-span-4 lg:col-span-7 flex flex-col md:flex-row gap-8 p-10 bg-white border border-slate-100 rounded-[3rem] shadow-glass hover:shadow-xl transition-all group">
                    <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-4xl shrink-0 group-hover:scale-105 transition-transform shadow-inner">🛤️</div>
                    <div className="flex-1 min-w-0 space-y-4">
                       <div className="flex justify-between items-start">
                          <h3 className="text-xl font-black italic text-slate-900 group-hover:text-primary transition-colors truncate">{userPath.careerPath?.careerPathName}</h3>
                          <span className="px-3 py-1 bg-blue-50 text-[8px] font-black uppercase tracking-widest text-primary rounded-lg">{userPath.status}</span>
                       </div>
                       <p className="text-sm text-slate-400 line-clamp-2">{userPath.careerPath?.description}</p>
                       <div className="pt-4 flex items-center gap-6">
                          <button onClick={() => navigate(`/career-paths/${userPath.careerPathId}`)} className="flex-1 bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all">Continue Mission ↗</button>
                          <button onClick={() => unenrollFromPath(userPath.id)} className="text-[9px] font-black uppercase tracking-widest text-slate-300 hover:text-red-500">Unenroll</button>
                       </div>
                    </div>
                 </div>
              ))
           )}
        </div>
      </div>
    </div>
  );
};

export default MyCareerPathsScreen;
