import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const steps = [
  { path: "/dashboard", name: "Dashboard", nextPath: "/career-match", nextName: "Find Your Match", icon: "🎯", color: "bg-orange-500" },
  { path: "/career-match", name: "Career Match", nextPath: "/career-paths", nextName: "Explore Paths", icon: "🛤️", color: "bg-primary" },
  { path: "/career-paths", name: "Career Paths", nextPath: "/courses", nextName: "Start Learning", icon: "📚", color: "bg-emerald-500" },
  { path: "/courses", name: "Courses", nextPath: "/jobs", nextName: "Find Jobs", icon: "💼", color: "bg-blue-500" },
  { path: "/jobs", name: "Jobs", nextPath: "/cv-manager", nextName: "Optimize CV", icon: "📄", color: "bg-purple-500" },
  { path: "/cv-manager", name: "CV Manager", nextPath: "/profile", nextName: "View Profile", icon: "👤", color: "bg-slate-900" },
  { path: "/profile", name: "Profile", nextPath: "/dashboard", nextName: "Back to Home", icon: "📊", color: "bg-primary" },
];

const UserFlowFooter = ({ currentPath }) => {
  const navigate = useNavigate();
  const step = steps.find(s => currentPath.startsWith(s.path));

  if (!step) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="mt-12 pt-8 border-t border-slate-100 flex flex-col items-center gap-6"
    >
      <div className="flex flex-col items-center text-center space-y-2">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Next Mission</p>
        <h3 className="text-2xl font-black text-slate-950 italic uppercase tracking-tighter">Your Journey Continues</h3>
      </div>

      <button 
        onClick={() => navigate(step.nextPath)}
        className="group relative flex items-center gap-6 p-6 md:p-8 bg-white border border-slate-100 rounded-[3rem] shadow-glass hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 w-full max-w-2xl"
      >
        <div className={`w-16 h-16 ${step.color} rounded-[1.5rem] flex items-center justify-center text-2xl text-white shadow-lg transition-transform group-hover:rotate-6`}>
          {step.icon}
        </div>
        
        <div className="flex-1 text-left">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Step {steps.indexOf(step) + 2 > steps.length ? 1 : steps.indexOf(step) + 2} of {steps.length}</p>
          <h4 className="text-xl font-black text-slate-900 italic uppercase leading-none">{step.nextName}</h4>
        </div>

        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
          <span className="text-xl">→</span>
        </div>
      </button>

      <p className="text-[9px] font-medium text-slate-300 italic">Progressing through the Pathfinder Trajectory Protocol</p>
    </motion.div>
  );
};

export default UserFlowFooter;
