// src/features/profile/presentation/components/SkillsSection.jsx
import React, { useState } from "react";
import { useSkills } from "../../hooks/useSkills";
import Button from "../../../../core/ui_components/Button";

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
    <div className="bg-white p-8 rounded-[2.5rem] border border-white shadow-xl shadow-blue-50/30">
      <div className="flex justify-between items-center mb-8 px-2">
        <h3 className="font-black text-gray-900 text-xl italic tracking-tight">
          🎯 Skills
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`w-10 h-10 rounded-full font-black text-xl transition-all shadow-sm z-10 ${showAddForm ? "bg-red-50 text-red-400 rotate-45" : "bg-blue-50 text-[#5b7cfa]"}`}
        >
          {showAddForm ? "✕" : "+"}
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleManualAdd}
          className="mb-8 space-y-3 animate-fade-in relative z-20"
        >
          <input
            type="text"
            placeholder="Type skill name (e.g. JavaScript)..."
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-sm shadow-inner focus:bg-white transition-all"
            autoFocus
          />
          <Button
            isLoading={isSubmitting}
            fullWidth
            className="py-3 text-[10px] rounded-2xl shadow-blue-100"
          >
            Confirm & Save
          </Button>
        </form>
      )}

      {isLoading ? (
        <div className="flex gap-2 animate-pulse flex-wrap">
          <div className="h-10 bg-slate-100 rounded-xl w-24"></div>
          <div className="h-10 bg-slate-100 rounded-xl w-32"></div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {mySkills?.length > 0 ? (
            mySkills.map((skill, idx) => (
              <div
                key={skill.userSkillId || skill.id || idx}
                className="group/tag relative bg-slate-50 hover:bg-[#5b7cfa]/5 text-gray-700 px-5 py-2.5 rounded-2xl text-xs font-black border border-gray-100 transition-all uppercase tracking-widest flex items-center gap-2"
              >
                {skill.skillName || skill.name}
                <button
                  type="button"
                  onClick={() => handleRemoveMySkill(skill.userSkillId || skill.id)}
                  className="w-4 h-4 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[8px] hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover/tag:opacity-100"
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-[10px] font-bold uppercase p-2">
              No skills yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillsSection;
