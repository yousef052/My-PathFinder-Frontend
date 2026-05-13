import React, { useState } from "react";
import { useSkills } from "../../hooks/useSkills";

const SkillsSection = () => {
  const { mySkills, globalSkills, isLoading, handleAddMySkill, handleRemoveMySkill, isSubmitting } =
    useSkills();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");

  const handleManualAdd = async (e) => {
    e.preventDefault();
    const trimmedName = newSkillName.trim();
    if (!trimmedName) return;

    const normalize = (str) => (str || "").replace(/\s+/g, "").toLowerCase();

    const matchedSkill = globalSkills.find(
      (s) => normalize(s.name || s.skillName) === normalize(trimmedName),
    );

    if (!matchedSkill) {
      alert(
        "This skill was not found in our database. Please try a standard name like 'React' or 'SQL'.",
      );
      return;
    }

    const success = await handleAddMySkill({
      skillId: matchedSkill.id || matchedSkill.skillId,
      skillName: matchedSkill.name || matchedSkill.skillName,
      proficiencyLevel: "Beginner",
      source: "Manual Search",
    });

    if (success) {
      setNewSkillName("");
      setShowAddForm(false);
    }
  };

  return (
    <div className="glass-card p-10 rounded-[3rem] border border-white/50 shadow-glass">
      <div className="flex justify-between items-center mb-10 px-2">
        <h3 className="font-black text-slate-900 text-2xl italic tracking-tight flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl shadow-inner">🎯</div>
          Skills Matrix
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`w-12 h-12 rounded-2xl font-black text-2xl transition-all shadow-sm flex items-center justify-center ${
            showAddForm 
              ? "bg-red-50 text-red-500 hover:bg-red-100 rotate-45" 
              : "bg-primary/5 text-primary hover:bg-primary hover:text-white"
          }`}
        >
          +
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleManualAdd}
          className="mb-10 space-y-4 animate-fade-in"
        >
          <div className="relative group">
            <input
              type="text"
              placeholder="Search skill (e.g. React)..."
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              className="w-full p-6 bg-slate-50/50 backdrop-blur-sm rounded-2xl border border-slate-100 outline-none font-bold text-sm shadow-inner focus:bg-white focus:border-primary transition-all"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-5 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? "Sychronizing..." : "Identify & Add Skill"}
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="flex flex-wrap gap-4 animate-pulse">
          <div className="h-12 bg-slate-100 rounded-2xl w-24"></div>
          <div className="h-12 bg-slate-100 rounded-2xl w-32"></div>
          <div className="h-12 bg-slate-100 rounded-2xl w-20"></div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {mySkills?.length > 0 ? (
            mySkills.map((skill, idx) => (
              <div
                key={skill.userSkillId || skill.id || idx}
                className="group relative bg-white/40 backdrop-blur-md hover:bg-white text-slate-700 px-6 py-4 rounded-2xl text-[10px] font-black border border-slate-100 transition-all uppercase tracking-[0.15em] flex items-center gap-3 shadow-sm hover:shadow-xl hover:-translate-y-1"
              >
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {skill.skillName || skill.name}
                <button
                  type="button"
                  onClick={() => handleRemoveMySkill(skill.userSkillId || skill.id)}
                  className="w-6 h-6 rounded-lg bg-red-50 text-red-400 flex items-center justify-center text-[8px] hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            <div className="w-full py-16 text-center bg-slate-50/30 rounded-[3rem] border-2 border-dashed border-slate-100">
              <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.4em]">
                No verified skills in cluster
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillsSection;
