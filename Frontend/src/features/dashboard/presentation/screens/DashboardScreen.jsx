// src/features/dashboard/presentation/screens/DashboardScreen.jsx
import React, { useEffect } from "react";
import { useProfile } from "../../../profile/hooks/useProfile";
import { useCourseRecommendation } from "../../../courses/hooks/useCourseRecommendation";
import { useCourseProgress } from "../../../courses/hooks/useCourseProgress";
import { useSkills } from "../../../profile/hooks/useSkills";
import { Link } from "react-router-dom";
import CourseCard from "../../../courses/presentation/components/CourseCard";
import Button from "../../../../core/ui_components/Button"; //[cite: 20]

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
    fetchRecommendations();
    if (fetchMyProgress) fetchMyProgress();
  }, [fetchRecommendations, fetchMyProgress]);

  if (isProfileLoading)
    return (
      <div className="flex flex-col justify-center items-center py-40 gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
        <p className="text-primary font-black text-[10px] uppercase tracking-widest animate-pulse">
          Syncing Journey...
        </p>
      </div>
    );

  return (
    <div className="space-y-12 pb-20">
      {/* 💡 إحصائيات حقيقية قوية[cite: 20] */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-xl transition-all group">
          <p className="text-3xl font-black text-text-primary group-hover:text-primary transition-colors">
            {userProgress?.length || 0}
          </p>
          <p className="text-[10px] text-text-hint font-black uppercase tracking-widest mt-1">
            Active Courses
          </p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-xl transition-all group">
          <p className="text-3xl font-black text-primary group-hover:rotate-6 transition-transform">
            {mySkills?.length || 0}
          </p>
          <p className="text-[10px] text-text-hint font-black uppercase tracking-widest mt-1">
            Acquired Skills
          </p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-xl transition-all group">
          <p className="text-3xl font-black text-emerald-500 group-hover:scale-110 transition-transform">
            {recommendations?.length || 0}
          </p>
          <p className="text-[10px] text-text-hint font-black uppercase tracking-widest mt-1">
            AI Matches
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-[#4a6cf7] to-primary-dark rounded-[3.5rem] p-12 text-white shadow-2xl animate-float">
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Welcome back, <br className="md:hidden" />
            <span className="text-primary-50 italic">
              {user?.firstName || "Explorer"}
            </span>
            ! 👋
          </h2>
          <p className="text-primary-50 font-medium max-w-lg leading-relaxed opacity-90 text-sm">
            {userProgress?.length > 0
              ? `You are making great progress in ${userProgress.length} tracks. Ready for more?`
              : "Discover personalized paths designed to accelerate your software engineering career."}
          </p>
          <div className="pt-4">
            <Link to="/career-paths">
              <button className="bg-white text-primary px-10 py-4 rounded-2xl font-black text-xs hover:shadow-2xl hover:scale-105 transition-all active:scale-95 uppercase tracking-widest shadow-xl">
                Continue Learning
              </button>
            </Link>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-[80px] animate-pulse"></div>
      </div>

      <div className="space-y-8">
        <div className="flex justify-between items-end px-4">
          <h3 className="font-black text-text-primary text-2xl tracking-tight italic">
            Recommended For You
          </h3>
          <Link
            to="/courses"
            className="text-primary font-black text-xs uppercase tracking-widest hover:translate-x-2 transition-transform"
          >
            View Catalog →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isRecLoading ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-72 bg-gray-50 rounded-[3rem] animate-pulse"
              ></div>
            ))
          ) : recommendations?.length > 0 ? (
            recommendations.slice(0, 3).map((course) => (
              <div
                key={course.id || course.courseId}
                className="transition-all duration-500 hover:scale-[1.05] hover:-translate-y-2"
              >
                <CourseCard course={course} />
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
              <p className="text-text-hint font-black uppercase text-[10px] tracking-widest italic">
                Update your skills to unlock AI recommendations
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-text-primary p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-primary/10 translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-in-out"></div>
        <div className="relative z-10">
          <h4 className="text-2xl font-black mb-4 italic text-primary-light">
            Growth Tip 💡
          </h4>
          <p className="text-text-hint font-medium leading-relaxed mb-8 max-w-xl">
            With{" "}
            <span className="text-white font-black">
              {mySkills?.length || 0} skills
            </span>{" "}
            already verified, you are ahead of 60% of peers. Explore advanced
            backend paths to boost your score further.
          </p>
          <Link to="/profile">
            <Button
              variant="outline"
              className="border-gray-700 text-white hover:bg-white hover:text-text-primary px-10 py-4 text-[10px] uppercase font-black tracking-widest"
            >
              Improve My Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
