// src/features/chatbot/hooks/useChatbot.js
import { useState } from "react";
import { chatbotService } from "../services/chatbotService";

export const useChatbot = () => {
  const MODES = { ASK: "ask", ROADMAP: "roadmap", INTERVIEW: "interview" };

  const [activeMode, setActiveMode] = useState(MODES.ASK);
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [selectedFile, setSelectedFile] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hello! I am your Path Finder Assistant. How can I help you today?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() && !selectedFile) return;

    const textToSend = inputMessage;
    const userDisplayMsg = selectedFile
      ? `${textToSend}\n📎 [Attached: ${selectedFile.name}]`
      : textToSend;

    const userMsg = { id: Date.now(), sender: "user", text: userDisplayMsg };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setInputMessage("");

    const fileToSend = selectedFile;
    setSelectedFile(null);

    try {
      let data;
      // توجيه الطلب بناءً على الوضع المختار
      if (activeMode === MODES.ASK) {
        data = await chatbotService.sendMessage(textToSend, fileToSend);
      } else if (activeMode === MODES.ROADMAP) {
        data = await chatbotService.getCareerRoadmap(textToSend);
      } else if (activeMode === MODES.INTERVIEW) {
        data = await chatbotService.getInterviewPrep(textToSend, difficulty);
      }

      // استخراج الرد بمرونة لتغطية كافة أشكال الاستجابة من الباك إند[cite: 24]
      const aiText =
        data?.reply ||
        data?.message ||
        data?.roadmap ||
        (typeof data === "string" ? data : JSON.stringify(data));

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "ai", text: aiText },
      ]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: "عذراً، يبدو أن السيرفر مشغول حالياً (503). يرجى المحاولة مرة أخرى.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
};
