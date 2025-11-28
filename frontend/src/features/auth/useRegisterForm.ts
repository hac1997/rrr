'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { RegisterFormData, RegisterType } from '@/lib/types';
import { validateStep } from '@/lib/validation/validation';
import { registerUser } from '@/actions/registerUser';
import { toast } from 'sonner';

const initialData: RegisterFormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  city: '',
  state: '',
  birthDate: '',
  phone: '',
  gender: '',
  preferences: [],
  termsAccepted: false,
  cnpj: '',
  cpf: '',
};

export const useRegisterForm = () => {
  const [registerType, setRegisterType] = useState<RegisterType>('volunteer');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegisterFormData>(initialData);
  const [isStepValid, setIsStepValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const router = useRouter();

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({ ...prev, [name]: newValue }));
    setIsStepValid(true);
    setEmailError(''); // Clear email error on input change
  }, []);

  const handleTagToggle = useCallback((tagId: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(tagId)
        ? prev.preferences.filter(id => id !== tagId)
        : [...prev.preferences, tagId],
    }));
    setIsStepValid(true);
  }, []);

  const handleTypeChange = useCallback((type: RegisterType) => {
    setRegisterType(type);
    setCurrentStep(1);
    setIsStepValid(true);
    setFormData(initialData);
    setEmailError(''); // Clear email error on type change
  }, []);

  const handleNext = useCallback(() => {
    if (validateStep(currentStep, formData)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      setIsStepValid(true);
      setEmailError(''); // Clear email error on step change
    } else {
      setIsStepValid(false);
    }
  }, [currentStep, formData]);

  const handleBack = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setIsStepValid(true);
    setEmailError(''); // Clear email error on step change
  }, []);

  const handleSubmit = useCallback(async () => {
    console.log('CLIENT: handleSubmit INICIADO');
    setEmailError(''); // Clear any previous email error before new submission

    if (!formData.termsAccepted) {
      console.warn('CLIENT: Submit bloqueado - Termos não aceitos.');
      setIsStepValid(false);
      return;
    }

    setIsLoading(true);
    const formDataToSend = new FormData();

    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('confirmPassword', formData.password);
    formDataToSend.append('city', formData.city);
    formDataToSend.append('state', formData.state);
    formDataToSend.append('acceptTerms', formData.termsAccepted.toString());
    formDataToSend.append('registerType', registerType);

    if (registerType === 'volunteer') {
      formDataToSend.append('fullName', formData.name);
      formDataToSend.append('interests', JSON.stringify(formData.preferences));
      formDataToSend.append('cpf', formData.cpf);
      formDataToSend.append('birthDate', formData.birthDate);
      formDataToSend.append('phone', formData.phone);
    } else {
      formDataToSend.append('orgName', formData.name);
      formDataToSend.append('orgCnpj', formData.cnpj);
      formDataToSend.append('orgCauses', JSON.stringify(formData.preferences));
      formDataToSend.append('phone', formData.phone);
    }

    console.log('CLIENT: Dados a enviar (raw object):', Object.fromEntries(formDataToSend.entries()));

    try {
      const result = await registerUser({}, formDataToSend);
      console.log('CLIENT: Resposta do servidor recebida:', result);

      if (!result.success) {
        console.error('CLIENT ERROR: Servidor retornou success: false.', result.message, result.errors);

        // Check if it's an email already exists error
        if (result.message.toLowerCase().includes('email') && result.message.toLowerCase().includes('registered')) {
          setEmailError(result.message);
          setCurrentStep(1); // Go back to step 1
          setIsStepValid(false);
          return;
        }

        throw new Error(result.message || 'Erro no cadastro (payload)');
      }

      console.log('CLIENT SUCCESS: Cadastro concluído com sucesso! Redirecionando...');

      // Handle server-side redirect if provided
      if (result.redirectTo) {
        window.location.href = result.redirectTo;
        return; // Stop execution after redirect
      }

      // Fallback redirect
      const destination = '/login';

      console.log(`CLIENT: SUCESSO! Redirecionando para: ${destination}`);
      router.push(destination);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao cadastrar';
      console.error('CLIENT ERROR: A chamada "registerUser" FALHOU (bloco catch):', errorMessage);
      setIsStepValid(false);
      // Don't show alert if we already handled the email error
      if (!errorMessage.toLowerCase().includes('email')) {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData, registerType, router]);

  return {
    formData,
    registerType,
    currentStep,
    isStepValid,
    isLoading,
    emailError,
    setRegisterType: handleTypeChange,
    onInputChange: handleInputChange,
    onTagToggle: handleTagToggle,
    nextStep: handleNext,
    prevStep: handleBack,
    handleSubmit,
  };
};