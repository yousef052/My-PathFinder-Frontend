// src/features/chatbot/services/chatbotService.js
import { apiClient } from "../../../core/network/apiClient.js";

export const chatbotService = {
  // 1. الدردشة العامة: تدعم النصوص والمرفقات[cite: 26]
  sendMessage: async (messageText, attachmentFile = null) => {
    const formData = new FormData();
    formData.append("Message", messageText);

    // إرسال الملف إذا وجد، أو قيمة فارغة لتجنب خطأ 400[cite: 26]
    if (attachmentFile) {
      formData.append("Attachment", attachmentFile);
    } else {
      formData.append("Attachment", "");
    }

    formData.append("HistoryFile", "");

    const response = await apiClient.post("/Chatbot/ask", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // 2. توليد خارطة طريق مهنية[cite: 26]
  getCareerRoadmap: async (targetJobTitle) => {
    const response = await apiClient.post("/Chatbot/career-roadmap", {
      targetJobTitle: targetJobTitle,
    });
    return response.data;
  },

  // 3. التحضير للمقابلات الشخصية[cite: 26]
  getInterviewPrep: async (jobTitle, difficulty) => {
    const response = await apiClient.post("/Chatbot/interview-prep", {
      jobTitle: jobTitle,
      difficulty: difficulty,
    });
    return response.data;
  },
};
