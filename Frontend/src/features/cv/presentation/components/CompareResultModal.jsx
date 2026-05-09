// src/features/cv/presentation/components/CompareResultModal.jsx
import React from "react";

const CompareResultModal = ({ isOpen, result, onClose }) => {
  if (!isOpen || !result) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden border border-white flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              AI Comparison Report ⚖️
            </h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#5b7cfa] mt-1">
              Analyzing differences between resumes
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm transition-all hover:rotate-90"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-10 overflow-y-auto custom-scrollbar flex-1 bg-white">
          <div className="prose prose-blue max-w-none">
            {/* 💡 التفكير الهندسي: معالجة البيانات القادمة من الـ AI سواء كانت نصاً أو كائناً */}
            {typeof result === "string" ? (
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed font-medium">
                {result}
              </div>
            ) : (
              <div className="space-y-8">
                {result.overallMatch && (
                  <div className="bg-blue-50/50 p-8 rounded-[2rem] border border-blue-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black text-blue-900 mb-1">Overall Compatibility</h3>
                      <p className="text-sm text-blue-700 font-medium">Comparison between selected profiles</p>
                    </div>
                    <div className="text-4xl font-black text-[#5b7cfa]">
                      {result.overallMatch}%
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {result.strengths && (
                    <div className="bg-emerald-50/30 p-8 rounded-[2rem] border border-emerald-100">
                      <h4 className="font-black text-emerald-900 mb-4 flex items-center gap-2">
                        <span>✅</span> Key Strengths
                      </h4>
                      <ul className="space-y-3">
                        {Array.isArray(result.strengths) ? result.strengths.map((s, i) => (
                          <li key={i} className="text-sm font-bold text-emerald-800 flex gap-2">
                            <span className="opacity-40">•</span> {s}
                          </li>
                        )) : <p className="text-sm text-emerald-800">{result.strengths}</p>}
                      </ul>
                    </div>
                  )}

                  {result.weaknesses && (
                    <div className="bg-amber-50/30 p-8 rounded-[2rem] border border-amber-100">
                      <h4 className="font-black text-amber-900 mb-4 flex items-center gap-2">
                        <span>⚠️</span> Areas for Improvement
                      </h4>
                      <ul className="space-y-3">
                        {Array.isArray(result.weaknesses) ? result.weaknesses.map((w, i) => (
                          <li key={i} className="text-sm font-bold text-amber-800 flex gap-2">
                            <span className="opacity-40">•</span> {w}
                          </li>
                        )) : <p className="text-sm text-amber-800">{result.weaknesses}</p>}
                      </ul>
                    </div>
                  )}
                </div>

                {result.recommendations && (
                  <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                    <h4 className="font-black text-slate-900 mb-4">💡 AI Recommendations</h4>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      {result.recommendations}
                    </p>
                  </div>
                )}

                {/* fallback for raw json */}
                {!result.overallMatch && !result.strengths && (
                  <pre className="p-6 bg-slate-900 text-slate-200 rounded-3xl overflow-x-auto text-xs leading-relaxed">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-50 flex justify-center bg-slate-50/30">
          <button
            onClick={onClose}
            className="bg-gray-900 text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareResultModal;
