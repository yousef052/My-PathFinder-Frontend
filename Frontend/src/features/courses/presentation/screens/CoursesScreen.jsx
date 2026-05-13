// src/features/courses/presentation/screens/CoursesScreen.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCourses } from "../../hooks/useCourses";
import { useCourseProgress } from "../../hooks/useCourseProgress";
import CourseCard from "../components/CourseCard";
import AddCourseModal from "./AddCourseModal";
import { useAuth } from "../../../../core/context/AuthContext";
import Button from "../../../../core/ui_components/Button";
import Input from "../../../../core/ui_components/Input";

const CoursesScreen = () => {
  const { courses, isLoading: isCoursesLoading, fetchCourses, enrollInCourse, addCourse } = useCourses();
  const { userProgress, isLoading: isProgressLoading, fetchMyProgress, updateCourseProgress, dropCourse } = useCourseProgress();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty('--theme-color', '#10b981');
    document.documentElement.style.setProperty('--bg-orb-1', '#10b981');
    document.documentElement.style.setProperty('--bg-orb-2', '#34d399');
    document.documentElement.style.setProperty('--bg-orb-3', '#064e3b');
    document.documentElement.style.setProperty('--bg-gradient-start', '#064e3b');
    document.documentElement.style.setProperty('--bg-gradient-end', '#022c22');
  }, []);

  useEffect(() => {
    fetchCourses();
    fetchMyProgress();
  }, [fetchCourses, fetchMyProgress]);

  const handleEnrollment = async (courseId) => {
    const success = await enrollInCourse(courseId);
    if (success) await fetchMyProgress();
    return success;
  };

  return (
    <div className="space-y-10 pb-16 animate-fade-in">
      
      {/* ── Tabs & Search ── */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex bg-emerald-50/50 backdrop-blur-md p-1.5 rounded-2xl border border-emerald-100 shadow-sm">
          <button onClick={() => setActiveTab("all")} className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === "all" ? "bg-emerald-500 text-white shadow-md" : "text-emerald-600/40 hover:text-emerald-600"}`}>Catalog</button>
          <button onClick={() => setActiveTab("learning")} className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === "learning" ? "bg-emerald-500 text-white shadow-md" : "text-emerald-600/40 hover:text-emerald-600"}`}>My Journey</button>
        </div>
        
        <div className="flex-1 max-w-lg w-full">
           <Input placeholder="Search Academy..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} icon="🔍" />
        </div>

        {isAdmin && <Button onClick={() => setIsAddModalOpen(true)} variant="primary">Add Course</Button>}
      </div>

      {/* ── Content Grid ── */}
      <div className="grid grid-main !px-0">
        {activeTab === "all" ? (
          <>
            {isCoursesLoading ? (
              [...Array(4)].map((_, i) => <div key={i} className="col-span-4 lg:col-span-3 h-64 bg-white rounded-[2rem] animate-pulse" />)
            ) : (
              courses.map((course) => (
                <div key={course.id} className="col-span-4 lg:col-span-3 animate-fade-in-up">
                  <CourseCard course={course} onEnroll={handleEnrollment} />
                </div>
              ))
            )}
          </>
        ) : (
          <>
            {isProgressLoading ? (
               [...Array(3)].map((_, i) => <div key={i} className="col-span-4 lg:col-span-4 h-64 bg-white rounded-[2rem] animate-pulse" />)
            ) : userProgress.length === 0 ? (
               <div className="col-span-14 py-16 text-center glass-card rounded-[2.5rem] border-dashed border-slate-200">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">No active nodes detected. Start a course to begin tracking.</p>
               </div>
            ) : (
              userProgress.map((prog) => (
                <div key={prog.id} className="col-span-4 lg:col-span-4 p-6 bg-white border border-slate-100 rounded-[2rem] shadow-glass hover:-translate-y-1 transition-all animate-fade-in-up">
                   <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl">📚</div>
                      <button onClick={() => dropCourse(prog.id)} className="text-slate-300 hover:text-red-500 transition-colors">✕</button>
                   </div>
                   <h3 className="text-base font-black text-slate-900 leading-tight mb-3">{prog.courseName}</h3>
                   <div className="space-y-3">
                      <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                         <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${(prog.completedLessons/prog.totalLessons)*100}%` }} />
                      </div>
                      <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-400">
                         <span>{prog.completedLessons}/{prog.totalLessons} Lessons</span>
                         <span className="text-primary">{Math.round((prog.completedLessons/prog.totalLessons)*100)}%</span>
                      </div>
                   </div>
                </div>
              ))
            )}
          </>
        )}
      </div>

      <AddCourseModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={addCourse} isLoading={isCoursesLoading} />
    </div>
  );
};

export default CoursesScreen;
