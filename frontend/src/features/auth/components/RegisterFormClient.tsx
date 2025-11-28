'use client';

import { TypeSelector } from '@/components/ui/TypeSelector';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { NavigationButtons } from '@/components/ui/NavigationButtons';
import { Step1Credentials } from './steps/Step1Credentials';
import { Step2PersonalInfo } from './steps/Step2PersonalInfo';
import { Step3Preferences } from './steps/Step3Preferences';
import { Step4Terms } from './steps/Step4Terms';
import { OrganizationForm } from './steps/OrganizationForm';
import { useRegisterForm } from '../useRegisterForm';

const STEPS = ['Acesso', 'Pessoal', 'Causas', 'Termos'];

export function RegisterFormClient() {
  const {
    formData,
    currentStep,
    isStepValid,
    isLoading,
    emailError,
    registerType,
    setRegisterType,
    onInputChange,
    onTagToggle,
    nextStep,
    prevStep,
    handleSubmit,
  } = useRegisterForm();

  const maxStep = registerType === 'volunteer' ? 4 : 1;
  const onNextHandler = (currentStep === maxStep) ? handleSubmit : nextStep;

  const renderStep = () => {
    if (registerType === 'organization') {
      return (
        <OrganizationForm
          formData={formData}
          isStepValid={isStepValid}
          onInputChange={onInputChange}
          onTagToggle={onTagToggle}
        />
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <Step1Credentials
            formData={formData}
            isStepValid={isStepValid}
            onInputChange={onInputChange}
            emailError={emailError}
          />
        );
      case 2:
        return (
          <Step2PersonalInfo
            formData={formData}
            isStepValid={isStepValid}
            onInputChange={onInputChange}
          />
        );
      case 3:
        return (
          <Step3Preferences
            formData={formData}
            isStepValid={isStepValid}
            onTagToggle={onTagToggle}
            onInputChange={onInputChange}
          />
        );
      case 4:
        return (
          <Step4Terms
            formData={formData}
            isStepValid={isStepValid}
            onInputChange={onInputChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Cadastro - REVO
        </h2>

        {/* Correção 1: Usando onTypeChange em vez de onChange */}
        <TypeSelector
          registerType={registerType}
          onTypeChange={setRegisterType}
        />

        {registerType === 'volunteer' && (
          <ProgressBar currentStep={currentStep} steps={STEPS} />
        )}

        <form className="mt-8" onSubmit={(e) => e.preventDefault()}>
          {renderStep()}

          <NavigationButtons
            currentStep={currentStep}
            maxStep={maxStep}
            canProceed={
              isStepValid &&
              (
                (registerType === 'volunteer' && currentStep < 4) ||
                formData.termsAccepted
              )
            }
            termsAccepted={formData.termsAccepted}
            
            /* Correção 2: Mudado de onClick para onBack */
            onBack={prevStep}
            
            onNext={onNextHandler}
            isLoading={isLoading}
          />
        </form>
      </div>
    </div>
  );
}