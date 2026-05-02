// src/features/jobs/presentation/screens/SavedJobsScreen.jsx
import React, { useEffect } from "react";
import { useSavedJobs } from "../../hooks/useSavedJobs";
import JobCard from "../components/JobCard";

const SavedJobsScreen = () => {
  const { savedJobs, isLoading, fetchSavedJobs } = useSavedJobs();

  useEffect(() => {
    fetchSavedJobs();
  }, [fetchSavedJobs]);

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
          <span className="text-primary text-3xl">⭐</span> Saved Opportunities
        </h2>
        <p className="text-gray-500 text-sm mt-1 font-medium">
          الفرص التي اخترت متابعتها لاحقاً.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[2.5rem] border border-gray-100">
          <span className="text-6xl block mb-4 opacity-30">🔖</span>
          <h3 className="text-xl font-bold text-gray-400">
            قائمتك فارغة حالياً.
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {savedJobs.map((item) => (
            <JobCard
              key={item.id}
              job={item.job} // نفترض أن السيرفر يرجع الوظيفة داخل كائن الحفظ
              isSaved={true}
              savedRecordId={item.id}
              onRefresh={fetchSavedJobs}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobsScreen;
