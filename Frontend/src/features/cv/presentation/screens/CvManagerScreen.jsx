// src/features/cv/presentation/screens/CvManagerScreen.jsx
import React, { useRef, useState } from "react";
import { useCvManager } from "../../hooks/useCvManager";
import Button from "../../../../core/ui_components/Button";
import GenerateResumeModal from "../components/GenerateResumeModal";
import CompareResultModal from "../components/CompareResultModal";

const CvManagerScreen = () => {
  const {
    cvList,
    file,
    isDragging,
    isLoading,
    statusMsg,
    selectedCvsForCompare,
    isComparing,
    compareResult,
    onDragOver,
    onDragLeave,
    onDrop,
    onFileChange,
    handleUpload,
    handleDelete,
    handleSetPrimary,
    setFile,
    toggleCvSelection,
    handleCompare,
    closeCompareResult,
  } = useCvManager();
  const fileInputRef = useRef(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in pb-20 relative">
      <GenerateResumeModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
      />

      <CompareResultModal
        isOpen={!!compareResult}
        result={compareResult}
        onClose={closeCompareResult}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#5b7cfa] to-[#3652d9] p-12 rounded-[3.5rem] text-white shadow-2xl shadow-blue-200 flex flex-col md:flex-row justify-between items-center gap-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative z-10 text-center md:text-left">
          <h2 className="text-4xl font-black mb-4 tracking-tight">
            AI Resume Studio ✨
          </h2>
          <p className="text-blue-100 font-medium max-w-md leading-relaxed">
            Let our intelligent engine transform your profile into a world-class
            professional resume or compare your existing documents.
          </p>
        </div>
        <button
          onClick={() => setIsGenerateModalOpen(true)}
          className="relative z-10 bg-white text-[#5b7cfa] px-12 py-5 rounded-[2rem] font-black text-sm hover:scale-105 transition-all shadow-xl active:scale-95 uppercase tracking-widest"
        >
          Build With AI
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Upload Area */}
        <div className="lg:col-span-5 bg-white p-10 rounded-[3rem] shadow-sm border border-white flex flex-col h-fit">
          <h2 className="text-xl font-black text-gray-900 mb-6">
            Drop Your Resume
          </h2>
          <div
            className={`relative border-4 border-dashed rounded-[2.5rem] p-12 text-center transition-all duration-500 ${isDragging ? "border-[#5b7cfa] bg-blue-50/50 scale-[1.02]" : "border-slate-50 bg-slate-50/30 hover:border-blue-100"}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <input
              type="file"
              accept=".pdf"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={onFileChange}
              ref={fileInputRef}
              disabled={isLoading}
            />
            <div className="space-y-4 pointer-events-none">
              <div className="w-20 h-20 bg-white text-[#5b7cfa] rounded-3xl flex items-center justify-center mx-auto text-4xl shadow-xl shadow-blue-50 transition-transform group-hover:rotate-12">
                📤
              </div>
              <p className="text-lg font-black text-gray-700">PDF Files Only</p>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">
                Max Size 10MB
              </p>
            </div>
          </div>
          {file && (
            <div className="mt-8 p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex items-center justify-between animate-fade-in">
              <p className="text-sm font-black text-gray-800 truncate pr-4">
                📄 {file.name}
              </p>
              <Button
                onClick={handleUpload}
                isLoading={isLoading}
                className="px-8 py-3 text-[10px] rounded-2xl"
              >
                Upload
              </Button>
            </div>
          )}
        </div>

        {/* CV List */}
        <div className="lg:col-span-7 bg-white p-10 rounded-[3rem] shadow-sm border border-white">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-black text-gray-900">
              Document Vault{" "}
              <span className="ml-2 text-xs bg-slate-50 text-gray-400 px-3 py-1 rounded-full">
                {cvList.length}
              </span>
            </h2>
            {selectedCvsForCompare.length === 2 && (
              <Button
                onClick={handleCompare}
                isLoading={isComparing}
                className="shadow-blue-200 text-[10px] px-8"
              >
                ⚖️ Run Comparison
              </Button>
            )}
          </div>
          <div className="space-y-5">
            {cvList.map((cv) => {
              const isSelected = selectedCvsForCompare.includes(
                cv.id || cv.cvId,
              );
              return (
                <div
                  key={cv.id || cv.cvId}
                  className={`flex items-center justify-between p-6 rounded-3xl border transition-all duration-300 ${isSelected ? "border-[#5b7cfa] bg-blue-50/30 shadow-lg scale-[1.02]" : "border-slate-50 bg-slate-50/20 hover:bg-white hover:shadow-xl"}`}
                >
                  <div className="flex items-center gap-5">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleCvSelection(cv.id || cv.cvId)}
                      className="w-6 h-6 text-[#5b7cfa] rounded-lg accent-[#5b7cfa] cursor-pointer"
                    />
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform ${cv.isPrimary ? "bg-[#5b7cfa] text-white shadow-lg rotate-6" : "bg-white text-gray-300 border border-gray-100"}`}
                    >
                      {cv.isPrimary ? "⭐" : "📄"}
                    </div>
                    <div>
                      <p className="font-black text-gray-800 text-sm">
                        {cv.fileName || "Resume"}
                      </p>
                      {cv.isPrimary && (
                        <span className="text-[8px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-md font-black uppercase tracking-tighter">
                          Primary Selection
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!cv.isPrimary && (
                      <button
                        onClick={() => handleSetPrimary(cv.id || cv.cvId)}
                        className="p-3 text-[10px] font-black text-[#5b7cfa] hover:bg-blue-50 rounded-xl transition-all"
                      >
                        Set Primary
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(cv.id || cv.cvId)}
                      className="p-3 text-gray-300 hover:text-red-500 bg-white shadow-sm border border-gray-50 rounded-xl transition-all"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CvManagerScreen;
