import React from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface NavigationButtonsProps {
  currentStep: number;
  maxStep: number;
  canProceed: boolean;
  termsAccepted: boolean;
  onBack: () => void;
  onNext: () => void;
  isLoading?: boolean;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  maxStep,
  onBack,
  onNext,
  canProceed,
}) => (
  <div className="flex justify-between pt-4 border-t border-gray-100">
    <button
      type="button"
      onClick={onBack}
      disabled={currentStep === 1}
      className={`flex items-center py-2 px-4 rounded-lg transition duration-300 font-semibold ${
        currentStep === 1
          ? 'text-gray-400 cursor-not-allowed'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <ChevronLeft className="h-5 w-5 mr-1" /> Voltar
    </button>

    {currentStep < maxStep ? (
      <button
        type="button"
        onClick={onNext}
        className="flex items-center py-2 px-4 bg-primary text-white rounded-lg shadow-md hover:bg-primary-hover transition duration-300 font-semibold disabled:opacity-50"
        disabled={!canProceed}
      >
        Próximo <ChevronRight className="h-5 w-5 ml-1" />
      </button>
    ) : (
      <button
        type="button" 
        onClick={onNext} 
        className="flex items-center py-2 px-4 bg-secondary text-gray-800 rounded-lg shadow-md hover:brightness-90 transition duration-300 font-semibold disabled:opacity-50"
        disabled={!canProceed} 
      >
        <Check className="h-5 w-5 mr-1" /> Concluir Cadastro
      </button>
    )}
  </div>
);