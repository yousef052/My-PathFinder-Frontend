// src/features/chatbot/presentation/screens/ChatbotScreen.jsx
import React, { useRef, useEffect } from "react";
import { useChatbot } from "../../hooks/useChatbot";

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

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] max-w-5xl mx-auto bg-white rounded-[3rem] shadow-2xl border border-white overflow-hidden animate-fade-in">
      {/* Header[cite: 25] */}
      <div className="bg-[#5b7cfa] p-8 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center text-3xl backdrop-blur-md">
            🤖
          </div>
          <div>
            <h2 className="text-xl font-black italic tracking-tight">
              Path Finder AI
            </h2>
            <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mt-1">
              Active Intelligence Engine
            </p>
          </div>
        </div>

        {/* Difficulty Selector for Interview Mode[cite: 24, 25] */}
        {activeMode === MODES.INTERVIEW && (
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-[10px] font-black uppercase outline-none"
          >
            <option value="Beginner" className="text-gray-900">
              Beginner
            </option>
            <option value="Intermediate" className="text-gray-900">
              Intermediate
            </option>
            <option value="Expert" className="text-gray-900">
              Expert
            </option>
          </select>
        )}
      </div>

      {/* Mode Tabs[cite: 25] */}
      <div className="flex bg-slate-50 border-b border-gray-100 p-3 gap-2 justify-center">
        {[MODES.ASK, MODES.ROADMAP, MODES.INTERVIEW].map((mode) => (
          <button
            key={mode}
            onClick={() => setActiveMode(mode)}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMode === mode ? "bg-white text-[#5b7cfa] shadow-md" : "text-gray-400 hover:text-[#5b7cfa]"}`}
          >
            {mode === MODES.ASK
              ? "💬 General"
              : mode === MODES.ROADMAP
                ? "🗺️ Roadmap"
                : "🎯 Interview"}
          </button>
        ))}
      </div>

      {/* Messages Area[cite: 25] */}
      <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-slate-50/20 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-6 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm ${msg.sender === "user" ? "bg-[#5b7cfa] text-white rounded-tr-none" : "bg-white text-gray-800 border border-gray-50 rounded-tl-none"}`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start text-2xl animate-bounce ml-6">
            ...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section[cite: 25] */}
      <div className="p-8 bg-white border-t border-gray-100">
        {selectedFile && (
          <div className="mb-4 p-3 bg-blue-50 text-[#5b7cfa] text-[10px] font-black rounded-xl flex justify-between items-center">
            📄 {selectedFile.name}
            <button onClick={() => setSelectedFile(null)}>✕</button>
          </div>
        )}

        <form
          onSubmit={handleSendMessage}
          className="flex gap-4 items-center bg-slate-50 p-2 pl-6 rounded-[2.5rem] shadow-inner border-2 border-transparent focus-within:border-blue-100 transition-all"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              activeMode === MODES.ROADMAP
                ? "Enter job title to generate roadmap..."
                : "Type your message..."
            }
            className="flex-1 bg-transparent py-4 outline-none text-sm font-bold text-gray-700"
            disabled={isLoading}
          />

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="p-3 text-xl hover:rotate-12 transition-transform"
          >
            📎
          </button>

          <button
            type="submit"
            disabled={isLoading || (!inputMessage.trim() && !selectedFile)}
            className="bg-[#5b7cfa] text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 active:scale-90 disabled:opacity-30"
          >
            🚀
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatbotScreen;
