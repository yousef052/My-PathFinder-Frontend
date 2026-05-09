// src/features/careerMatch/presentation/screens/CareerMatchScreen.jsx
import React, { useEffect, useState } from "react";
import { useCareerMatch } from "../../hooks/useCareerMatch";
import Button from "../../../../core/ui_components/Button";
import { useNavigate } from "react-router-dom";

const CareerMatchScreen = () => {
  const navigate = useNavigate();
  const {
    questionnaire,
    matchResult,
    isLoading,
    isEnrolling,
    error,
    fetchQuestionnaire,
    submitQuestionnaire,
    enrollInPath,
  } = useCareerMatch();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [enrolled, setEnrolled] = useState(false);

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

  const handleEnroll = async () => {
    // Check all possible ID fields for the recommended path
    const pathId = 
      matchResult?.careerPathId || 
      matchResult?.id || 
      matchResult?.recommendedPathId || 
      matchResult?.pathId ||
      matchResult?.careerPath?.id;
      
    if (pathId) {
      const success = await enrollInPath(pathId);
      if (success) {
        setEnrolled(true);
        // Wait a bit to show success state then navigate
        setTimeout(() => navigate("/my-career-paths"), 1500);
      }
    } else {
      console.error("No valid path ID found in match result", matchResult);
      // Fallback: if we can't enroll, just go to catalog
      navigate("/career-paths");
    }
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
    const pathName = matchResult.careerPathName || matchResult.name || "Recommended Path";
    
    // Clean up recommendation text (remove any Arabic fallbacks)
    let displayRecommendation = matchResult.recommendation || matchResult.resultText || matchResult.description;
    if (!displayRecommendation || /[\u0600-\u06FF]/.test(displayRecommendation)) {
       displayRecommendation = "This path perfectly aligns with your skills and professional aspirations based on our AI analysis.";
    }

    return (
      <div className="max-w-3xl mx-auto p-12 bg-white rounded-[4rem] border border-white text-center shadow-2xl shadow-blue-100 animate-fade-in">
        <div className="w-24 h-24 bg-blue-50 text-[#5b7cfa] rounded-full flex items-center justify-center mx-auto mb-8 text-5xl shadow-inner">
          {enrolled ? "✅" : "🎯"}
        </div>
        
        <h2 className="text-3xl font-black text-slate-900 mb-2">
          {enrolled ? "Successfully Enrolled!" : "Perfect Match Found!"}
        </h2>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.25em] mb-10">
          {enrolled ? "Preparing your learning journey..." : "AI Generated Recommendation"}
        </p>

        <div className="premium-card p-10 bg-slate-50 border-slate-100 mb-10 shadow-inner group">
          <h4 className="text-primary font-black text-[10px] uppercase tracking-widest mb-4">Recommended Career</h4>
          <div className="text-3xl font-black text-slate-950 mb-4 group-hover:scale-105 transition-transform duration-500">
            {pathName}
          </div>
          <p className="text-slate-500 font-medium leading-relaxed">
            {displayRecommendation}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-xs font-bold mb-6">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!enrolled ? (
            <Button
              onClick={handleEnroll}
              isLoading={isEnrolling}
              className="px-16 h-16 rounded-2xl text-sm shadow-primary/20"
            >
              Enroll & Start Learning 🚀
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/my-career-paths")}
              className="px-16 h-16 rounded-2xl text-sm shadow-emerald-200"
            >
              Go to My Paths
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up pb-10">
      <div className="bg-white p-12 md:p-16 rounded-[4rem] border border-white shadow-xl shadow-blue-50">
        <div className="flex justify-between items-center mb-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
          <span>
            Question {currentQuestionIndex + 1} / {questions.length}
          </span>
          <span className="text-primary font-black">
            {progress}% Complete
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full mb-12 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(91,124,250,0.5)]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        {currentQuestion && (
          <div className="animate-fade-in">
            <h3 className="text-2xl md:text-4xl font-black text-slate-900 mb-12 leading-tight tracking-tight italic">
              {currentQuestion.text || currentQuestion.questionText}
            </h3>
            <div className="space-y-4">
              {currentQuestion.options?.length > 0 ? (
                currentQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(qId, opt)}
                    className={`w-full p-8 rounded-3xl border-2 text-left font-bold transition-all duration-500 ${currentAnswer === opt ? "border-primary bg-primary/5 text-primary shadow-lg shadow-blue-100/50 -translate-y-1" : "border-slate-50 bg-slate-50/50 hover:border-blue-100 text-slate-600 hover:bg-white"}`}
                  >
                    {opt}
                  </button>
                ))
              ) : (
                <textarea
                  autoFocus
                  className="w-full p-8 bg-slate-50 border-2 border-transparent rounded-[2.5rem] outline-none focus:border-primary focus:bg-white text-sm font-bold min-h-[200px] transition-all shadow-inner"
                  placeholder="Share your thoughts..."
                  value={currentAnswer}
                  onChange={(e) => handleAnswerSelect(qId, e.target.value)}
                />
              )}
            </div>
            <div className="mt-16 flex justify-between items-center border-t border-slate-50 pt-12">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all ${currentQuestionIndex === 0 ? "opacity-0 pointer-events-none" : "text-slate-400 hover:text-primary"}`}
              >
                ← Back
              </button>
              <Button
                onClick={
                  currentQuestionIndex === questions.length - 1
                    ? () => submitQuestionnaire(answers)
                    : () => setCurrentQuestionIndex((prev) => prev + 1)
                }
                disabled={!currentAnswer.trim() || isLoading}
                isLoading={isLoading}
                className="px-16 h-16 rounded-2xl text-[10px] uppercase tracking-widest font-black"
              >
                {currentQuestionIndex === questions.length - 1
                  ? "Generate Blueprint 🚀"
                  : "Next Step"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerMatchScreen;
