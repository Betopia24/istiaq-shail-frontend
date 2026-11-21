import React from "react";
import { Check } from "lucide-react";

interface OnboardingStepProgressProps {
  currentStep: 1 | 2 | 3;
}

export const OnboardingStepProgress: React.FC<OnboardingStepProgressProps> = ({
  currentStep,
}) => {
  const steps = [
    { number: 1, label: "Account Details", shortLabel: "Account" },
    { number: 2, label: "Choose Plan", shortLabel: "Plan" },
    { number: 3, label: "Payment & Activation", shortLabel: "Payment" },
  ];

  return (
    <nav aria-label="Onboarding Progress" className="w-full max-w-xl mx-auto mb-8 sm:mb-10 px-4">
      <ol className="flex items-center justify-between relative">
        {/* Track Line */}
        <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-0.5 bg-slate-200 -z-0" />
        <div
          className="absolute top-1/2 left-6 -translate-y-1/2 h-0.5 bg-[#092167] transition-all duration-300 -z-0"
          style={{
            width:
              currentStep === 1
                ? "0%"
                : currentStep === 2
                ? "50%"
                : "calc(100% - 3rem)",
          }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <li
              key={step.number}
              className="relative z-10 flex flex-col items-center group"
            >
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-heading font-semibold text-xs sm:text-sm transition-all duration-200 border-2 ${
                  isCompleted
                    ? "bg-[#092167] border-[#092167] text-white"
                    : isCurrent
                    ? "bg-[#E8A808] border-[#E8A808] text-[#06143E] shadow-[0_0_0_4px_rgba(232,168,8,0.25)]"
                    : "bg-white border-slate-300 text-slate-400"
                }`}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              <span
                className={`mt-2 font-sans text-xs sm:text-sm font-medium tracking-tight text-center ${
                  isCurrent
                    ? "text-[#06143E] font-semibold"
                    : isCompleted
                    ? "text-slate-700"
                    : "text-slate-400"
                }`}
              >
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden">{step.shortLabel}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default OnboardingStepProgress;
