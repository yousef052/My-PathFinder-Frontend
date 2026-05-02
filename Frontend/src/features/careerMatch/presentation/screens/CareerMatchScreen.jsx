// src/features/careerMatch/presentation/screens/CareerMatchScreen.jsx
import React, { useEffect, useState } from "react";
import { useCareerMatch } from "../../hooks/useCareerMatch";
import Button from "../../../../core/ui_components/Button";

const CareerMatchScreen = () => {
  const {
    questionnaire,
    matchResult,
    isLoading,
    error,
    fetchQuestionnaire,
    submitQuestionnaire,
  } = useCareerMatch();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    fetchQuestionnaire();
  }, [fetchQuestionnaire]);

  const handleAnswerSelect = (qId, answerText) => {
    const newAnswers = [...answers];
    const existingIndex = newAnswers.findIndex((a) => a.questionId === qId);
    if (existingIndex > -1) newAnswers[existingIndex].answer = answerText;
    else newAnswers.push({ questionId: qId, answer: answerText });
    setAnswers(newAnswers);
  };

  const questions = questionnaire?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const qId = currentQuestion?.id || currentQuestion?.questionId;
  const currentAnswer = answers.find((a) => a.questionId === qId)?.answer || "";
  const progress =
    questions.length > 0
      ? Math.round(((currentQuestionIndex + 1) / questions.length) * 100)
      : 0;

  if (matchResult) {
    return (
      <div className="max-w-3xl mx-auto p-12 bg-white rounded-[3rem] border border-white text-center shadow-2xl shadow-blue-100 animate-fade-in">
        <div className="w-24 h-24 bg-blue-50 text-[#5b7cfa] rounded-full flex items-center justify-center mx-auto mb-8 text-5xl shadow-inner">
          🎯
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">
          Perfect Match Found!
        </h2>
        <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-gray-50 mb-10 italic text-lg text-gray-700 font-bold leading-relaxed shadow-inner">
          {matchResult.recommendation ||
            matchResult.resultText ||
            "إليك المسار المقترح بناءً على إجاباتك."}
        </div>
        <Button
          onClick={() => window.location.reload()}
          className="px-12 rounded-full"
        >
          Start Over
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-10">
      <div className="bg-white p-10 md:p-14 rounded-[3rem] border border-white shadow-xl shadow-blue-50">
        <div className="flex justify-between items-center mb-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">
          <span>
            Question {currentQuestionIndex + 1} / {questions.length}
          </span>
          <span className="text-[#5b7cfa] font-black">
            {progress}% Completed
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full mb-12 overflow-hidden">
          <div
            className="bg-[#5b7cfa] h-full transition-all duration-1000 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        {currentQuestion && (
          <div className="animate-fade-in">
            <h3 className="text-2xl md:text-3xl font-black text-gray-800 mb-10 leading-tight tracking-tight">
              {currentQuestion.text || currentQuestion.questionText}
            </h3>
            <div className="space-y-4">
              {currentQuestion.options?.length > 0 ? (
                currentQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(qId, opt)}
                    className={`w-full p-6 rounded-2xl border-2 text-left font-bold transition-all duration-300 ${currentAnswer === opt ? "border-[#5b7cfa] bg-blue-50/50 text-[#5b7cfa] shadow-md" : "border-slate-50 bg-slate-50/50 hover:border-blue-100 text-gray-600"}`}
                  >
                    {opt}
                  </button>
                ))
              ) : (
                <textarea
                  autoFocus
                  className="w-full p-8 bg-slate-50 border-2 border-transparent rounded-[2rem] outline-none focus:border-blue-100 focus:bg-white text-sm font-bold min-h-[180px] transition-all shadow-inner"
                  placeholder="Type your answer here..."
                  value={currentAnswer}
                  onChange={(e) => handleAnswerSelect(qId, e.target.value)}
                />
              )}
            </div>
            <div className="mt-14 flex justify-between items-center border-t border-slate-50 pt-10">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                className={`text-[10px] font-black uppercase tracking-widest ${currentQuestionIndex === 0 ? "opacity-0" : "text-gray-400 hover:text-[#5b7cfa]"}`}
              >
                ← Previous
              </button>
              <Button
                onClick={
                  currentQuestionIndex === questions.length - 1
                    ? () => submitQuestionnaire(answers)
                    : () => setCurrentQuestionIndex((prev) => prev + 1)
                }
                disabled={!currentAnswer.trim() || isLoading}
                isLoading={isLoading}
                className="px-12 rounded-full"
              >
                {currentQuestionIndex === questions.length - 1
                  ? "Analyze Results 🚀"
                  : "Continue"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default CareerMatchScreen;
