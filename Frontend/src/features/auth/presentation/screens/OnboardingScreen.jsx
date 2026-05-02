// src/features/auth/presentation/screens/OnboardingScreen.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../../core/ui_components/Button";

const OnboardingScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    {
      title: "Discover Your Potential 🔎",
      description:
        "Your journey begins with understanding your skills. Take our smart test to determine the career path best suited to your personality.",
      icon: "🎯",
      color: "bg-blue-50",
    },
    {
      title: "Master New Skills 🚀",
      description:
        "Don't overwhelm yourself with resources. We provide curated learning paths from the world's best platforms to get you market-ready.",
      icon: "📚",
      color: "bg-indigo-50",
    },
    {
      title: "Land Your Dream Job 🌟",
      description:
        "We connect you with real opportunities. Match your skills with thousands of jobs and get the career you deserve.",
      icon: "💼",
      color: "bg-emerald-50",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // 💡 حفظ حالة الإتمام لتجنب ظهورها مرة أخرى
      localStorage.setItem("hasCompletedOnboarding", "true");
      navigate("/login");
    }
  };

  const handleSkip = () => {
    localStorage.setItem("hasCompletedOnboarding", "true");
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F8F9FD] p-6">
      <div className="w-full max-w-md bg-white rounded-[3rem] p-12 shadow-2xl shadow-blue-100 border border-white animate-fade-in flex flex-col items-center text-center relative overflow-hidden">
        {currentStep < steps.length - 1 && (
          <button
            onClick={handleSkip}
            className="absolute top-10 right-10 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-colors"
          >
            Skip
          </button>
        )}

        {/* أيقونة الخطوة */}
        <div
          className={`w-48 h-48 ${steps[currentStep].color} rounded-[2.5rem] mb-12 flex items-center justify-center text-7xl shadow-inner transition-all duration-500`}
        >
          <span className="animate-bounce-slow">{steps[currentStep].icon}</span>
        </div>

        {/* النصوص */}
        <div className="space-y-4 mb-12">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight transition-all">
            {steps[currentStep].title}
          </h1>
          <p className="text-gray-400 font-medium text-xs leading-relaxed px-4">
            {steps[currentStep].description}
          </p>
        </div>

        {/* مؤشر النقاط النشط */}
        <div className="flex gap-2 mb-12">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 transition-all duration-500 rounded-full ${index === currentStep ? "w-10 bg-primary" : "w-2 bg-gray-200"}`}
            ></div>
          ))}
        </div>

        <div className="w-full">
          <Button
            onClick={handleNext}
            fullWidth
            className="py-4 shadow-xl shadow-blue-100"
          >
            {currentStep === steps.length - 1 ? "Get Started" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;
