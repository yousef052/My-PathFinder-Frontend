// src/features/careerPath/presentation/screens/CareerPathsScreen.jsx
import React, { useEffect, useState } from "react";
import { useCareerPath } from "../../hooks/useCareerPath";
import { useProfile } from "../../../profile/hooks/useProfile";
import Button from "../../../../core/ui_components/Button";
import CareerPathModal from "./CareerPathModal";
import ManageCoursesModal from "./ManageCoursesModal";

const CareerPathsScreen = () => {
  const {
    careerPaths,
    isLoading,
    fetchCareerPaths,
    addCareerPath,
    deleteCareerPath,
  } = useCareerPath();
  const { user } = useProfile();

  // 💡 إعادة تفعيل التحقق من صلاحية المسؤول
  const isAdmin = user?.role === "Admin" || user?.Role === "Admin";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [selectedPath, setSelectedPath] = useState({ id: null, name: "" });

  useEffect(() => {
    fetchCareerPaths();
  }, [fetchCareerPaths]);

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="bg-white p-10 rounded-[3rem] border border-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Career Paths
          </h2>
          <p className="text-gray-400 font-medium text-xs mt-1 uppercase tracking-widest">
            Explore or design your professional future
          </p>
        </div>

        {/* 💡 التعديل: الزر الآن يتطلب صلاحية آدمن مرة أخرى[cite: 11] */}
        <Button
          onClick={() =>
            isAdmin
              ? setIsModalOpen(true)
              : alert("Admin access required to create paths.")
          }
          className={`px-10 shadow-lg ${!isAdmin ? "opacity-50 cursor-not-allowed grayscale" : "shadow-blue-100"}`}
        >
          + Create Path
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {careerPaths.map((path) => (
          <div
            key={path.id}
            className="bg-white p-8 rounded-[2.5rem] border border-white shadow-sm hover:shadow-xl transition-all group flex flex-col"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-2">
                <h3 className="text-xl font-black text-gray-900 leading-tight">
                  {path.careerPathName}
                </h3>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-blue-50 text-[#5b7cfa] rounded-lg font-black text-[9px] uppercase tracking-widest">
                    {path.difficultyLevel}
                  </span>
                  <span className="px-3 py-1 bg-slate-50 text-gray-500 rounded-lg font-black text-[9px] uppercase tracking-widest">
                    {path.durationInMonths} Months
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedPath({ id: path.id, name: path.careerPathName });
                    setIsManageModalOpen(true);
                  }}
                  className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all shadow-sm"
                >
                  📚
                </button>
                {isAdmin && (
                  <button
                    onClick={() => deleteCareerPath(path.id)}
                    className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
            <p className="text-gray-400 text-xs font-medium leading-relaxed line-clamp-2 mb-8">
              {path.description}
            </p>
            <div className="mt-auto flex justify-between items-center pt-6 border-t border-slate-50">
              <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                Community Contributed
              </span>
              <Button variant="outline" className="px-8 text-[9px] py-2.5">
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>

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
    </div>
  );
};

export default CareerPathsScreen;
