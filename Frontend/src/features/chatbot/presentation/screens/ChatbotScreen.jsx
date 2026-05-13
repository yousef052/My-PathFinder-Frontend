import React, { useRef, useEffect } from "react";
import { useChatbot } from "../../hooks/useChatbot";
import Button from "../../../../core/ui_components/Button";

const ChatbotScreen = () => {
  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    handleSendMessage,
    activeMode,
    setActiveMode,
    MODES,
    difficulty,
    setDifficulty,
    selectedFile,
    setSelectedFile,
  } = useChatbot();

  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.documentElement.style.setProperty('--theme-color', '#6366f1');
    document.documentElement.style.setProperty('--bg-orb-1', '#6366f1');
    document.documentElement.style.setProperty('--bg-orb-2', '#818cf8');
    document.documentElement.style.setProperty('--bg-orb-3', '#312e81');
    document.documentElement.style.setProperty('--bg-gradient-start', '#312e81');
    document.documentElement.style.setProperty('--bg-gradient-end', '#1e1b4b');
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="mx-auto flex h-[calc(100vh-160px)] w-full flex-col overflow-hidden rounded-[2.5rem] border-4 border-white bg-white shadow-2xl animate-fade-slide">
      
      {/* ── Header ── */}
      <div className="flex shrink-0 items-center justify-between bg-white/80 backdrop-blur-xl p-5 border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-2xl shadow-inner">
            🤖
          </div>
          <div>
            <h2 className="text-xl font-black italic tracking-tight text-slate-950">PathFinder AI</h2>
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-primary mt-0.5">
              Assistant Ready
            </p>
          </div>
        </div>

        {activeMode === MODES.INTERVIEW && (
          <div className="hidden sm:block">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-[9px] font-black uppercase outline-none focus:ring-4 focus:ring-primary/5 transition-all"
            >
              <option value="Beginner" className="text-slate-900">Beginner</option>
              <option value="Intermediate" className="text-slate-900">Intermediate</option>
              <option value="Expert" className="text-slate-900">Expert</option>
            </select>
          </div>
        )}
      </div>

      {/* ── Mode Selection ── */}
      <div className="flex gap-2 bg-slate-50/50 p-2 border-b border-slate-100">
        {[
          { id: MODES.ASK, label: "Chat", icon: "💬" },
          { id: MODES.ROADMAP, label: "Roadmap", icon: "🗺️" },
          { id: MODES.INTERVIEW, label: "Interview", icon: "🎯" }
        ].map((mode) => (
          <button
            key={mode.id}
            onClick={() => setActiveMode(mode.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
              activeMode === mode.id 
                ? "bg-white text-primary shadow-sm scale-102" 
                : "text-neutral-400 hover:text-neutral-600"
            }`}
          >
            <span className="text-base">{mode.icon}</span>
            <span className="hidden sm:inline">{mode.label}</span>
          </button>
        ))}
      </div>

      <div 
        ref={chatContainerRef}
        className="custom-scrollbar flex-1 overflow-y-auto bg-slate-50/10 p-6 space-y-6"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-pop`}
          >
            <div
              className={`relative max-w-[85%] p-5 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm ${
                msg.sender === "user" 
                  ? "bg-primary text-white rounded-tr-none shadow-primary-lightest" 
                  : "bg-white text-neutral-800 border border-neutral-100 rounded-tl-none"
              }`}
            >
              {msg.text}
              <div className={`absolute bottom-[-18px] text-[7px] font-black uppercase tracking-widest text-slate-300 ${
                msg.sender === "user" ? "right-2" : "left-2"
              }`}>
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-1.5 p-4 bg-white rounded-2xl w-fit shadow-sm border border-neutral-50 animate-pulse ml-2">
            <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
            <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" />
            <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
      </div>

      {/* ── Input Bar ── */}
      <div className="p-6 bg-indigo-50/30 border-t border-indigo-100">
        {selectedFile && (
          <div className="mb-3 flex items-center justify-between bg-indigo-100 p-2 rounded-lg border border-indigo-200 animate-pop">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-lg">📄</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-indigo-800 truncate">{selectedFile.name}</span>
            </div>
            <button onClick={() => setSelectedFile(null)} className="hover:text-error transition-colors">✕</button>
          </div>
        )}

        <form
          onSubmit={handleSendMessage}
          className="flex gap-3 items-center bg-white p-1.5 pl-6 rounded-full focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all shadow-inner border border-indigo-100"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              activeMode === MODES.ROADMAP
                ? "Enter target job title..."
                : "How can I help you today?"
            }
            className="flex-1 bg-transparent py-3 outline-none text-sm font-bold text-slate-700"
            disabled={isLoading}
          />

          <div className="flex items-center gap-2 pr-1">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="p-2 text-neutral-400 hover:text-primary transition-colors"
              title="Attach File"
            >
              <span className="text-xl">📎</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <Button
              type="submit"
              disabled={isLoading || (!inputMessage.trim() && !selectedFile)}
              className="!px-5 !py-3 !rounded-full"
              variant="primary"
              icon="🚀"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatbotScreen;
