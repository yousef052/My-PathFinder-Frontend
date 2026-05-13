// src/features/cv/presentation/screens/CvManagerScreen.jsx
import React, { useRef, useState } from "react";
import { useCvManager } from "../../hooks/useCvManager";
import GenerateResumeModal from "../components/GenerateResumeModal";
import CompareResultModal from "../components/CompareResultModal";

const CvManagerScreen = () => {
  const {
    cvList,
    file,
    isDragging,
    isLoading,
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
    toggleCvSelection,
    handleCompare,
    closeCompareResult,
  } = useCvManager();
  
  const fileInputRef = useRef(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  React.useEffect(() => {
    document.documentElement.style.setProperty('--theme-color', '#a855f7');
    document.documentElement.style.setProperty('--bg-orb-1', '#a855f7');
    document.documentElement.style.setProperty('--bg-orb-2', '#c084fc');
    document.documentElement.style.setProperty('--bg-orb-3', '#4c1d95');
    document.documentElement.style.setProperty('--bg-gradient-start', '#4c1d95');
    document.documentElement.style.setProperty('--bg-gradient-end', '#2e1065');
  }, []);

  return (
    <div className="space-y-12 pb-24 animate-fade-in">
      
      <GenerateResumeModal isOpen={isGenerateModalOpen} onClose={() => setIsGenerateModalOpen(false)} />
      <CompareResultModal isOpen={!!compareResult} result={compareResult} onClose={closeCompareResult} />

      {/* ── AI Studio Hero (Full Grid) ── */}
      <div className="relative overflow-hidden rounded-[3rem] bg-white/70 backdrop-blur-xl p-10 border border-white/50 shadow-glass md:p-16 group">
        <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="max-w-2xl text-center md:text-left space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-[8px] font-black uppercase tracking-widest text-primary mb-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                </span>
                AI Parsing Engine Online
             </div>
             <h1 className="text-3xl font-black italic tracking-tight text-slate-950 md:text-5xl leading-tight">
                Your Career DNA, <br />
                <span className="text-primary">Optimized for Success.</span>
             </h1>
             <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-xl">
                Upload your CV and let our high-precision AI extract your skill matrix, match you with global markets, and generate a premium resume that cuts through the noise.
             </p>
             <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
                <button onClick={() => setIsGenerateModalOpen(true)} className="bg-primary text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all">Generate AI CV</button>
                <button onClick={() => fileInputRef.current.click()} className="bg-white border border-slate-100 px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm hover:bg-slate-50 transition-all">Manual Upload</button>
             </div>
          </div>

          <div className="relative w-full max-w-sm">
             <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
             <div className="relative glass-card p-8 rounded-[2.5rem] border border-white/40 shadow-2xl space-y-6">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-xl text-white">📊</div>
                   <div>
                      <h4 className="text-sm font-black text-slate-900 italic">Market Fit</h4>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Ready for Analysis</p>
                   </div>
                </div>
                <div className="space-y-3">
                   <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div className="h-full bg-primary/30 w-3/4" />
                   </div>
                   <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div className="h-full bg-primary/30 w-1/2" />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-main items-start">
        {/* ── Sidebar (Spans 4 columns) ── */}
        <div className="col-span-4 lg:col-span-4 lg:sticky lg:top-32 space-y-8">
          <div className="glass-card p-10 rounded-[3rem] bg-purple-50/40 backdrop-blur-md border border-purple-100 shadow-glass">
            <h3 className="text-xl font-black mb-8 text-slate-900 italic">Sync Center</h3>
            <div
              className={`group relative flex flex-col items-center justify-center rounded-[2.5rem] border-4 border-dashed p-12 transition-all duration-500 ${
                isDragging ? "border-purple-500 bg-purple-500/5 scale-105" : "border-purple-100 bg-white/50 hover:border-purple-300"
              }`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <input type="file" accept=".pdf" className="absolute inset-0 z-20 opacity-0 cursor-pointer" onChange={onFileChange} ref={fileInputRef} disabled={isLoading} />
              <div className="text-center pointer-events-none">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform text-purple-400">📄</div>
                <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest leading-relaxed">Drop PDF Portfolio<br/>to analyze</p>
              </div>
            </div>

            {file && (
              <div className="mt-8 p-6 bg-purple-500/5 rounded-2xl border border-purple-500/10 flex items-center justify-between animate-pop">
                <span className="text-[10px] font-black text-purple-600 truncate mr-4"> {file.name}</span>
                <button onClick={handleUpload} disabled={isLoading} className="bg-purple-500 text-white px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-purple-500/20">{isLoading ? "Wait..." : "Sync"}</button>
              </div>
            )}
          </div>

          {selectedCvsForCompare.length === 2 && (
            <div className="p-10 rounded-[3rem] bg-purple-600 text-white shadow-2xl animate-pop">
              <p className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-70">Context Match Active</p>
              <h4 className="text-lg font-black mb-6 italic">Compare Objects</h4>
              <button onClick={handleCompare} disabled={isComparing} className="w-full py-5 bg-white text-purple-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:-translate-y-1 transition-all">{isComparing ? "Analyzing..." : "Run AI Comparison ⚖️"}</button>
            </div>
          )}
        </div>

        {/* ── Document Vault (Spans 10 columns) ── */}
        <div className="col-span-4 lg:col-span-10 space-y-12">
          <div className="flex justify-between items-center px-4">
            <div>
              <h3 className="text-2xl font-black text-slate-900 italic">Document Vault</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Managed AI data sources</p>
            </div>
            <span className="bg-purple-50/50 border border-purple-100 px-5 py-2 rounded-full text-[9px] font-black text-purple-500 uppercase tracking-widest shadow-sm">{cvList.length} Objects</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cvList.map((cv) => {
              const isSelected = selectedCvsForCompare.includes(cv.id || cv.cvId);
              return (
                <div key={cv.id || cv.cvId} className={`group relative p-12 bg-white/60 backdrop-blur-xl rounded-[3rem] border-2 transition-all duration-500 cursor-pointer ${isSelected ? "border-purple-500 shadow-2xl scale-[1.02]" : "border-purple-50 hover:border-purple-200 shadow-glass"}`} onClick={() => toggleCvSelection(cv.id || cv.cvId)}>
                   <div className="absolute top-6 left-6">
                      <button onClick={(e) => { e.stopPropagation(); handleSetPrimary(cv.id || cv.cvId); }} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${cv.isPrimary ? "bg-amber-400 text-white shadow-lg" : "bg-purple-50 text-purple-300 hover:text-amber-400"}`}>⭐</button>
                   </div>
                   <div className="absolute top-6 right-6">
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(cv.id || cv.cvId); }} className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-300 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all">✕</button>
                   </div>
                   <div className="flex flex-col items-center text-center">
                      <div className={`w-28 h-36 rounded-2xl mb-8 flex items-center justify-center text-6xl transition-all ${isSelected ? "bg-purple-500/10 text-purple-500" : "bg-purple-50/50 text-purple-200 group-hover:bg-purple-500/5 group-hover:text-purple-500/50"}`}>📄</div>
                      <p className="font-black text-slate-900 text-sm mb-2 truncate w-full">{cv.fileName || "Resume.pdf"}</p>
                      <div className="flex items-center gap-2.5 mt-3">
                         <div className={`w-2.5 h-2.5 rounded-full ${isSelected ? "bg-purple-500 animate-pulse" : "bg-purple-200"}`} />
                         <span className={`text-[9px] font-black uppercase tracking-widest ${isSelected ? "text-purple-500" : "text-purple-300"}`}>{isSelected ? "Ready for Analysis" : "Select to Compare"}</span>
                      </div>
                   </div>
                </div>
              );
            })}
          </div>

          <div className="glass-card p-12 rounded-[4rem] bg-purple-50/30 backdrop-blur-xl border border-purple-100 shadow-glass flex flex-col items-center text-center space-y-8">
             <h4 className="text-3xl font-black text-slate-950 italic">Ready for Discovery?</h4>
             <p className="text-sm font-medium text-slate-400 max-w-xl">Map your synchronized portfolio objects to a high-velocity career roadmap.</p>
             <button onClick={() => window.location.href = "/career-match"} className="bg-purple-500 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-purple-500/20 hover:-translate-y-1 transition-all">Generate My Roadmap →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CvManagerScreen;
