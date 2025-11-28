import React from 'react';
import { InputField } from '@/components/ui/InputField';
import { SocialButton } from '@/components/ui/SocialButton';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { RegisterStepProps } from '@/lib/types';

export const Step1Credentials: React.FC<RegisterStepProps> = ({
  formData,
  isStepValid,
  onInputChange,
  emailError,
}) => (
  <>
    <h3 className="text-xl font-semibold text-gray-700 mb-4">
      Passo 1: Credenciais de Acesso
    </h3>
    <p className="text-center text-sm text-gray-500 mb-4">
      Crie sua conta ou use suas redes sociais.
    </p>
    <div className="space-y-4">
      <InputField
        type="email"
        name="email"
        value={formData.email}
        onChange={onInputChange}
        placeholder="Seu melhor e-mail"
        required
      />
      {emailError && (
        <p className="text-sm text-red-600 mt-1">{emailError}</p>
      )}
      <InputField
        type="password"
        name="password"
        value={formData.password}
        onChange={onInputChange}
        placeholder="Crie uma Senha (Mínimo 6 caracteres)"
        required
      />
      <InputField
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={onInputChange}
        placeholder="Confirme sua Senha"
        required
      />
      {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
        <p className="text-sm text-red-600 mt-1">As senhas não coincidem</p>
      )}
      <ErrorMessage
        show={!isStepValid}
        message="Por favor, verifique se as senhas coincidem e têm 6+ caracteres."
      />
      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="px-3 text-sm text-gray-500">ou</span>
        <hr className="flex-grow border-gray-300" />
      </div>
      <SocialButton
        provider="Google"
        logoUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
      />
      <SocialButton
        provider="Facebook"
        logoUrl="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg"
      />
    </div>
  </>
);
