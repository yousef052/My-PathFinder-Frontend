// src/features/jobs/presentation/screens/MyJobApplicationsScreen.jsx

import React, { useEffect } from "react";
import { useJobApplications } from "../../hooks/useJobApplications";
import Button from "../../../../core/ui_components/Button";
import { Link } from "react-router-dom";

const MyJobApplicationsScreen = () => {
  const {
    applications,
    isLoading,
    error,
    fetchApplications,
    deleteApplication,
  } = useJobApplications();

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleWithdraw = async (id) => {
    if (
      window.confirm("هل أنت متأكد من رغبتك في سحب طلب التقديم لهذه الوظيفة؟")
    ) {
      await deleteApplication(id);
    }
  };

  // دالة لتحديد لون شارة الحالة
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "rejected":
        return "bg-red-50 text-red-600 border-red-200";
      case "reviewed":
        return "bg-blue-50 text-blue-600 border-blue-200";
      default:
        return "bg-amber-50 text-amber-600 border-amber-200"; // Pending
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-900">My Applications</h2>
          <p className="text-gray-500 font-medium text-sm mt-1">
            تابع حالة طلبات التقديم الخاصة بك وتطورات مسارك المهني.
          </p>
        </div>
        <Link to="/jobs">
          <Button className="shadow-lg shadow-primary/20">
            Explore More Jobs
          </Button>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-bold text-center">
          ⚠️ {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : applications.length === 0 && !error ? (
        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
          <span className="text-6xl mb-4 block opacity-50">📄</span>
          <h3 className="text-xl font-black text-gray-800">
            No applications found.
          </h3>
          <p className="text-sm text-gray-500 font-medium mt-2 mb-6">
            لم تقم بالتقديم على أي وظيفة بعد. ابدأ الآن خطوتك الأولى.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl border border-gray-100">
                  🏢
                </div>
                <span
                  className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusColor(app.status)}`}
                >
                  {app.status || "Pending"}
                </span>
              </div>

              <h3 className="font-black text-gray-900 text-lg line-clamp-1">
                {app.job?.jobTitle || "Job Title"}
              </h3>
              <p className="text-sm text-gray-500 font-bold mb-4">
                {app.job?.companyName || "Company Name"}
              </p>

              {app.notes && (
                <div className="bg-slate-50 p-3 rounded-xl text-xs text-gray-600 italic mb-4 border border-gray-100">
                  "{app.notes}"
                </div>
              )}

              <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400">
                  Applied on:{" "}
                  {new Date(app.createdAt || Date.now()).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleWithdraw(app.id)}
                  className="text-xs font-bold text-red-400 hover:text-red-600 transition-colors"
                >
                  Withdraw
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobApplicationsScreen;
