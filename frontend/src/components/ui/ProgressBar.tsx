import React from 'react';
import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  steps: string[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, steps }) => (
  <div className="flex justify-between items-start mb-6">
    {steps.map((label, index) => {
      const step = index + 1;
      return (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-300 ${
                currentStep === step
                  ? 'bg-secondary text-blue-400 font-bold shadow-lg'
                  : currentStep > step
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {currentStep > step ? <Check className="w-4 h-4" /> : step}
            </div>
            <span
              className={`text-xs mt-1 text-center whitespace-nowrap ${
                currentStep >= step ? 'text-blue-400 font-medium' : 'text-gray-500'
              }`}
            >
              {label}
            </span>
          </div>
          {step < steps.length && (
            <div
              className={`flex-grow h-1 mx-1 transition-colors duration-300 mt-4 ${
                currentStep > step ? 'bg-green-500' : 'bg-gray-200'
              }`}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);
