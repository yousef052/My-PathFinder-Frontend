import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    title: "Discover Your Potential",
    emoji: "🎯",
    description:
      "Your journey begins with understanding your unique skills. Take our smart test to determine the path best suited to your profile.",
    gradient: "from-primary to-secondary",
    bg: "bg-primary-lightest",
    accentColor: "var(--color-primary)",
  },
  {
    title: "Master Global Skills",
    emoji: "📚",
    description:
      "Curated learning roadmaps from the world's elite platforms. Focus on what matters and get market-ready faster.",
    gradient: "from-secondary to-primary-hover",
    bg: "bg-secondary-lightest",
    accentColor: "var(--color-secondary)",
  },
  {
    title: "Land Your Dream Career",
    emoji: "💼",
    description:
      "Connect with thousands of real opportunities. Match your skills with high-impact jobs and accelerate your professional growth.",
    gradient: "from-success to-emerald-600",
    bg: "bg-emerald-50",
    accentColor: "var(--color-success)",
  },
];

const OnboardingScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      localStorage.setItem("hasCompletedOnboarding", "true");
      navigate("/login");
    }
  };

  const handleSkip = () => {
    localStorage.setItem("hasCompletedOnboarding", "true");
    navigate("/login");
  };

  const step = steps[currentStep];

  return (
    <div className="flex min-h-screen items-center justify-center p-6 relative overflow-hidden">
      <div 
        className="glass-card w-full max-w-md overflow-hidden rounded-5xl p-12 text-center relative z-10"
        style={{ animation: "pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}
      >
        
        {/* Skip Button */}
        {currentStep < steps.length - 1 && (
          <button
            onClick={handleSkip}
            className="absolute right-12 top-12 text-[10px] font-black uppercase tracking-widest text-neutral-400 transition-colors hover:text-primary"
          >
            Skip
          </button>
        )}

        {/* Step Icon */}
        <div
          key={currentStep}
          className={`mx-auto mb-14 flex h-48 w-48 items-center justify-center rounded-4xl ${step.bg} shadow-inner transition-colors duration-500`}
          style={{ animation: "fade-slide-up 0.5s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          <span
            className="text-7xl animate-bounce"
            style={{ animationDuration: "3s" }}
          >
            {step.emoji}
          </span>
        </div>

        {/* Step Content */}
        <div
          key={`text-${currentStep}`}
          className="mb-14 space-y-5"
          style={{ animation: "fade-slide-up 0.5s cubic-bezier(0.16,1,0.3,1) both 100ms" }}
        >
          <h1 className="text-3xl font-black tracking-tight text-neutral-900">
            {step.title}
          </h1>
          <p className="mx-auto max-w-xs text-sm font-medium leading-relaxed text-neutral-500">
            {step.description}
          </p>
        </div>

        {/* Progress Indicators */}
        <div className="mb-14 flex items-center justify-center gap-3">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-2.5 rounded-full transition-all duration-700 ${
                index === currentStep
                  ? "w-12 bg-primary shadow-lg shadow-primary/20"
                  : "w-2.5 bg-neutral-200 hover:bg-neutral-300"
              }`}
            />
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleNext}
          className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-primary px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 hover:bg-primary-hover active:scale-95"
        >
          <span className="relative z-10">
            {currentStep === steps.length - 1 ? "Initialize Journey 🚀" : "Discover Next →"}
          </span>
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
        </button>

        {/* Step counter */}
        <p className="mt-8 text-[9px] font-black uppercase tracking-[0.3em] text-neutral-300">
          Phase {currentStep + 1} <span className="text-neutral-100">/</span> {steps.length}
        </p>
      </div>
    </div>
  );
};

export default OnboardingScreen;
