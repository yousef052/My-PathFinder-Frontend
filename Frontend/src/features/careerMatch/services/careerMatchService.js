import { apiClient } from "../../../core/network/apiClient";

export const careerMatchService = {
  // جلب الأسئلة
  getQuestionnaire: async () => {
    const response = await apiClient.get("/Questionnaire/career-match");
    return response.data;
  },

  // إرسال الإجابات للحصول على النتيجة
  submitAnswers: async (submissionData) => {
    // شكل البيانات المتوقع: { questionnaireId: 1, answers: [{ questionId: 1, answer: "text" }] }
    const response = await apiClient.post(
      "/Questionnaire/career-match/submit",
      submissionData,
    );
    return response.data;
  },
};
