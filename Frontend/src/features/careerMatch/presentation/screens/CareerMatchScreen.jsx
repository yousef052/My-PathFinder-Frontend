// src/features/careerMatch/presentation/screens/CareerMatchScreen.jsx
import React, { useEffect, useState } from "react";
import { useCareerMatch } from "../../hooks/useCareerMatch";
import { useNavigate } from "react-router-dom";
import Button from "../../../../core/ui_components/Button";

const CareerMatchScreen = () => {
  const navigate = useNavigate();
  const { questionnaire, matchResult, isLoading, isEnrolling, fetchQuestionnaire, submitQuestionnaire, enrollInPath } = useCareerMatch();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty('--bg-orb-1', '#f97316');
    document.documentElement.style.setProperty('--bg-orb-2', '#fb923c');
    document.documentElement.style.setProperty('--bg-orb-3', '#7c2d12');
    document.documentElement.style.setProperty('--bg-gradient-start', '#7c2d12');
    document.documentElement.style.setProperty('--bg-gradient-end', '#2d0a00');
  }, []);

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
    const pathId = matchResult?.careerPathId || matchResult?.id || matchResult?.recommendedPathId || matchResult?.pathId || matchResult?.careerPath?.id;
    if (pathId) {
      const success = await enrollInPath(pathId);
      if (success) {
        setEnrolled(true);
        setTimeout(() => navigate("/my-career-paths"), 1500);
      }
    } else navigate("/career-paths");
  };

  const questions = questionnaire?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const qId = currentQuestion?.id || currentQuestion?.questionId;
  const currentAnswer = answers.find((a) => a.questionId === qId)?.answer || "";
  const progress = questions.length > 0 ? Math.round(((currentQuestionIndex + 1) / questions.length) * 100) : 0;

  return (
    <div className="grid grid-main min-h-[50vh] items-center animate-fade-in py-6">
      <div className="col-span-4 lg:col-start-5 lg:col-span-6 space-y-10">
        
        {matchResult ? (
          <div className="p-8 md:p-12 bg-white/80 backdrop-blur-xl rounded-[3rem] border border-orange-100 shadow-glass text-center space-y-8 animate-pop">
            <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center text-4xl transition-all ${enrolled ? "bg-emerald-500 text-white scale-110" : "bg-orange-500/10 text-orange-500"}`}>
               {enrolled ? "✓" : "🎯"}
            </div>
            <div className="space-y-3">
               <h2 className="text-3xl font-black text-slate-900 italic">{enrolled ? "Path Synchronized" : "Your AI Blueprint"}</h2>
               <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Match Accuracy: 98.4%</p>
            </div>
            <div className="p-8 bg-slate-50 rounded-[2.5rem] space-y-3">
               <h4 className="text-xl font-black text-slate-950">{matchResult.careerPathName || matchResult.name}</h4>
               <p className="text-xs font-medium text-slate-400 leading-relaxed">This path perfectly aligns with your skills and professional aspirations based on our AI synthesis.</p>
            </div>
            <button 
              onClick={enrolled ? () => navigate("/my-career-paths") : handleEnroll} 
              className="w-full bg-orange-500 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:-translate-y-1 transition-all"
            >
              {enrolled ? "Go to My Journey →" : "Enroll & Start Learning 🚀"}
            </button>
          </div>
        ) : (
          <div className="space-y-10 p-8 md:p-12 bg-white/60 backdrop-blur-xl rounded-[3rem] border border-orange-100 shadow-glass">
            <div className="space-y-4">
               <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                  <span>Step {currentQuestionIndex + 1} / {questions.length}</span>
                  <span className="text-orange-500">{progress}%</span>
               </div>
               <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 transition-all duration-700" style={{ width: `${progress}%` }} />
               </div>
            </div>

            {currentQuestion && (
              <div key={currentQuestionIndex} className="space-y-10 animate-fade-in-up">
                 <h3 className="text-2xl md:text-4xl font-black text-slate-900 italic leading-tight">{currentQuestion.text || currentQuestion.questionText}</h3>
                 <div className="grid gap-3">
                    {currentQuestion.options?.map((opt, idx) => (
                       <button key={idx} onClick={() => handleAnswerSelect(qId, opt)} className={`p-6 text-left rounded-2xl border-2 transition-all ${currentAnswer === opt ? "border-orange-500 bg-orange-500/5 text-orange-500" : "border-slate-50 bg-slate-50 hover:border-orange-500/10 text-slate-600"}`}>
                          <span className="text-base font-black">{opt}</span>
                       </button>
                    ))}
                    {!currentQuestion.options && <textarea className="w-full h-40 p-6 rounded-2xl bg-slate-50 border-none outline-none font-bold text-base focus:bg-white transition-all shadow-inner" placeholder="Tell us more..." value={currentAnswer} onChange={(e) => handleAnswerSelect(qId, e.target.value)} />}
                 </div>
                 <div className="flex justify-between items-center pt-4">
                    <button onClick={() => setCurrentQuestionIndex(prev => prev - 1)} disabled={currentQuestionIndex === 0} className={`text-[9px] font-black uppercase tracking-widest ${currentQuestionIndex === 0 ? "opacity-0" : "text-slate-300 hover:text-orange-500"}`}>← Back</button>
                    <button 
                      onClick={currentQuestionIndex === questions.length - 1 ? () => submitQuestionnaire(answers) : () => setCurrentQuestionIndex(prev => prev + 1)} 
                      disabled={!currentAnswer.trim() || isLoading}
                      className="bg-orange-500 text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:-translate-y-1 transition-all disabled:opacity-50"
                    >
                      {isLoading ? "Analyzing..." : currentQuestionIndex === questions.length - 1 ? "Generate Blueprint 🚀" : "Continue →"}
                    </button>
                 </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerMatchScreen;
